import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to continue</p>
        </div>

        <button onClick={googleLogin} className="w-full flex items-center justify-center gap-3 border border-slate-300 py-3 rounded-lg hover:bg-slate-50 transition font-medium text-slate-700 mb-6">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
          Continue with Google
        </button>

        <div className="border-t border-slate-200 mb-6 relative">
          <span className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-slate-400">or</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input 
              type="email" placeholder="Email" required
              className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input 
              type="password" placeholder="Password" required
              className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:opacity-70">
            {loading ? "Signing in..." : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600">
          No account? <Link to="/register" className="text-indigo-600 font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;