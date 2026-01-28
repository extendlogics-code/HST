import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Plus, Search, Edit, Trash2, Save, X, Loader2, 
  Users, Target, Heart, GraduationCap, Briefcase, Activity
} from 'lucide-react';
import api from './api/api';

const iconMap = {
  Activity: <Activity size={20} />,
  Users: <Users size={20} />,
  Heart: <Heart size={20} />,
  Target: <Target size={20} />,
  GraduationCap: <GraduationCap size={20} />,
  Briefcase: <Briefcase size={20} />,
  TrendingUp: <TrendingUp size={20} />
};

const AdminImpactStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    label: '',
    value: '',
    icon: 'Users',
    sort_order: 0,
    is_active: true
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/website/impact-stats/admin');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/website/impact-stats/${editingId}`, formData);
      } else {
        await api.post('/website/impact-stats', formData);
      }
      setShowModal(false);
      fetchStats();
      setFormData(initialFormState);
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save stat');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (stat) => {
    setFormData(stat);
    setEditingId(stat.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stat?')) return;
    try {
      await api.delete(`/website/impact-stats/${id}`);
      fetchStats();
    } catch (err) {
      alert('Failed to delete stat');
    }
  };

  const filteredStats = stats.filter(s => 
    s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  return (
    <div className="font-sans text-hst-dark p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black mb-2">Impact <span className="text-hst-teal">Stats</span></h1>
            <p className="text-gray-500 font-medium">Manage the key performance indicators shown on the website</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search stats..." 
                className="w-full bg-white border-2 border-gray-100 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-hst-teal/30 transition-all font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => {
                setFormData(initialFormState);
                setEditingId(null);
                setShowModal(true);
              }}
              className="bg-hst-teal text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-hst-teal/20 hover:scale-105 transition-all"
            >
              <Plus size={20} />
              Add New
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredStats.map((stat) => (
            <motion.div 
              layout
              key={stat.id}
              className={`bg-white rounded-[32px] p-8 border-2 transition-all group ${
                stat.is_active ? 'border-gray-100 hover:border-hst-teal/30' : 'border-red-100 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-hst-light flex items-center justify-center text-hst-teal">
                  {iconMap[stat.icon] || <Users size={24} />}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(stat)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-hst-teal">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(stat.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-hst-teal">{stat.value}</div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
              {!stat.is_active && (
                <div className="mt-4 text-[10px] font-black uppercase text-red-500 tracking-widest">Inactive</div>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-hst-dark/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[40px] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-2xl font-black">{editingId ? 'Edit' : 'Add'} <span className="text-hst-teal">Stat</span></h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Label</label>
                      <input 
                        type="text" 
                        name="label"
                        required
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                        placeholder="e.g. Volunteers"
                        value={formData.label}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Value</label>
                      <input 
                        type="text" 
                        name="value"
                        required
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                        placeholder="e.g. 500+"
                        value={formData.value}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Icon</label>
                      <select 
                        name="icon"
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                        value={formData.icon}
                        onChange={handleInputChange}
                      >
                        {Object.keys(iconMap).map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Sort Order</label>
                      <input 
                        type="number" 
                        name="sort_order"
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                        value={formData.sort_order}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <input 
                      type="checkbox" 
                      name="is_active"
                      id="is_active"
                      className="w-5 h-5 rounded border-gray-300 text-hst-teal focus:ring-hst-teal"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="is_active" className="text-sm font-bold text-hst-dark">Active on Website</label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-hst-dark text-white py-4 rounded-2xl font-black text-lg hover:bg-hst-teal transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {editingId ? 'Update Stat' : 'Save Stat'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminImpactStats;