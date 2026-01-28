import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Search, Loader2, Info, Plus, X, Save, Edit, Trash2,
  Building2, BookOpen, Clock, Activity, FileText, Globe, Mail,
  LayoutList, CheckCircle2, AlertCircle, Send, ArrowRight, ArrowUpDown,
  Filter
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from './api/api';

const InputField = ({ label, icon, value, isEditing, onChange, isTextArea, type = "text", placeholder, required }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
      {icon}
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isEditing ? (
      isTextArea ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold min-h-[100px] resize-none"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
        />
      )
    ) : (
      <div className="bg-hst-light/10 border-2 border-transparent px-6 py-4 rounded-2xl font-bold text-hst-dark min-h-[58px] flex items-center">
        {value || <span className="text-gray-300 font-medium italic">Not Provided</span>}
      </div>
    )}
  </div>
);

const AdminApplicationWindows = () => {
  const location = useLocation();
  const [windows, setWindows] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingWindow, setViewingWindow] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState('open_date'); // 'open_date' or 'close_date'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const initialWindowState = {
    donor_id: location.state?.donorId || '',
    program_name: '',
    open_date: '',
    close_date: '',
    category: '',
    required_documents: '',
    submission_method: 'portal',
    status: 'draft',
    submission_details: ''
  };

  const [newWindowData, setNewWindowData] = useState(initialWindowState);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    if (statusParam) {
      setFilterStatus(statusParam);
    }
    
    if (location.state?.donorId) {
      setShowAddModal(true);
    }
  }, [location.search, location.state]);

  const fetchData = async () => {
    try {
      const [windowsRes, donorsRes] = await Promise.all([
        api.get('/application-windows'),
        api.get('/donors')
      ]);
      if (windowsRes.data.success) setWindows(windowsRes.data.data);
      if (donorsRes.data.success) setDonors(donorsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newWindowData.donor_id || !newWindowData.program_name || !newWindowData.open_date || !newWindowData.close_date || !newWindowData.category) {
      alert('Please fill in mandatory fields: Donor, Program Name, Dates, and Category');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/application-windows', newWindowData);
      if (data.success) {
        setShowAddModal(false);
        setNewWindowData(initialWindowState);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add application window');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.patch(`/application-windows/${viewingWindow.id}`, viewingWindow);
      if (data.success) {
        setIsEditing(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update window');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application window?')) return;
    try {
      const { data } = await api.delete(`/application-windows/${id}`);
      if (data.success) {
        setViewingWindow(null);
        fetchData();
      }
    } catch (err) {
      alert('Failed to delete window');
    }
  };

  const filteredWindows = windows
    .filter(w => {
      const matchesSearch = w.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || w.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || w.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const categories = ['All', ...new Set(windows.map(w => w.category))];
  const statuses = ['All', 'draft', 'ready', 'submitted', 'shortlisted', 'closed'];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'ready': return 'bg-blue-100 text-blue-600';
      case 'submitted': return 'bg-purple-100 text-purple-600';
      case 'shortlisted': return 'bg-green-100 text-green-600';
      case 'closed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 font-sans p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-hst-dark mb-2">Application <span className="text-hst-teal">Windows</span></h1>
          <p className="text-gray-500 font-medium">Manage grant opportunities and submission timelines</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-hst-dark text-white px-8 py-4 rounded-2xl font-black hover:bg-hst-teal transition-all shadow-xl shadow-hst-dark/10 flex items-center gap-3"
        >
          <Plus size={20} />
          New Window
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hst-teal transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by program, donor, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-bold text-hst-dark"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-hst-light/20 px-4 py-2 rounded-xl">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent outline-none font-bold text-sm text-hst-dark"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-hst-light/20 px-4 py-2 rounded-xl">
            <Activity size={16} className="text-gray-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent outline-none font-bold text-sm text-hst-dark"
            >
              <option value="All">All Statuses</option>
              {statuses.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-hst-light/20 px-4 py-2 rounded-xl">
            <ArrowUpDown size={16} className="text-gray-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none font-bold text-sm text-hst-dark"
            >
              <option value="open_date">Sort by Open Date</option>
              <option value="close_date">Sort by Close Date</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="ml-2 text-hst-teal hover:text-hst-dark transition-colors font-black text-xs uppercase"
            >
              {sortOrder}
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredWindows.map((win, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              key={win.id}
              className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col gap-6 group"
            >
              <div className="flex justify-between items-start">
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(win.status)}`}>
                  {win.status}
                </div>
                <button 
                  onClick={() => setViewingWindow(win)}
                  className="w-10 h-10 rounded-xl bg-hst-light/50 text-hst-dark hover:bg-hst-teal hover:text-white transition-all flex items-center justify-center"
                >
                  <Info size={18} />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-black text-hst-dark mb-1 line-clamp-1">{win.program_name}</h3>
                <p className="text-sm font-bold text-hst-teal flex items-center gap-2">
                  <Building2 size={14} />
                  {win.donor_name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-hst-light/20 p-4 rounded-2xl">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Open Date</p>
                  <p className="text-sm font-bold text-hst-dark">{new Date(win.open_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-hst-light/20 p-4 rounded-2xl border-l-4 border-hst-teal">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Close Date</p>
                  <p className="text-sm font-bold text-hst-dark">{new Date(win.close_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={14} />
                  {win.category}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Send size={14} />
                  {win.submission_method}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setShowAddModal(false)}
              className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 bg-hst-dark text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-hst-teal rounded-2xl flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Create Application Window</h2>
                    <p className="text-sm text-white/70 font-medium">Define new grant opportunity</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><X size={20} /></button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Building2 size={18} />
                      Select Donor *
                    </label>
                    <select 
                      value={newWindowData.donor_id}
                      onChange={(e) => setNewWindowData({...newWindowData, donor_id: e.target.value})}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                    >
                      <option value="">Select Donor</option>
                      {donors.map(d => (
                        <option key={d.id} value={d.id}>{d.donor_name}</option>
                      ))}
                    </select>
                  </div>

                  <InputField 
                    label="Program Name" 
                    icon={<FileText size={18} />} 
                    value={newWindowData.program_name} 
                    isEditing={true} 
                    required 
                    onChange={(val) => setNewWindowData({...newWindowData, program_name: val})}
                  />

                  <InputField 
                    label="Open Date" 
                    icon={<Calendar size={18} />} 
                    value={newWindowData.open_date} 
                    isEditing={true} 
                    type="date" 
                    required 
                    onChange={(val) => setNewWindowData({...newWindowData, open_date: val})}
                  />

                  <InputField 
                    label="Close Date" 
                    icon={<Calendar size={18} />} 
                    value={newWindowData.close_date} 
                    isEditing={true} 
                    type="date" 
                    required 
                    onChange={(val) => setNewWindowData({...newWindowData, close_date: val})}
                  />

                  <InputField 
                    label="Category" 
                    icon={<BookOpen size={18} />} 
                    value={newWindowData.category} 
                    isEditing={true} 
                    required 
                    placeholder="Health, Education, WASH etc."
                    onChange={(val) => setNewWindowData({...newWindowData, category: val})}
                  />

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Send size={18} />
                      Submission Method
                    </label>
                    <select 
                      value={newWindowData.submission_method}
                      onChange={(e) => setNewWindowData({...newWindowData, submission_method: e.target.value})}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                    >
                      <option value="portal">Online Portal</option>
                      <option value="email">Email Submission</option>
                      <option value="offline">Physical / Offline</option>
                    </select>
                  </div>
                </div>

                <InputField 
                  label="Required Documents" 
                  icon={<LayoutList size={18} />} 
                  value={newWindowData.required_documents} 
                  isEditing={true} 
                  isTextArea 
                  placeholder="e.g. Proposal, Budget, Audit Reports, Annexures"
                  onChange={(val) => setNewWindowData({...newWindowData, required_documents: val})}
                />

                <InputField 
                  label="Submission Details" 
                  icon={<Globe size={18} />} 
                  value={newWindowData.submission_details} 
                  isEditing={true} 
                  placeholder="Portal URL or Submission Email Address"
                  onChange={(val) => setNewWindowData({...newWindowData, submission_details: val})}
                />

                <div className="pt-6">
                  <button 
                    disabled={submitting}
                    className="w-full bg-hst-dark text-white py-6 rounded-3xl font-black text-xl hover:bg-hst-teal transition-all shadow-2xl shadow-hst-dark/20 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <Save />}
                    Save Application Window
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View/Edit Modal */}
      <AnimatePresence>
        {viewingWindow && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setViewingWindow(null)}
              className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 bg-hst-light/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-hst-dark shadow-sm">
                    <Info size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-hst-dark">{isEditing ? 'Edit Window' : 'Window Details'}</h2>
                    <p className="text-sm text-gray-500 font-medium">{viewingWindow.program_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isEditing && (
                    <button 
                      onClick={() => handleDelete(viewingWindow.id)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <button onClick={() => setViewingWindow(null)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-hst-dark"><X size={20} /></button>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Building2 size={18} />
                      Donor
                    </label>
                    {isEditing ? (
                      <select 
                        value={viewingWindow.donor_id}
                        onChange={(e) => setViewingWindow({...viewingWindow, donor_id: e.target.value})}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                      >
                        {donors.map(d => (
                          <option key={d.id} value={d.id}>{d.donor_name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="bg-hst-light/10 px-6 py-4 rounded-2xl font-bold text-hst-dark min-h-[58px] flex items-center">
                        {viewingWindow.donor_name}
                      </div>
                    )}
                  </div>

                  <InputField 
                    label="Program Name" 
                    icon={<FileText size={18} />} 
                    value={viewingWindow.program_name} 
                    isEditing={isEditing} 
                    onChange={(val) => setViewingWindow({...viewingWindow, program_name: val})}
                  />

                  <InputField 
                    label="Open Date" 
                    icon={<Calendar size={18} />} 
                    value={viewingWindow.open_date?.split('T')[0]} 
                    isEditing={isEditing} 
                    type="date" 
                    onChange={(val) => setViewingWindow({...viewingWindow, open_date: val})}
                  />

                  <InputField 
                    label="Close Date" 
                    icon={<Calendar size={18} />} 
                    value={viewingWindow.close_date?.split('T')[0]} 
                    isEditing={isEditing} 
                    type="date" 
                    onChange={(val) => setViewingWindow({...viewingWindow, close_date: val})}
                  />

                  <InputField 
                    label="Category" 
                    icon={<BookOpen size={18} />} 
                    value={viewingWindow.category} 
                    isEditing={isEditing} 
                    onChange={(val) => setViewingWindow({...viewingWindow, category: val})}
                  />

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Activity size={18} />
                      Status
                    </label>
                    {isEditing ? (
                      <select 
                        value={viewingWindow.status}
                        onChange={(e) => setViewingWindow({...viewingWindow, status: e.target.value})}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                      >
                        <option value="draft">Draft</option>
                        <option value="ready">Ready</option>
                        <option value="submitted">Submitted</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="closed">Closed</option>
                      </select>
                    ) : (
                      <div className={`px-6 py-4 rounded-2xl font-bold min-h-[58px] flex items-center ${getStatusStyle(viewingWindow.status)}`}>
                        {viewingWindow.status.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <InputField 
                  label="Required Documents" 
                  icon={<LayoutList size={18} />} 
                  value={viewingWindow.required_documents} 
                  isEditing={isEditing} 
                  isTextArea 
                  onChange={(val) => setViewingWindow({...viewingWindow, required_documents: val})}
                />

                <InputField 
                  label="Submission Details" 
                  icon={<Globe size={18} />} 
                  value={viewingWindow.submission_details} 
                  isEditing={isEditing} 
                  onChange={(val) => setViewingWindow({...viewingWindow, submission_details: val})}
                />

                <div className="pt-6 flex gap-4">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-100 text-hst-dark py-4 rounded-2xl font-black hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdateSubmit}
                        disabled={submitting}
                        className="flex-[2] bg-hst-dark text-white py-4 rounded-2xl font-black hover:bg-hst-teal transition-all flex items-center justify-center gap-2"
                      >
                        {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-hst-dark text-white py-4 rounded-2xl font-black hover:bg-hst-teal transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={20} />
                      Edit Window Details
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminApplicationWindows;
