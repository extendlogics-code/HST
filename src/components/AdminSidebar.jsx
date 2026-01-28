import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings, 
  Users, 
  ShieldCheck,
  LogOut,
  ChevronRight,
  Mail,
  IndianRupee,
  ChevronDown,
  Calendar,
  Globe,
  Menu,
  Layout,
  FileText,
  Scale,
  Image as ImageIcon,
  Info,
  Zap,
  BarChart2,
  Users2,
  Heart,
  Newspaper,
  MousePointer,
  ArrowUpDown,
  X
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ activeTab, isOpen, onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useAuth();
  const [isDonorsOpen, setIsDonorsOpen] = useState(currentPath.includes('/admin/donors'));
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(currentPath.includes('/admin/applications'));
  const [isGenerate80GOpen, setIsGenerate80GOpen] = useState(currentPath.includes('/admin/generate-80g') || currentPath.includes('/admin/history'));

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'ngo'
    },
    // Website Management Items (Flattened)
    {
      name: 'Analytics',
      path: '/admin/website',
      icon: <LayoutDashboard size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Navbar Mgmt',
      path: '/admin/navbar',
      icon: <Menu size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Header & Footer',
      path: '/admin/header-footer',
      icon: <Layout size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Landing Pages',
      path: '/admin/landing-pages',
      icon: <FileText size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Legal',
      path: '/admin/legal',
      icon: <Scale size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Hero Slides',
      path: '/admin/hero-slides',
      icon: <ImageIcon size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'About Section',
      path: '/admin/about',
      icon: <Info size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Initiatives',
      path: '/admin/initiatives',
      icon: <Zap size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Impact Stats',
      path: '/admin/impact-stats',
      icon: <ArrowUpDown size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Donate Page',
      path: '/admin/donate',
      icon: <Heart size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Partners',
      path: '/admin/partners',
      icon: <Users2 size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Causes (Gallery)',
      path: '/admin/causes',
      icon: <Heart size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'News & Updates',
      path: '/admin/news',
      icon: <Newspaper size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'CTA Section',
      path: '/admin/cta',
      icon: <MousePointer size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Layout Order',
      path: '/admin/website-layout',
      icon: <ArrowUpDown size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'website'
    },
    {
      name: 'Enquiries',
      path: '/admin/enquiries',
      icon: <Mail size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'ngo'
    },
    {
      name: 'Donations',
      path: '/admin/donations',
      icon: <IndianRupee size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'ngo'
    },
    {
      name: 'Application Windows',
      path: '/admin/applications',
      icon: <Calendar size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'ngo',
      hasSubmenu: true,
      submenu: [
        { name: 'All Windows', path: '/admin/applications' },
        { name: 'Active Cycles', path: '/admin/applications?status=ready' },
        { name: 'By Category', path: '/admin/applications?filter=category' }
      ]
    },
    {
      name: 'Donors',
      path: '/admin/donors',
      icon: <Users size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'ngo',
      hasSubmenu: true,
      submenu: [
        { name: 'All Donors', path: '/admin/donors' },
        { name: 'Individual', path: '/admin/donors/individual' },
        { name: 'Corporate', path: '/admin/donors/corporate' },
        { name: 'International NGO', path: '/admin/donors/international' }
      ]
    },
    {
      name: 'Generate 80G',
      path: '/admin/generate-80g',
      icon: <PlusCircle size={20} />,
      roles: ['ADMIN', 'STAFF'],
      category: 'ngo',
      hasSubmenu: true,
      submenu: [
        { name: 'New Certificate', path: '/admin/generate-80g' },
        { name: 'Certificate History', path: '/admin/history' },
        { name: '80 G Cert Config', path: '/admin/settings', roles: ['ADMIN'] }
      ]
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users size={20} />,
      roles: ['ADMIN'],
      category: 'ngo'
    },
    {
      name: 'Audit Log',
      path: '/admin/audit-log',
      icon: <ShieldCheck size={20} />,
      roles: ['ADMIN'],
      category: 'ngo'
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const filteredMenu = menuItems.filter(item => {
    const roleMatch = !item.roles || (user && item.roles.includes(user.role));
    const categoryMatch = item.category === activeTab;
    return roleMatch && categoryMatch;
  });

  return (
    <>
      <div 
        className={`fixed inset-y-0 left-0 w-72 h-screen bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <Link to="/admin/generate-80g" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-hst-teal rounded-xl flex items-center justify-center text-white shadow-lg shadow-hst-teal/20 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xl font-black text-hst-dark leading-none">HST</h1>
              <p className="text-[10px] font-bold text-hst-teal uppercase tracking-widest mt-1 truncate">Admin Panel</p>
            </div>
          </Link>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-hst-dark hover:bg-gray-100 transition-all ml-2 shrink-0"
            title="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {filteredMenu.map((item) => {
          const isActive = currentPath === item.path;
          
          if (item.hasSubmenu) {
            let isOpen, setIsOpen;
            if (item.name === 'Donors') {
              isOpen = isDonorsOpen;
              setIsOpen = setIsDonorsOpen;
            } else if (item.name === 'Application Windows') {
              isOpen = isApplicationsOpen;
              setIsOpen = setIsApplicationsOpen;
            } else if (item.name === 'Generate 80G') {
              isOpen = isGenerate80GOpen;
              setIsOpen = setIsGenerate80GOpen;
            }

            return (
              <div key={item.path} className="space-y-1">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                    isActive 
                      ? 'bg-hst-teal text-white shadow-xl shadow-hst-teal/20 translate-x-1' 
                      : 'text-gray-500 hover:bg-hst-light/50 hover:text-hst-dark'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-hst-teal'} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col pl-12 space-y-1"
                    >
                      {item.submenu.map((sub) => {
                        const isSubActive = location.pathname + location.search === sub.path;
                        const subRoleMatch = !sub.roles || (user && sub.roles.includes(user.role));
                        
                        if (!subRoleMatch) return null;
                        
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                              isSubActive
                                ? 'text-hst-teal bg-hst-teal/5'
                                : 'text-gray-400 hover:text-hst-teal hover:bg-hst-light/30'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                isActive 
                  ? 'bg-hst-teal text-white shadow-xl shadow-hst-teal/20 translate-x-1' 
                  : 'text-gray-500 hover:bg-hst-light/50 hover:text-hst-dark'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-hst-teal'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>
    </div>
    </>
  );
};

export default AdminSidebar;
