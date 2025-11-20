import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowRight, User, Mail, Lock, KeyRound } from 'lucide-react';

const Register = () => {
  const { register, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      setStep(2);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error("Registration failed. Email might be taken.");
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(form.email, form.otp);
      toast.success("Account verified!");
      navigate('/');
    } catch (err) {
      toast.error("Invalid OTP code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h2>
          <p className="text-slate-500 mt-2">
            {step === 1 ? "Start auditing in seconds" : `Enter code sent to ${form.email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input type="text" placeholder="Full Name" required className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input type="email" placeholder="Email" required className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input type="password" placeholder="Password" required className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">Get OTP</button>
          </form>
        ) : (
          <form onSubmit={handleOtp} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input type="text" placeholder="6-Digit Code" required className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none tracking-widest"
                onChange={e => setForm({...form, otp: e.target.value})} />
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">Verify & Login</button>
          </form>
        )}

        <div className="mt-6 text-center">
           <Link to="/login" className="text-sm text-indigo-600 font-semibold hover:underline">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;