import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from './api/api';
import { motion } from 'framer-motion';
import { 
  Layout, 
  Save, 
  Loader2, 
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  Link as LinkIcon
} from 'lucide-react';

const AdminHeaderFooter = () => {
  const [footerData, setFooterData] = useState({
    about_text: '',
    copyright_text: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    linkedin_url: '',
    address: '',
    email: [],
    phone: [],
    quick_links: [],
    logo_url: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [savingFooter, setSavingFooter] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState({ footer: false });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const footerRes = await api.get('/website/footer');
      
      if (footerRes.data.success && footerRes.data.data) {
        const data = footerRes.data.data;
        
        // Default values for quick links if none exist
        const defaultLinks = [
          { label: 'Our History', url: '/about' },
          { label: 'Current Causes', url: '/#causes' },
          { label: 'Become Volunteer', url: '/contact' },
          { label: 'Latest News', url: '/#news' }
        ];

        // Process email (might be string or array)
        let processedEmails = [];
        if (Array.isArray(data.email)) {
          processedEmails = data.email;
        } else if (data.email) {
          // If it's a comma-separated string, split it
          processedEmails = data.email.includes(',') 
            ? data.email.split(',').map(s => s.trim()) 
            : [data.email];
        }

        // Process phone (might be string or array)
        let processedPhones = [];
        if (Array.isArray(data.phone)) {
          processedPhones = data.phone;
        } else if (data.phone) {
          processedPhones = data.phone.includes(',') 
            ? data.phone.split(',').map(s => s.trim()) 
            : [data.phone];
        }

        setFooterData({
          ...data,
          email: processedEmails,
          phone: processedPhones,
          quick_links: (Array.isArray(data.quick_links) && data.quick_links.length > 0) 
            ? data.quick_links 
            : defaultLinks
        });
      }
    } catch (err) {
      console.error('Failed to fetch footer data');
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field, defaultValue = '') => {
    setFooterData({
      ...footerData,
      [field]: [...footerData[field], defaultValue]
    });
  };

  const removeItem = (field, index) => {
    const newList = [...footerData[field]];
    newList.splice(index, 1);
    setFooterData({
      ...footerData,
      [field]: newList
    });
  };

  const updateItem = (field, index, value) => {
    const newList = [...footerData[field]];
    newList[index] = value;
    setFooterData({
      ...footerData,
      [field]: newList
    });
  };

  const addQuickLink = () => {
    setFooterData({
      ...footerData,
      quick_links: [...footerData.quick_links, { label: '', url: '' }]
    });
  };

  const updateQuickLink = (index, field, value) => {
    const newList = [...footerData.quick_links];
    newList[index] = { ...newList[index], [field]: value };
    setFooterData({
      ...footerData,
      quick_links: newList
    });
  };

  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    setSavingFooter(true);
    try {
      await api.put('/website/footer', footerData);
      alert('Footer updated successfully');
    } catch (err) {
      alert('Failed to save footer data');
    } finally {
      setSavingFooter(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo({ footer: true });
    const formData = new FormData();
    formData.append('image', file);
    formData.append('section', 'footer-logo');

    try {
      const res = await api.post('/website/upload', formData);
      if (res.data.success) {
        const relativeUrl = res.data.url.replace(BASE_URL, '');
        setFooterData({ ...footerData, logo_url: relativeUrl });
      }
    } catch (err) {
      alert('Failed to upload logo');
    } finally {
      setUploadingLogo({ footer: false });
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-hst-teal" size={40} /></div>;

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h2 className="text-3xl font-black text-hst-dark">Footer <span className="text-hst-teal">Management</span></h2>
        <p className="text-gray-500 font-medium">Manage the global website footer contents.</p>
      </div>

      <div className="max-w-4xl">
        {/* Footer Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-8"
        >
          <h3 className="font-black text-xl flex items-center gap-2">
            <Layout className="text-hst-teal" size={24} />
            Footer Configuration
          </h3>

          <form onSubmit={handleFooterSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">About Text (Footer)</label>
                <textarea
                  value={footerData.about_text || ''}
                  onChange={(e) => setFooterData({...footerData, about_text: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[100px]"
                  placeholder="Short description for footer..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Email Addresses</label>
                    <button type="button" onClick={() => addItem('email')} className="text-hst-teal hover:text-hst-dark flex items-center gap-1 text-xs font-bold">
                      <Plus size={14} /> Add Email
                    </button>
                  </div>
                  <div className="space-y-3">
                    {footerData.email.map((email, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => updateItem('email', idx, e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                            placeholder="Email address..."
                          />
                        </div>
                        <button type="button" onClick={() => removeItem('email', idx)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    {footerData.email.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No emails added.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Phone Numbers</label>
                    <button type="button" onClick={() => addItem('phone')} className="text-hst-teal hover:text-hst-dark flex items-center gap-1 text-xs font-bold">
                      <Plus size={14} /> Add Phone
                    </button>
                  </div>
                  <div className="space-y-3">
                    {footerData.phone.map((phone, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => updateItem('phone', idx, e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                            placeholder="Phone number..."
                          />
                        </div>
                        <button type="button" onClick={() => removeItem('phone', idx)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    {footerData.phone.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No phone numbers added.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm uppercase tracking-widest text-gray-400">Quick Links</h4>
                  <button type="button" onClick={addQuickLink} className="bg-hst-teal/10 text-hst-teal px-4 py-2 rounded-xl font-bold text-xs hover:bg-hst-teal hover:text-white transition-all flex items-center gap-2">
                    <Plus size={14} /> Add New Link
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {footerData.quick_links.map((link, idx) => (
                    <div key={idx} className="bg-hst-light p-4 rounded-2xl space-y-3 relative group">
                      <button 
                        type="button" 
                        onClick={() => removeItem('quick_links', idx)} 
                        className="absolute -top-2 -right-2 p-2 bg-white text-red-400 rounded-full shadow-md hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Link Label</label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateQuickLink(idx, 'label', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-white border-none focus:ring-2 focus:ring-hst-teal font-bold text-sm"
                          placeholder="e.g., About Us"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">URL / Path</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateQuickLink(idx, 'url', e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border-none focus:ring-2 focus:ring-hst-teal font-bold text-sm"
                            placeholder="e.g., /about or https://..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {footerData.quick_links.length === 0 && (
                  <div className="text-center py-8 bg-hst-light rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">No quick links added yet.</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Address</label>
                  <input
                    type="text"
                    value={footerData.address || ''}
                    onChange={(e) => setFooterData({...footerData, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="Full address..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Copyright Text</label>
                  <input
                    type="text"
                    value={footerData.copyright_text || ''}
                    onChange={(e) => setFooterData({...footerData, copyright_text: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="© 2026 Help To Self Help Trust"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Facebook URL</label>
                  <input
                    type="text"
                    value={footerData.facebook_url || ''}
                    onChange={(e) => setFooterData({...footerData, facebook_url: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Twitter URL</label>
                  <input
                    type="text"
                    value={footerData.twitter_url || ''}
                    onChange={(e) => setFooterData({...footerData, twitter_url: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Instagram URL</label>
                  <input
                    type="text"
                    value={footerData.instagram_url || ''}
                    onChange={(e) => setFooterData({...footerData, instagram_url: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">LinkedIn URL</label>
                  <input
                    type="text"
                    value={footerData.linkedin_url || ''}
                    onChange={(e) => setFooterData({...footerData, linkedin_url: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Footer Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-20 bg-hst-light rounded-2xl flex items-center justify-center overflow-hidden border border-dashed border-gray-300">
                    {footerData.logo_url ? (
                      <img 
                        src={(() => {
                          const url = footerData.logo_url;
                          if (!url) return '';
                          if (url.startsWith('http')) {
                            return url.replace('http://localhost:5000', BASE_URL);
                          }
                          const cleanPath = url.startsWith('/') ? url : `/${url}`;
                          return `${BASE_URL}${cleanPath}`;
                        })()} 
                        alt="Footer Logo" 
                        className="max-w-full max-h-full object-contain p-2" 
                      />
                    ) : (
                      <Upload className="text-gray-300" size={24} />
                    )}
                  </div>
                  <label className="cursor-pointer bg-hst-teal/10 text-hst-teal px-4 py-2 rounded-xl font-bold text-xs hover:bg-hst-teal hover:text-white transition-all">
                    {uploadingLogo.footer ? 'Uploading...' : 'Change Logo'}
                    <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingFooter}
              className="w-full bg-hst-teal text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-hst-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-hst-teal/20"
            >
              {savingFooter ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Update Footer
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHeaderFooter;
