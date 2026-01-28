import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Calendar, User, MessageSquare, Trash2, 
  Loader2, ChevronRight, ExternalLink, Search, Filter, 
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import api from './api/api';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await api.get('/enquiries');
      if (response.data.success && response.data.data.length > 0) {
        setEnquiries(response.data.data);
      } else {
        setEnquiries([]);
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const MOCK_ENQUIRIES = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.s@example.com",
      phone: "+91 98765 43210",
      subject: "Educational Support",
      message: "I would like to know more about the scholarship programs for higher education. How can I apply for my son who just finished 12th grade?",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.p@gmail.com",
      phone: "+91 87654 32109",
      subject: "Donation Inquiry",
      message: "I am interested in making a recurring donation to the medical relief fund. Could you please share the 80G tax exemption details?",
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await api.patch(`/enquiries/${id}/status`, { status: newStatus });
      if (response.data.success) {
        setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return { 
          label: 'In Progress', 
          color: 'bg-amber-50 text-amber-500', 
          dot: 'bg-amber-500' 
        };
      case 'RESOLVED':
        return { 
          label: 'Resolved', 
          color: 'bg-hst-green/10 text-hst-green', 
          dot: 'bg-hst-green' 
        };
      case 'SPAM':
        return { 
          label: 'Spam', 
          color: 'bg-red-50 text-red-500', 
          dot: 'bg-red-500' 
        };
      case 'NEW':
      default:
        return { 
          label: 'New Message', 
          color: 'bg-hst-teal/5 text-hst-teal', 
          dot: 'bg-hst-teal' 
        };
    }
  };

  const filteredEnquiries = enquiries.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subject && item.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = activeFilter === 'ALL' || (item.status || 'NEW') === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const response = await api.delete(`/enquiries/${id}`);
        if (response.data.success) {
          setEnquiries(enquiries.filter(e => e.id !== id));
        }
      } catch (err) {
        console.error('Failed to delete enquiry:', err);
        alert('Failed to delete enquiry. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-hst-dark mb-2">User <span className="text-hst-teal">Enquiries</span></h1>
          <p className="text-gray-500 font-medium">Review and respond to messages from the website</p>
        </div>
        
        <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Enquiries:</span>
          <span className="text-lg font-black text-hst-teal">{filteredEnquiries.length}</span>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hst-teal transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search name, email or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-gray-100 focus:border-hst-teal/20 rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-bold text-hst-dark shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All', icon: <MessageSquare size={14} /> },
            { id: 'NEW', label: 'New', icon: <Clock size={14} /> },
            { id: 'IN_PROGRESS', label: 'In Progress', icon: <Loader2 size={14} /> },
            { id: 'RESOLVED', label: 'Resolved', icon: <CheckCircle size={14} /> },
            { id: 'SPAM', label: 'Spam', icon: <AlertCircle size={14} /> }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/20'
                  : 'text-gray-400 hover:text-hst-dark hover:bg-gray-50'
              }`}
            >
              {filter.icon}
              {filter.label}
              {activeFilter === filter.id && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-md text-[9px]">
                  {filteredEnquiries.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[40px] p-32 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-hst-teal mb-4" size={48} />
          <p className="text-gray-400 font-bold animate-pulse">Loading messages...</p>
        </div>
      ) : filteredEnquiries.length > 0 ? (
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredEnquiries.map((item, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                key={item.id}
                className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-hst-dark/5 transition-all group overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row min-h-[280px]">
                  {/* Left Panel: Contact Info */}
                  <div className="lg:w-80 bg-gray-50/50 p-8 border-r border-gray-50 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-hst-teal">
                        <Clock size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{formatDate(item.created_at)}</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-hst-dark shrink-0">
                            <User size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Sender</p>
                            <p className="font-black text-hst-dark truncate">{item.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-hst-teal shrink-0">
                            <Mail size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                            <a href={`mailto:${item.email}`} className="font-bold text-sm text-gray-600 hover:text-hst-teal transition-colors truncate block">{item.email}</a>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-hst-green shrink-0">
                            <Phone size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Phone</p>
                            <a href={`tel:${item.phone}`} className="font-bold text-sm text-gray-600 hover:text-hst-green transition-colors truncate block">{item.phone}</a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-2">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-500 font-bold text-xs hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-hst-teal text-white shadow-lg shadow-hst-teal/20 hover:scale-105 transition-all">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Right Panel: Message Content */}
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</p>
                        <select 
                          value={item.status || 'NEW'}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-3 py-1 ${getStatusConfig(item.status).color} text-[10px] font-black rounded-full uppercase tracking-wider outline-none border-none cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          <option value="NEW">New Message</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="SPAM">Spam</option>
                        </select>
                      </div>
                      <h3 className="text-xl font-black text-hst-dark">{item.subject || 'General Enquiry'}</h3>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Message</p>
                      <div className="bg-hst-light/20 p-6 rounded-2xl border border-hst-light/50 text-gray-600 font-medium leading-relaxed relative">
                        <MessageSquare className="absolute right-4 top-4 text-hst-light/50" size={24} />
                        {item.message}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <div className={`w-2 h-2 rounded-full ${getStatusConfig(item.status).dot}`}></div>
                        Status: {getStatusConfig(item.status).label}
                      </div>
                      <button className="flex items-center gap-2 font-black text-hst-teal text-sm hover:translate-x-1 transition-transform">
                        Reply Now
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-24 text-center border border-gray-100 shadow-sm">
          <div className="bg-hst-light/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <MessageSquare className="text-gray-300" size={48} />
          </div>
          <h3 className="text-2xl font-black text-hst-dark mb-3">No Enquiries Found</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            When users submit messages through the contact form, they will appear here for you to manage.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-hst-teal/10 text-hst-teal flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">New</p>
            <p className="text-lg font-black text-hst-dark">
              {enquiries.filter(e => (e.status || 'NEW') === 'NEW').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Loader2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">In Progress</p>
            <p className="text-lg font-black text-hst-dark">
              {enquiries.filter(e => e.status === 'IN_PROGRESS').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-hst-green/10 text-hst-green flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resolved</p>
            <p className="text-lg font-black text-hst-dark">
              {enquiries.filter(e => e.status === 'RESOLVED').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;