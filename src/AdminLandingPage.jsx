import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Globe, 
  Eye, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  Layout,
  Type,
  Link as LinkIcon
} from 'lucide-react';
import api, { BASE_URL } from './api/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLandingPage = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [formData, setFormData] = useState({
    page_name: '',
    title: '',
    subtitle: '',
    content: '',
    slug: '',
    is_active: true,
    image_url: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await api.get('/website/landing-pages/admin');
      if (response.data.success) {
        setPages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching landing pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setCurrentPage(page);
    setFormData({
      page_name: page.page_name || '',
      title: page.title || '',
      subtitle: page.subtitle || '',
      content: page.content || '',
      slug: page.slug || '',
      is_active: page.is_active,
      image_url: page.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this landing page?')) return;
    try {
      await api.delete(`/website/landing-pages/${id}`);
      fetchPages();
    } catch (error) {
      console.error('Error deleting landing page:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentPage) {
        await api.put(`/website/landing-pages/${currentPage.id}`, formData);
      } else {
        await api.post('/website/landing-pages', formData);
      }
      setIsModalOpen(false);
      setCurrentPage(null);
      setFormData({
        page_name: '',
        title: '',
        subtitle: '',
        content: '',
        slug: '',
        is_active: true,
        image_url: ''
      });
      fetchPages();
    } catch (error) {
      console.error('Error saving landing page:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    uploadFormData.append('section', 'landing-page');

    try {
      const response = await api.post('/website/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setFormData({ ...formData, image_url: response.data.url });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-hst-dark tracking-tight">Landing Pages</h1>
          <p className="text-gray-400 font-medium mt-1">Manage dynamic landing pages and their content</p>
        </div>
        <button 
          onClick={() => {
            setCurrentPage(null);
            setFormData({
              page_name: '',
              title: '',
              subtitle: '',
              content: '',
              slug: '',
              is_active: true,
              image_url: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-hst-teal text-white px-6 py-3 rounded-2xl font-bold hover:bg-hst-dark transition-all flex items-center gap-2 shadow-lg shadow-hst-teal/20"
        >
          <Plus size={20} />
          Create New Page
        </button>
      </div>

      {/* Pages List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-hst-teal" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div key={page.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="relative h-48 mb-6 rounded-2xl overflow-hidden bg-hst-light">
                {page.image_url ? (
                  <img 
                    src={(() => {
                      const url = page.image_url;
                      if (!url) return '';
                      if (url.startsWith('http')) {
                        return url.replace('http://localhost:5000', BASE_URL);
                      }
                      const cleanPath = url.startsWith('/') ? url : `/${url}`;
                      return `${BASE_URL}${cleanPath}`;
                    })()} 
                    alt={page.page_name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Globe size={40} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${page.is_active ? 'bg-hst-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {page.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-hst-dark leading-tight">{page.page_name}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-hst-teal mt-1">
                    <LinkIcon size={12} />
                    <span>/{page.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <a 
                    href={`/page/${page.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 text-hst-teal hover:bg-hst-teal/10 rounded-xl transition-all"
                    title="View Live Page"
                  >
                    <Eye size={20} />
                  </a>
                  <button 
                    onClick={() => handleEdit(page)}
                    className="flex-1 bg-hst-light text-hst-dark p-3 rounded-xl font-bold hover:bg-hst-teal hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(page.id)}
                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-hst-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-black text-hst-dark tracking-tight">
                    {currentPage ? 'Edit Landing Page' : 'Create Landing Page'}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">Configure your page content and settings</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-hst-light rounded-full transition-colors">
                  <XCircle className="text-gray-400" size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Page Name (for Admin & Navbar)</label>
                      <div className="relative">
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        <input
                          type="text"
                          required
                          value={formData.page_name}
                          onChange={(e) => setFormData({...formData, page_name: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold text-hst-dark"
                          placeholder="e.g., Special Initiative"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">URL Slug</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold text-hst-dark"
                          placeholder="e.g., special-initiative"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Main Title</label>
                      <div className="relative">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold text-hst-dark"
                          placeholder="Catchy headline..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Subtitle</label>
                      <textarea
                        value={formData.subtitle}
                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold text-hst-dark h-24 resize-none"
                        placeholder="Short description..."
                      />
                    </div>
                  </div>

                  {/* Right Column: Media & Status */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Banner Image</label>
                      <div className="relative h-48 bg-hst-light rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 group">
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
                              alt="Preview" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="cursor-pointer bg-white text-hst-dark px-4 py-2 rounded-xl font-bold text-xs hover:bg-hst-teal hover:text-white transition-all">
                                Change Image
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                              </label>
                            </div>
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                            <ImageIcon className="text-gray-300 mb-2" size={40} />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                              {uploading ? 'Uploading...' : 'Upload Banner'}
                            </span>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-hst-light rounded-2xl">
                      <div className="flex-1">
                        <p className="font-bold text-hst-dark">Active Status</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Enable or disable this page</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                        className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${formData.is_active ? 'bg-hst-green' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${formData.is_active ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Page Content (HTML supported)</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full p-6 rounded-3xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-medium text-hst-dark h-64 font-mono text-sm"
                    placeholder="<p>Enter your page content here...</p>"
                  />
                </div>

                <div className="mt-8 flex justify-end gap-4 sticky bottom-0 bg-white pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-hst-dark transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-hst-teal text-white px-10 py-4 rounded-2xl font-bold hover:bg-hst-dark transition-all shadow-lg shadow-hst-teal/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <CheckCircle2 size={20} />
                    )}
                    {currentPage ? 'Update Page' : 'Create Page'}
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

export default AdminLandingPage;
