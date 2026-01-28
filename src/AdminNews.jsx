import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from './api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Loader2, 
  Image as ImageIcon,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    title: '',
    content: '',
    excerpt: '',
    author: 'Admin',
    publish_date: new Date().toISOString().split('T')[0],
    image_url: '',
    show_popup: false,
    category: 'General',
    sort_order: 0,
    is_active: true
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await api.get('/website/news/admin');
      if (res.data.success) {
        setNews(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('section', 'news');
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
        await api.put(`/website/news/${editingId}`, formData);
      } else {
        await api.post('/website/news', formData);
      }
      setShowModal(false);
      fetchNews();
      setFormData(initialFormState);
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save news article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      author: article.author || 'Admin',
      publish_date: article.publish_date ? article.publish_date.split('T')[0] : new Date().toISOString().split('T')[0],
      image_url: article.image_url || '',
      show_popup: article.show_popup ?? false,
      category: article.category || 'General',
      sort_order: article.sort_order || 0,
      is_active: article.is_active ?? true
    });
    setEditingId(article.id);
    setShowModal(true);
  };

  const handleDelete = async (article) => {
    if (window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
      try {
        await api.delete(`/website/news/${article.id}`);
        fetchNews();
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
          <h2 className="text-3xl font-black text-hst-dark">News & <span className="text-hst-teal">Articles</span></h2>
          <p className="text-gray-500 font-medium">Manage latest updates and articles for the community.</p>
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
          Add New Article
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-hst-light/50 border-b border-gray-100">
              <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Article</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Date & Author</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {news.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {article.image_url ? (
                      <img 
                        src={(() => {
                          const url = article.image_url;
                          if (!url) return '';
                          if (url.startsWith('http')) {
                            return url.replace('http://localhost:5000', BASE_URL);
                          }
                          const cleanPath = url.startsWith('/') ? url : `/${url}`;
                          return `${BASE_URL}${cleanPath}`;
                        })()} 
                        alt={article.title} 
                        className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-hst-light rounded-xl flex items-center justify-center text-hst-teal">
                        <Newspaper size={24} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-black text-hst-dark group-hover:text-hst-teal transition-colors">{article.title}</h4>
                      <p className="text-xs font-bold text-gray-400 line-clamp-1">{article.excerpt}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <Calendar size={14} className="text-hst-teal" />
                      {new Date(article.publish_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <User size={14} />
                      {article.author}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    article.is_active ? 'bg-hst-green/10 text-hst-green' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {article.is_active ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(article)}
                      className="p-2 text-gray-400 hover:text-hst-teal hover:bg-hst-teal/5 rounded-lg transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(article)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              className="relative bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-hst-dark">
                  {editingId ? 'Edit Article' : 'New Article'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Article Title</label>
                    <input
                      required
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="Enter article title..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Excerpt (Short Summary)</label>
                    <textarea
                      required
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      rows="2"
                      placeholder="Brief summary for the news feed..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Content</label>
                    <textarea
                      required
                      value={formData.content || ''}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[200px]"
                      placeholder="Write your article content here..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Author</label>
                    <input
                      type="text"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Publish Date</label>
                    <input
                      type="date"
                      value={formData.publish_date || ''}
                      onChange={(e) => setFormData({...formData, publish_date: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                    <select
                      value={formData.category || 'General'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    >
                      <option value="General">General</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Environment">Environment</option>
                      <option value="Community">Community</option>
                      <option value="Event">Event</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Article Image</label>
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
                          className="w-32 h-32 object-cover rounded-2xl border"
                        />
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full py-8 rounded-xl bg-hst-light border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-hst-teal hover:text-hst-teal transition-all">
                          {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon size={24} />}
                          {formData.image_url ? 'Change Featured Image' : 'Upload Featured Image'}
                        </div>
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({...formData, sort_order: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    />
                  </div>

                  <div className="flex items-end pb-3">
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
                      <span className="text-sm font-black text-hst-dark uppercase tracking-widest">Published</span>
                    </label>
                  </div>

                  <div className="col-span-2 bg-hst-light/30 p-6 rounded-[32px] border border-hst-teal/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-black text-hst-dark uppercase tracking-widest text-xs">Full Story Popup</h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">Enable "Read Full Story" button and interactive popup for this article.</p>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={formData.show_popup}
                            onChange={(e) => setFormData({...formData, show_popup: e.target.checked})}
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${formData.show_popup ? 'bg-hst-teal' : 'bg-gray-200'}`} />
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.show_popup ? 'translate-x-6' : ''}`} />
                        </div>
                      </label>
                    </div>
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
                    {editingId ? 'Save Article' : 'Publish Article'}
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

export default AdminNews;
