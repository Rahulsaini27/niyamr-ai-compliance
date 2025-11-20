const pdfParseLib = require('pdf-parse');
const axios = require('axios');

// --- FIX FOR "pdfParse is not a function" ERROR ---
// This handles cases where the library imports differently based on version/Node settings
const getPdfText = async (buffer) => {
  if (typeof pdfParseLib === 'function') {
    return await pdfParseLib(buffer);
  } else if (typeof pdfParseLib.default === 'function') {
    return await pdfParseLib.default(buffer);
  } else {
    // If you are using a specific version that exports .text or .parse directly
    console.log("Library export structure:", pdfParseLib);
    throw new Error("pdf-parse library is not loaded correctly. Please run: npm install pdf-parse@1.1.1");
  }
};

const analyzeDocument = async (req, res) => {
  try {
    // 1. Validate File
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { rule1, rule2, rule3 } = req.body;

    // 2. Extract Text using the helper function
    let text = "";
    try {
      const data = await getPdfText(req.file.buffer);
      text = data.text;
    } catch (err) {
      console.error("PDF Extraction Error:", err);
      return res.status(500).json({ error: "Failed to read PDF text. Ensure the file is a valid PDF." });
    }

    // 3. Construct LLM Prompt
    // We truncate text to ~15k chars to save tokens/cost while keeping enough context
    const prompt = `
      You are a strict legal and compliance auditor.
      
      DOCUMENT TEXT (Excerpt):
      ---
      ${text.substring(0, 15000)}
      ---

      RULES TO CHECK:
      1. ${rule1}
      2. ${rule2}
      3. ${rule3}

      INSTRUCTIONS:
      For EACH rule, output a JSON object.
      Return ONLY a raw JSON list of 3 objects. 
      Do NOT include markdown formatting (like \`\`\`json).
      
      REQUIRED FORMAT:
      [
        {
          "rule": "The rule text",
          "status": "PASS" or "FAIL",
          "evidence": "Exact quote from the text",
          "reasoning": "Brief explanation",
          "confidence": Number (0-100)
        },
        ...
      ]
    `;

    // 4. Call AI (OpenRouter)
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-4o-mini", // Or "meta-llama/llama-3-8b-instruct" for cheaper options
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: { 
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    // 5. Process AI Response
    let content = response.data.choices[0].message.content;
    
    // Clean up potential Markdown formatting from LLM
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parse JSON
    let results;
    try {
      results = JSON.parse(content);
    } catch (jsonError) {
      console.error("LLM JSON Parse Error:", content);
      return res.status(500).json({ error: "AI response was not valid JSON." });
    }

    // 6. Send Result
    res.json({ results });

  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error processing document" });
  }
};

module.exports = { analyzeDocument };