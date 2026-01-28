import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, FileText, LogOut, History, Settings, PlusCircle } from 'lucide-react';

const AdminNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: 'Enquiries',
      path: '/admin/enquiries',
      icon: <MessageSquare size={20} />
    },
    {
      name: 'Issue 80G',
      path: '/admin/generate-80g',
      icon: <PlusCircle size={20} />
    },
    {
      name: 'History',
      path: '/admin/history',
      icon: <History size={20} />
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('hst_admin_token');
    localStorage.removeItem('hst_admin_user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link to="/admin/enquiries" className="flex items-center gap-2">
              <span className="text-xl font-black text-hst-dark uppercase tracking-tighter">
                HST <span className="text-hst-teal">Admin</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    currentPath === item.path
                      ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/20'
                      : 'text-gray-500 hover:bg-hst-light/50 hover:text-hst-dark'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
