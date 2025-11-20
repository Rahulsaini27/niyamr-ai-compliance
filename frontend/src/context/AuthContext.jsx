import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Determine API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create dedicated Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true, // CRITICAL: Allows cookies to be sent/received
  headers: { 'Content-Type': 'application/json' },
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check Session on Load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // If backend sleeps, this might take a moment, so we wrap in try/catch
        const { data } = await api.get('/profile');
        setUser(data);
      } catch (error) {
        // 401 Unauthorized is expected if not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // 2. Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/login', { email, password });
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data.user;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      throw error;
    }
  };

  // 3. Register
  const register = async (name, email, password) => {
    try {
      await api.post('/register', { name, email, password });
      toast.success("OTP sent to your email!");
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      throw error;
    }
  };

  // 4. Verify OTP
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post('/verify-otp', { email, otp });
      setUser(data.user);
      toast.success("Email verified successfully!");
      return data.user;
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid OTP";
      toast.error(msg);
      throw error;
    }
  };

  // 5. Logout
  const logout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
      toast.info("Logged out");
    } catch (error) {
      console.error(error);
    }
  };

  // 6. Google Login Redirect
  const googleLogin = () => {
    // Redirects browser to Backend Google Endpoint
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout, googleLogin, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};