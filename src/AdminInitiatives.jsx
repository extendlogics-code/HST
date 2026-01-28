import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Plus, Search, Edit, Trash2, Save, X, Loader2, 
  MapPin, CheckCircle, Image as ImageIcon, Upload, MoveUp, MoveDown,
  LayoutList, ExternalLink, Target, Heart, Users, Home, BookOpen, Sprout
} from 'lucide-react';
import api, { BASE_URL } from './api/api';

const iconMap = {
  Activity: <Activity size={20} />,
  Users: <Users size={20} />,
  BookOpen: <BookOpen size={20} />,
  Sprout: <Sprout size={20} />,
  Heart: <Heart size={20} />,
  Home: <Home size={20} />,
  Target: <Target size={20} />
};

const AdminInitiatives = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const initialFormState = {
    title: '',
    slug: '',
    icon: 'Activity',
    location: '',
    status: 'Ongoing',
    description: '',
    target_group: '',
    key_impact: '',
    foundation: '',
    images: [],
    sort_order: 0,
    is_active: true
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const fetchInitiatives = async () => {
    try {
      const response = await api.get('/initiatives/admin');
      if (response.data.success) {
        const parsedData = response.data.data.map(project => ({
          ...project,
          images: typeof project.images === 'string' 
            ? JSON.parse(project.images) 
            : project.images || []
        }));
        setInitiatives(parsedData);
      }
    } catch (err) {
      console.error('Failed to fetch initiatives:', err);
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

    // Auto-generate slug from title if title changes and we're not editing
    if (name === 'title' && !editingId) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setSubmitting(true);
      const response = await api.post('/initiatives/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, response.data.url]
        }));
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/initiatives/${editingId}`, formData);
      } else {
        await api.post('/initiatives', formData);
      }
      setShowModal(false);
      fetchInitiatives();
      setFormData(initialFormState);
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save initiative');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (initiative) => {
    setFormData(initiative);
    setEditingId(initiative.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this initiative?')) return;
    try {
      await api.delete(`/initiatives/${id}`);
      fetchInitiatives();
    } catch (err) {
      alert('Failed to delete initiative');
    }
  };

  const filteredInitiatives = initiatives.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.location.toLowerCase().includes(searchTerm.toLowerCase())
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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black mb-2">Our <span className="text-hst-teal">Initiatives</span></h1>
            <p className="text-gray-500 font-medium">Manage and update your impact projects dynamically</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search initiatives..." 
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

        {/* Initiatives Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInitiatives.map((initiative) => (
            <motion.div 
              layout
              key={initiative.id}
              className={`bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col ${!initiative.is_active ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="aspect-[16/9] relative">
                {initiative.images?.[0] ? (
                  <img 
                    src={(() => {
                      const url = initiative.images[0];
                      if (!url) return '';
                      if (url.startsWith('http')) {
                        return url.replace('http://localhost:5000', BASE_URL);
                      }
                      const cleanPath = url.startsWith('/') ? url : `/${url}`;
                      return `${BASE_URL}${cleanPath}`;
                    })()} 
                    alt={initiative.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-hst-light flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${initiative.is_active ? 'bg-hst-green text-white' : 'bg-gray-400 text-white'}`}>
                    {initiative.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-hst-light rounded-2xl text-hst-teal">
                    {iconMap[initiative.icon] || <Activity size={20} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(initiative)} className="p-2 text-gray-400 hover:text-hst-teal transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(initiative.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black mb-2">{initiative.title}</h3>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <MapPin size={12} />
                  {initiative.location}
                </div>

                <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-medium">
                  {initiative.description}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Order: {initiative.sort_order}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-hst-teal">{initiative.status}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-hst-dark/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
              >
                <div className="flex flex-col h-[90vh]">
                  {/* Modal Header */}
                  <div className="px-10 py-8 bg-hst-light/30 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black">{editingId ? 'Edit' : 'Add'} <span className="text-hst-teal">Initiative</span></h2>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Fill in the project details below</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-3 bg-white rounded-2xl text-gray-400 hover:text-hst-dark transition-all">
                      <X size={24} />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-10">
                    <form onSubmit={handleSubmit} className="space-y-10">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                            <input 
                              required
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Slug (URL Path)</label>
                            <input 
                              required
                              name="slug"
                              value={formData.slug}
                              onChange={handleInputChange}
                              className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Icon</label>
                              <select 
                                name="icon"
                                value={formData.icon}
                                onChange={handleInputChange}
                                className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold"
                              >
                                {Object.keys(iconMap).map(icon => (
                                  <option key={icon} value={icon}>{icon}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                              <input 
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Location & Details */}
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                            <input 
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sort Order</label>
                              <input 
                                type="number"
                                name="sort_order"
                                value={formData.sort_order}
                                onChange={handleInputChange}
                                className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold"
                              />
                            </div>
                            <div className="flex items-center pt-8 pl-4">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                  type="checkbox"
                                  name="is_active"
                                  checked={formData.is_active}
                                  onChange={handleInputChange}
                                  className="w-6 h-6 rounded-lg text-hst-teal focus:ring-hst-teal/30"
                                />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                              </label>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Foundation</label>
                            <input 
                              name="foundation"
                              value={formData.foundation}
                              onChange={handleInputChange}
                              className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Description</label>
                        <textarea 
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold resize-none"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Group</label>
                          <input 
                            name="target_group"
                            value={formData.target_group}
                            onChange={handleInputChange}
                            className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Key Impact</label>
                          <input 
                            name="key_impact"
                            value={formData.key_impact}
                            onChange={handleInputChange}
                            className="w-full bg-hst-light/30 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-hst-teal/30 focus:bg-white transition-all font-bold"
                          />
                        </div>
                      </div>

                      {/* Image Management */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gallery Images</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group">
                              <img 
                                src={(() => {
                                  if (!img) return '';
                                  if (img.startsWith('http')) {
                                    return img.replace('http://localhost:5000', BASE_URL);
                                  }
                                  const cleanPath = img.startsWith('/') ? img : `/${img}`;
                                  return `${BASE_URL}${cleanPath}`;
                                })()} 
                                className="w-full h-full object-cover" 
                                alt={`Gallery ${idx + 1}`} 
                              />
                              <button 
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"
                              >
                                <Trash2 size={24} />
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-hst-teal/30 hover:text-hst-teal transition-all bg-gray-50"
                          >
                            <Upload size={24} className="mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Upload</span>
                          </button>
                          <input 
                            type="file" 
                            hidden 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-hst-teal text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-hst-teal/20 flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      Save Initiative
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminInitiatives;
