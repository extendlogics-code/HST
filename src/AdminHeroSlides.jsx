import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Plus, Search, Edit, Trash2, Save, X, Loader2, 
  Upload, Image as ImageIcon, ExternalLink, Link as LinkIcon
} from 'lucide-react';
import api, { BASE_URL } from './api/api';

const AdminHeroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const initialFormState = {
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    button_text: '',
    button_url: '',
    sort_order: 0,
    is_active: true
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await api.get('/website/hero-slides/admin');
      if (response.data.success) {
        setSlides(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch slides:', err);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('section', 'hero');
    uploadData.append('image', file);

    try {
      setSubmitting(true);
      const response = await api.post('/website/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          image_url: response.data.url
        }));
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/website/hero-slides/${editingId}`, formData);
      } else {
        await api.post('/website/hero-slides', formData);
      }
      setShowModal(false);
      fetchSlides();
      setFormData(initialFormState);
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save slide');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (slide) => {
    setFormData(slide);
    setEditingId(slide.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    try {
      await api.delete(`/website/hero-slides/${id}`);
      fetchSlides();
    } catch (err) {
      alert('Failed to delete slide');
    }
  };

  const filteredSlides = slides.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-4xl font-black mb-2">Hero <span className="text-hst-teal">Slides</span></h1>
            <p className="text-gray-500 font-medium">Manage the main carousel slides on the homepage</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search slides..." 
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

        <div className="space-y-6">
          {filteredSlides.map((slide) => (
            <motion.div 
              layout
              key={slide.id}
              className={`bg-white rounded-[32px] p-6 border-2 transition-all group flex flex-col md:flex-row gap-8 ${
                slide.is_active ? 'border-gray-100 hover:border-hst-teal/30' : 'border-red-100 opacity-75'
              }`}
            >
              <div className="w-full md:w-72 h-48 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                {slide.image_url ? (
                  <img 
                    src={(() => {
                      const url = slide.image_url;
                      if (!url) return '';
                      if (url.startsWith('http')) {
                        return url.replace('http://localhost:5000', BASE_URL);
                      }
                      const cleanPath = url.startsWith('/') ? url : `/${url}`;
                      return `${BASE_URL}${cleanPath}`;
                    })()} 
                    alt={slide.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-hst-teal mb-1">{slide.subtitle}</div>
                    <h3 className="text-2xl font-black text-hst-dark">{slide.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(slide)} className="p-3 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-hst-teal transition-all">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(slide.id)} className="p-3 hover:bg-red-50 rounded-xl text-gray-500 hover:text-red-500 transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2">{slide.description}</p>
                <div className="flex flex-wrap gap-4 items-center">
                  {slide.button_text && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-hst-light rounded-full text-xs font-bold text-hst-teal">
                      <LinkIcon size={14} /> {slide.button_text} ({slide.button_url || '/'})
                    </div>
                  )}
                  <div className="text-xs font-bold text-gray-400">Order: {slide.sort_order}</div>
                  {!slide.is_active && (
                    <div className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest">Inactive</div>
                  )}
                </div>
              </div>
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
                className="bg-white rounded-[40px] w-full max-w-4xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center shrink-0">
                  <h2 className="text-2xl font-black">{editingId ? 'Edit' : 'Add'} <span className="text-hst-teal">Hero Slide</span></h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Title (use & for green color)</label>
                        <input 
                          type="text" 
                          name="title"
                          required
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                          placeholder="e.g. Self Reliance & Growth"
                          value={formData.title}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Subtitle</label>
                        <input 
                          type="text" 
                          name="subtitle"
                          required
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                          placeholder="e.g. Create a cycle of positive change"
                          value={formData.subtitle}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                        <textarea 
                          name="description"
                          rows="4"
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold resize-none"
                          placeholder="Brief description for the slide..."
                          value={formData.description}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Background Image</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-hst-teal/50 transition-all overflow-hidden relative group"
                        >
                          {formData.image_url ? (
                            <>
                              <img 
                                src={(() => {
                                  const url = formData.image_url;
                                  if (!url) return '';
                                  if (url.startsWith('http')) {
                                    return url.replace('http://localhost:5000', BASE_URL);
                                  }
                                  const cleanPath = url.startsWith('/') ? url : `/${url}`;
                                  return `${BASE_URL}${cleanPath}`;
                                })()} 
                                className="w-full h-full object-cover" 
                                alt="Slide Preview" 
                              />
                              <div className="absolute inset-0 bg-hst-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="text-white" size={32} />
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload className="text-gray-300 mb-2" size={32} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload High-Res Image</span>
                            </>
                          )}
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Button Text</label>
                          <input 
                            type="text" 
                            name="button_text"
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                            placeholder="e.g. Join Us"
                            value={formData.button_text}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Button URL</label>
                          <input 
                            type="text" 
                            name="button_url"
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                            placeholder="e.g. /contact"
                            value={formData.button_url}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
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
                        <div className="flex items-end pb-1">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl w-full">
                            <input 
                              type="checkbox" 
                              name="is_active"
                              id="is_active"
                              className="w-5 h-5 rounded border-gray-300 text-hst-teal focus:ring-hst-teal"
                              checked={formData.is_active}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="is_active" className="text-sm font-bold text-hst-dark">Active Slide</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-hst-dark text-white py-5 rounded-2xl font-black text-xl hover:bg-hst-teal transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                      {editingId ? 'Update Hero Slide' : 'Save Hero Slide'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminHeroSlides;