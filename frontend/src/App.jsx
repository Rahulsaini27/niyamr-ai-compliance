import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          
          {/* Footer (Optional) */}
          <footer className="py-6 text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} NIYAMR AI. All rights reserved.
          </footer>
        </div>
        
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;