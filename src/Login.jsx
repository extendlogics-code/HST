import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import api from './api/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [headerRes, footerRes] = await Promise.all([
          api.get('/website/header'),
          api.get('/website/footer')
        ]);
        if (headerRes.data.success) setHeaderData(headerRes.data.data);
        if (footerRes.data.success) setFooterData(footerRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hst-light/30 font-sans text-hst-dark overflow-x-hidden">
      <Header data={headerData} />
      
      <main className="max-w-md mx-auto pt-40 pb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-hst-dark/5 p-10 border border-gray-100"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-hst-teal/10 text-hst-teal rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-black mb-2">Admin Login</h1>
            <p className="text-gray-500 font-medium">Access enquiries and donor data</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="space-y-4">
                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border border-red-200">
                  {error}
                </div>
                {import.meta.env.DEV && (
                  <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-xs border border-blue-100 font-medium">
                    <p className="font-bold mb-1">Development Credentials:</p>
                    <p>Email: admin@helptoselfhelptrust.org</p>
                    <p>Password: admin123</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 ml-1">Email</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="w-full bg-hst-light/30 border-2 border-gray-300 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full bg-hst-light/30 border-2 border-gray-300 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full hst-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Login
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>
      <Footer data={footerData} />
    </div>
  );
};

export default Login;
