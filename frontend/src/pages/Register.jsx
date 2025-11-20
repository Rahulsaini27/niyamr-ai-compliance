import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, KeyRound } from 'lucide-react';

const Register = () => {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setStep(2);
    } catch (err) {
      // Error handled by Context
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(form.email, form.otp);
      navigate('/');
    } catch (err) {
      // Error handled by Context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{step === 1 ? "Create Account" : "Verify Email"}</h2>
          <p className="text-slate-500 mt-2">{step === 1 ? "Start your journey" : `Code sent to ${form.email}`}</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative"><User className="absolute left-3 top-3.5 text-slate-400" size={20}/><input type="text" placeholder="Name" required className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="relative"><Mail className="absolute left-3 top-3.5 text-slate-400" size={20}/><input type="email" placeholder="Email" required className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="relative"><Lock className="absolute left-3 top-3.5 text-slate-400" size={20}/><input type="password" placeholder="Password" required className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setForm({...form, password: e.target.value})} /></div>
            <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-70">{loading ? "Sending..." : "Get OTP"}</button>
          </form>
        ) : (
          <form onSubmit={handleOtp} className="space-y-4">
            <div className="relative"><KeyRound className="absolute left-3 top-3.5 text-slate-400" size={20}/><input type="text" placeholder="6-Digit Code" required className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none tracking-widest" onChange={e => setForm({...form, otp: e.target.value})} /></div>
            <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-70">{loading ? "Verifying..." : "Verify & Login"}</button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-indigo-600 font-bold">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;