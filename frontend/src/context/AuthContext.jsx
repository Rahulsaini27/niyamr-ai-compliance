import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// 1. Create a configured Axios instance
// This ensures all calls from AuthContext use the correct base URL and credentials
const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  withCredentials: true, // CRITICAL: Sends the HTTP-Only Cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Create the Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Check Session on Mount (Persist Login)
  useEffect(() => {
    const checkSession = async () => {
      try {
        // We don't show toast here to avoid annoying popups on refresh
        const { data } = await api.get('/profile');
        setUser(data);
      } catch (error) {
        // If 401 (Not Authorized), just set user to null, no error needed
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // 4. Login Action
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/login', { email, password });
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data.user; // Return data so the Component can handle redirect
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error; // Throw error so Component can stop loading state
    }
  };

  // 5. Register Action
  const register = async (name, email, password) => {
    try {
      await api.post('/register', { name, email, password });
      toast.success("Account created! OTP sent to email.");
      // We don't set user here because they need to verify OTP first
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  // 6. Verify OTP Action
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post('/verify-otp', { email, otp });
      setUser(data.user);
      toast.success("Email Verified! You are logged in.");
      return data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";
      toast.error(message);
      throw error;
    }
  };

  // 7. Logout Action
  const logout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
      toast.info("Logged out successfully");
      // Optional: Hard reload to clear any in-memory states
      // window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // 8. Google Auth Helper
  const googleLogin = () => {
    // We redirect the browser window, not an AJAX call
    window.location.href = "http://localhost:5000/auth/google";
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyOtp,
    logout,
    googleLogin,
    isAuthenticated: !!user, // Boolean helper
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 9. Custom Hook for easy access
// Usage: const { user, login } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};