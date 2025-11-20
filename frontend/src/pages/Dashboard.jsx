import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [rules, setRules] = useState(["", "", ""]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("rule1", rules[0]);
    formData.append("rule2", rules[1]);
    formData.append("rule3", rules[2]);

    try {
      const res = await axios.post("http://localhost:5000/api/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResults(res.data.results);
    } catch (err) { alert("Scan failed"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <button onClick={logout} className="bg-gray-800 text-white px-4 py-2 rounded">Logout</button>
      </div>
      
      {/* Insert the UI from previous assignment here (Inputs, File Upload, Table) */}
      <div className="bg-white p-6 shadow rounded">
         <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-4 block" />
         {rules.map((r, i) => (
           <input key={i} className="border block w-full mb-2 p-2" placeholder={`Rule ${i+1}`} 
             value={r} onChange={e => {
               const newRules = [...rules]; newRules[i] = e.target.value; setRules(newRules);
             }} 
           />
         ))}
         <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">
           {loading ? "Analyzing..." : "Check Document"}
         </button>

         {results && <pre className="mt-4 bg-gray-100 p-4">{JSON.stringify(results, null, 2)}</pre>}
      </div>
    </div>
  );
};
export default Dashboard;