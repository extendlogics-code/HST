import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Search, Edit, Trash2, Save, X, Loader2, 
  Upload, Globe, ExternalLink
} from 'lucide-react';
import api, { BASE_URL } from './api/api';

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const initialFormState = {
    name: '',
    logo_url: '',
    website_url: '',
    sort_order: 0,
    is_active: true
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await api.get('/website/partners/admin');
      if (response.data.success) {
        setPartners(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch partners:', err);
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('section', 'partners');
    uploadData.append('image', file);

    try {
      setSubmitting(true);
      const response = await api.post('/website/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          logo_url: response.data.url
        }));
      }
    } catch (err) {
      alert('Failed to upload logo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.logo_url) {
      alert('Please upload a logo');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/website/partners/${editingId}`, formData);
      } else {
        await api.post('/website/partners', formData);
      }
      setShowModal(false);
      fetchPartners();
      setFormData(initialFormState);
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save partner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (partner) => {
    setFormData({
      ...partner,
      website_url: partner.website_url || '',
      category: partner.category || ''
    });
    setEditingId(partner.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) return;
    try {
      await api.delete(`/website/partners/${id}`);
      fetchPartners();
    } catch (err) {
      alert('Failed to delete partner');
    }
  };

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-4xl font-black mb-2">Our <span className="text-hst-teal">Partners</span></h1>
            <p className="text-gray-500 font-medium">Manage organization partners and their logos</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search partners..." 
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

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredPartners.map((partner) => (
            <motion.div 
              layout
              key={partner.id}
              className={`bg-white rounded-[32px] p-8 border-2 transition-all group ${
                partner.is_active ? 'border-gray-100 hover:border-hst-teal/30' : 'border-red-100 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-16 w-32 bg-gray-50 rounded-xl p-2 flex items-center justify-center overflow-hidden border border-gray-100">
                  <img 
                    src={(() => {
                              const url = partner.logo_url;
                              if (!url) return '';
                              if (url.startsWith('http')) {
                                return url.replace('http://localhost:5000', BASE_URL);
                              }
                              const cleanPath = url.startsWith('/') ? url : `/${url}`;
                              return `${BASE_URL}${cleanPath}`;
                            })()} 
                    alt={partner.name} 
                    className="max-h-12 max-w-[120px] object-contain transition-all duration-500"
                  />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(partner)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-hst-teal">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(partner.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xl font-black text-hst-dark">{partner.name}</div>
                {partner.website_url && (
                  <a 
                    href={partner.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-hst-teal hover:text-hst-green transition-colors"
                  >
                    <Globe size={14} /> Website <ExternalLink size={12} />
                  </a>
                )}
              </div>
              {!partner.is_active && (
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
                  <h2 className="text-2xl font-black">{editingId ? 'Edit' : 'Add'} <span className="text-hst-teal">Partner</span></h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-hst-teal/50 transition-all overflow-hidden relative group"
                      >
                        {formData.logo_url ? (
                          <>
                            <img 
                              src={(() => {
                                const url = formData.logo_url;
                                if (!url) return '';
                                if (url.startsWith('http')) {
                                  return url.replace('http://localhost:5000', BASE_URL);
                                }
                                const cleanPath = url.startsWith('/') ? url : `/${url}`;
                                return `${BASE_URL}${cleanPath}`;
                              })()} 
                              className="w-full h-full object-contain p-4" 
                              alt="Logo" 
                            />
                            <div className="absolute inset-0 bg-hst-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="text-white" size={32} />
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="text-gray-300 mb-2" size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Logo</span>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Partner Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                        placeholder="Organization Name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Website URL</label>
                      <input 
                        type="url" 
                        name="website_url"
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                        placeholder="https://example.com"
                        value={formData.website_url || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Sort Order</label>
                        <input 
                          type="number" 
                          name="sort_order"
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-hst-teal/30 transition-all font-bold"
                          value={formData.sort_order || 0}
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
                          <label htmlFor="is_active" className="text-sm font-bold text-hst-dark">Active</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-hst-dark text-white py-4 rounded-2xl font-black text-lg hover:bg-hst-teal transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {editingId ? 'Update Partner' : 'Save Partner'}
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

export default AdminPartners;