import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from './api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Loader2, 
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';

const AdminCauses = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    title: '',
    description: '',
    raised_amount: 0,
    goal_amount: 0,
    image_url: '',
    category: '',
    sort_order: 0,
    is_active: true,
    show_progress: false
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    try {
      const res = await api.get('/website/causes/admin');
      if (res.data.success) {
        setCauses(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch causes');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('section', 'causes');
    uploadData.append('image', file);

    setUploading(true);
    try {
      const res = await api.post('/website/upload', uploadData);
      if (res.data.success) {
        setFormData({ ...formData, image_url: res.data.url });
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/website/causes/${editingId}`, formData);
      } else {
        await api.post('/website/causes', formData);
      }
      setShowModal(false);
      fetchCauses();
      setFormData(initialFormState);
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save cause');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cause) => {
    setFormData({
      title: cause.title || '',
      description: cause.description || '',
      goal_amount: cause.goal_amount || 0,
      raised_amount: cause.raised_amount || 0,
      image_url: cause.image_url || '',
      category: cause.category || '',
      sort_order: cause.sort_order || 0,
      is_active: cause.is_active ?? true,
      show_progress: cause.show_progress ?? false
    });
    setEditingId(cause.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cause?')) {
      try {
        await api.delete(`/website/causes/${id}`);
        fetchCauses();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-hst-teal" size={40} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-hst-dark">Recent <span className="text-hst-teal">Causes</span></h2>
          <p className="text-gray-500 font-medium">Manage fundraising causes displayed on the homepage.</p>
        </div>
        <button
          onClick={() => {
            setFormData(initialFormState);
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-hst-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-hst-teal transition-all flex items-center gap-2 shadow-lg shadow-hst-dark/10"
        >
          <Plus size={20} />
          Add New Cause
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {causes.map((cause) => (
          <motion.div 
            key={cause.id}
            layout
            className={`bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl group flex flex-col ${!cause.is_active ? 'opacity-60' : ''}`}
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={(() => {
                  const url = cause.image_url;
                  if (!url) return '';
                  if (url.startsWith('http')) {
                    return url.replace('http://localhost:5000', BASE_URL);
                  }
                  const cleanPath = url.startsWith('/') ? url : `/${url}`;
                  return `${BASE_URL}${cleanPath}`;
                })()} 
                alt={cause.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-hst-teal text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                {cause.category}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => handleEdit(cause)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-hst-dark rounded-full hover:bg-hst-teal hover:text-white transition-all shadow-lg"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(cause)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-hst-dark leading-tight line-clamp-2">{cause.title}</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                  <span>Raised: ${cause.raised_amount}</span>
                  <span className="text-hst-teal">{Math.round((cause.raised_amount / cause.goal_amount) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-hst-teal rounded-full" 
                    style={{ width: `${Math.min(100, (cause.raised_amount / cause.goal_amount) * 100)}%` }}
                  />
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Goal: ${cause.goal_amount}
                </div>
              </div>

              <div className="pt-4 mt-auto flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cause.is_active ? 'bg-hst-green' : 'bg-gray-300'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {cause.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Order: {cause.sort_order}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-hst-dark">
                  {editingId ? 'Edit Cause' : 'Add New Cause'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Cause Title</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="e.g. Women Empowerment"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                    <textarea
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[100px]"
                      placeholder="Brief description of the cause..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Goal Amount ($)</label>
                    <input
                      required
                      type="number"
                      value={formData.goal_amount || 0}
                      onChange={(e) => setFormData({...formData, goal_amount: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Raised Amount ($)</label>
                    <input
                      required
                      type="number"
                      value={formData.raised_amount || 0}
                      onChange={(e) => setFormData({...formData, raised_amount: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                    <input
                      required
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="e.g. Empowerment"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sort_order || 0}
                      onChange={(e) => setFormData({...formData, sort_order: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Cause Image</label>
                    <div className="flex items-center gap-6">
                      {formData.image_url && (
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
                          className="w-24 h-24 object-cover rounded-2xl border"
                        />
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full py-4 rounded-xl bg-hst-light border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-hst-teal hover:text-hst-teal transition-all">
                          {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon size={20} />}
                          {formData.image_url ? 'Change Image' : 'Upload Cause Image'}
                        </div>
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={formData.is_active}
                          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-hst-green' : 'bg-gray-200'}`} />
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.is_active ? 'translate-x-6' : ''}`} />
                      </div>
                      <span className="text-sm font-black text-hst-dark uppercase tracking-widest">Active / Visible on Website</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={formData.show_progress}
                          onChange={(e) => setFormData({...formData, show_progress: e.target.checked})}
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.show_progress ? 'bg-hst-green' : 'bg-gray-200'}`} />
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.show_progress ? 'translate-x-6' : ''}`} />
                      </div>
                      <span className="text-sm font-black text-hst-dark uppercase tracking-widest">Show Raised & Goal Progress</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-hst-dark hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-[2] py-4 rounded-2xl bg-hst-dark text-white font-black hover:bg-hst-teal transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {editingId ? 'Save Changes' : 'Create Cause'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCauses;
