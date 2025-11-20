import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ensure cookies are sent with every request
  axios.defaults.withCredentials = true;

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/profile');
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await axios.post('http://localhost:5000/api/auth/logout');
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};