import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, XCircle, Loader2, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [rules, setRules] = useState(["", "", ""]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Restore rules if user was redirected to login and came back
  useEffect(() => {
    const savedRules = sessionStorage.getItem('pendingRules');
    if (savedRules && user) {
      setRules(JSON.parse(savedRules));
      toast.info("Rules restored! Please re-upload your document.", { position: "top-center" });
      sessionStorage.removeItem('pendingRules'); 
    }
  }, [user]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || rules.some(r => !r.trim())) {
      toast.warn("Please upload a PDF and enter all 3 rules.");
      return;
    }

    if (!user) {
      sessionStorage.setItem('pendingRules', JSON.stringify(rules));
      toast.info("Please login to analyze documents.");
      navigate('/login');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    rules.forEach((r, i) => formData.append(`rule${i + 1}`, r));

    try {
      const { data } = await axios.post("http://localhost:5000/api/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResults(data.results);
      toast.success("Analysis Complete!");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
            Automated Document <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Compliance Auditing
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Upload your contracts or reports. Define your rules. 
            Our AI checks them instantly with 99% accuracy.
          </p>
        </motion.div>
      </div>

      {/* Main Tool Area */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Left Side: Inputs */}
          <div className="md:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              {/* Step 1: Upload */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">1. Upload Document (PDF)</label>
                <div 
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative
                    ${dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}
                    ${file ? "bg-green-50 border-green-300" : ""}
                  `}
                >
                  <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {file ? (
                    <div className="text-green-700">
                      <FileText className="mx-auto mb-2" size={32} />
                      <p className="text-sm font-semibold truncate px-4">{file.name}</p>
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      <UploadCloud className="mx-auto mb-2" size={32} />
                      <p className="text-sm">Drag & Drop or Click</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Rules */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">2. Define Compliance Rules</label>
                <div className="space-y-3">
                  {rules.map((rule, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 text-xs font-bold">#{idx+1}</span>
                      </div>
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => { const n = [...rules]; n[idx] = e.target.value; setRules(n); }}
                        placeholder="e.g. 'Must contain a termination clause'"
                        className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18}/> Run Audit</>}
              </button>
            </motion.div>
          </div>

          {/* Right Side: Results */}
          <div className="md:col-span-7">
             <AnimatePresence mode="wait">
              {results ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {results.map((res, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-5 rounded-xl border-l-4 bg-white shadow-md
                        ${res.status.toUpperCase() === "PASS" ? "border-l-green-500" : "border-l-red-500"}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800">{res.rule}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1
                          ${res.status === "PASS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                        `}>
                          {res.status === "PASS" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {res.status}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-100 mb-2">
                        <p className="text-xs text-slate-500 uppercase font-bold">Evidence</p>
                        <p className="text-sm text-slate-700 italic">"{res.evidence}"</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-sm text-slate-600">{res.reasoning}</p>
                        <div className="text-right ml-4">
                          <span className="block text-xs text-slate-400">Confidence</span>
                          <span className="font-bold text-slate-700">{res.confidence}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                  <ShieldCheck size={64} className="opacity-20 mb-4" />
                  <p className="font-medium">Results will appear here</p>
                  <p className="text-sm">Ready to process</p>
                </div>
              )}
             </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;