import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ScrollNavigator from './ScrollNavigator';
import { Globe, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('ngo');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-hide only on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'ngo') {
      navigate('/admin/dashboard');
    } else if (tab === 'website') {
      navigate('/admin/website');
    }
  };

  // Automatically set active tab based on current path
  useEffect(() => {
    const websitePaths = [
      '/admin/navbar',
      '/admin/header-footer',
      '/admin/landing-pages',
      '/admin/legal',
      '/admin/hero-slides',
      '/admin/about',
      '/admin/initiatives',
      '/admin/impact-stats',
      '/admin/partners',
      '/admin/donate',
      '/admin/causes',
      '/admin/news',
      '/admin/cta',
      '/admin/website-layout',
      '/admin/website'
    ];
    
    if (websitePaths.some(path => location.pathname.startsWith(path))) {
      setActiveTab('website');
    } else {
      setActiveTab('ngo');
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AdminSidebar activeTab={activeTab} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : 'pl-0'}`}>
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:gap-10">
            {/* Hamburger Toggle - Hides when sidebar is open */}
            <AnimatePresence>
              {!isSidebarOpen && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2.5 rounded-xl bg-hst-light/50 text-hst-teal hover:bg-hst-teal/10 transition-all flex"
                >
                  <Menu size={24} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Top Nav Tabs */}
            <div className="flex items-center bg-hst-light/50 p-1.5 rounded-2xl border border-gray-100">
              <button
                onClick={() => handleTabChange('ngo')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === 'ngo'
                    ? 'bg-white text-hst-teal shadow-sm ring-1 ring-gray-100'
                    : 'text-gray-400 hover:text-hst-dark'
                }`}
              >
                <ShieldCheck size={16} />
                NGO Management
              </button>
              <button
                onClick={() => handleTabChange('website')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === 'website'
                    ? 'bg-white text-hst-teal shadow-sm ring-1 ring-gray-100'
                    : 'text-gray-400 hover:text-hst-dark'
                }`}
              >
                <Globe size={16} />
                Website Management
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* User Profile & Logout */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-hst-light flex items-center justify-center text-hst-teal font-black text-sm border-2 border-white shadow-sm">
                  {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="hidden xl:block">
                  <p className="text-sm font-black text-hst-dark truncate leading-none">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{user?.role || 'Super Admin'}</p>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 font-bold text-xs hover:bg-red-50 transition-all group border border-transparent hover:border-red-100"
              >
                <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-10">
          {children}
        </main>
        <ScrollNavigator />
      </div>
    </div>
  );
};

export default AdminLayout;
