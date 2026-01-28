import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from './api/api';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Save, 
  Loader2, 
  Palette,
  Layout,
  ExternalLink
} from 'lucide-react';

const AdminCTA = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    button_text: '',
    button_url: '',
    background_type: 'gradient',
    background_value: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCTA();
  }, []);

  const fetchCTA = async () => {
    try {
      const res = await api.get('/website/cta');
      if (res.data.success && res.data.data) {
        setFormData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch CTA data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/website/cta', formData);
      alert('Volunteer CTA section updated successfully');
    } catch (err) {
      alert('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-hst-teal" size={40} /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-hst-dark">Volunteer <span className="text-hst-teal">CTA</span></h2>
        <p className="text-gray-500 font-medium">Manage the "Call to Action" section for volunteers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
            <h3 className="font-black text-xl flex items-center gap-2">
              <Layout className="text-hst-teal" size={24} />
              Section Content
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Main Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder="e.g. Join Our Community"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[120px]"
                  placeholder="Describe why people should join..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="Join Now"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Button URL</label>
                  <input
                    type="text"
                    value={formData.button_url}
                    onChange={(e) => setFormData({...formData, button_url: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>

            <h3 className="font-black text-xl flex items-center gap-2 pt-4">
              <Palette className="text-hst-teal" size={24} />
              Visual Style
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Background Type</label>
                <select
                  value={formData.background_type}
                  onChange={(e) => setFormData({...formData, background_type: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                >
                  <option value="gradient">Gradient (Theme)</option>
                  <option value="color">Solid Color</option>
                  <option value="image">Image URL</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Background Value</label>
                <input
                  type="text"
                  value={formData.background_value}
                  onChange={(e) => setFormData({...formData, background_value: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder={formData.background_type === 'color' ? '#000000' : 'URL or Gradient CSS'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-hst-dark text-white py-5 rounded-2xl font-black text-lg hover:bg-hst-teal transition-all shadow-xl shadow-hst-dark/10 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              Update CTA Section
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl">
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
              <Megaphone className="text-hst-teal" size={20} />
              Live Preview
            </h3>
            
            <div 
              className={`p-10 rounded-[32px] text-center space-y-4 ${
                formData.background_type === 'gradient' ? 'hst-gradient' : ''
              }`}
              style={{
                backgroundColor: formData.background_type === 'color' ? formData.background_value : undefined,
                backgroundImage: formData.background_type === 'image' 
                  ? `url(${(() => {
                      const url = formData.background_value;
                      if (!url) return '';
                      if (url.startsWith('http')) {
                        return url.replace('http://localhost:5000', BASE_URL);
                      }
                      const cleanPath = url.startsWith('/') ? url : `/${url}`;
                      return `${BASE_URL}${cleanPath}`;
                    })()})` 
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <h4 className="text-2xl font-black text-white leading-tight">{formData.title || 'Your Title Here'}</h4>
              <p className="text-white/80 text-sm font-medium line-clamp-3">
                {formData.description || 'Your description will appear here when you type it in the form.'}
              </p>
              <div className="pt-2">
                <span className="inline-block bg-white text-hst-dark px-8 py-3 rounded-full font-black text-sm">
                  {formData.button_text || 'Button Text'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCTA;
