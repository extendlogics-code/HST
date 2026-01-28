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
  ChevronDown,
  ChevronUp,
  Link as LinkIcon
} from 'lucide-react';

const AdminNavbar = () => {
  const [headerData, setHeaderData] = useState({
    logo_url: '',
    nav_links: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/website/header');
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        const defaultLinks = [
          { name: 'Home', path: 'home' },
          { 
            name: 'About Us', 
            path: 'about-us',
            dropdown: [
              { name: 'Our Mission', path: '/about' },
              { name: 'Founder', path: '/about' },
              { name: 'Legalities', path: '/legal' },
            ]
          },
          { name: 'Causes', path: 'causes' },
          { name: 'Initiatives', path: 'initiatives' },
          { name: 'Partners', path: 'partners' },
          { name: 'Contact Us', path: 'contact' },
        ];

        setHeaderData({
          logo_url: data.logo_url || '',
          nav_links: (Array.isArray(data.nav_links) && data.nav_links.length > 0) 
            ? data.nav_links 
            : defaultLinks
        });
      }
    } catch (err) {
      console.error('Failed to fetch navbar data');
    } finally {
      setLoading(false);
    }
  };

  const addNavLink = () => {
    setHeaderData({
      ...headerData,
      nav_links: [...headerData.nav_links, { name: '', path: '', dropdown: [] }]
    });
  };

  const removeNavLink = (index) => {
    const newList = [...headerData.nav_links];
    newList.splice(index, 1);
    setHeaderData({ ...headerData, nav_links: newList });
  };

  const updateNavLink = (index, field, value) => {
    const newList = [...headerData.nav_links];
    newList[index] = { ...newList[index], [field]: value };
    setHeaderData({ ...headerData, nav_links: newList });
  };

  const addDropdownLink = (navIndex) => {
    const newList = [...headerData.nav_links];
    const dropdown = newList[navIndex].dropdown || [];
    newList[navIndex] = { 
      ...newList[navIndex], 
      dropdown: [...dropdown, { name: '', path: '' }] 
    };
    setHeaderData({ ...headerData, nav_links: newList });
  };

  const removeDropdownLink = (navIndex, dropIndex) => {
    const newList = [...headerData.nav_links];
    const dropdown = [...newList[navIndex].dropdown];
    dropdown.splice(dropIndex, 1);
    newList[navIndex] = { ...newList[navIndex], dropdown };
    setHeaderData({ ...headerData, nav_links: newList });
  };

  const updateDropdownLink = (navIndex, dropIndex, field, value) => {
    const newList = [...headerData.nav_links];
    const dropdown = [...newList[navIndex].dropdown];
    dropdown[dropIndex] = { ...dropdown[dropIndex], [field]: value };
    newList[navIndex] = { ...newList[navIndex], dropdown };
    setHeaderData({ ...headerData, nav_links: newList });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('section', 'header-logo');

    try {
      const res = await api.post('/website/upload', formData);
      if (res.data.success) {
        const relativeUrl = res.data.url.replace(BASE_URL, '');
        setHeaderData({ ...headerData, logo_url: relativeUrl });
      }
    } catch (err) {
      alert('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/website/header', headerData);
      alert('Navbar updated successfully');
    } catch (err) {
      alert('Failed to save navbar data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-hst-teal" size={40} /></div>;

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h2 className="text-3xl font-black text-hst-dark">Navbar <span className="text-hst-teal">Management</span></h2>
        <p className="text-gray-500 font-medium">Manage the navigation links and logo for the website header.</p>
      </div>

      <div className="max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Logo Management */}
            <div className="space-y-4">
              <h3 className="font-black text-xl flex items-center gap-2">
                <Upload className="text-hst-teal" size={24} />
                Website Logo
              </h3>
              <div className="flex items-center gap-6">
                <div className="w-32 h-20 bg-hst-light rounded-2xl flex items-center justify-center overflow-hidden border border-dashed border-gray-300">
                  {headerData.logo_url ? (
                    <img 
                      src={(() => {
                        const url = headerData.logo_url;
                        if (!url) return '';
                        if (url.startsWith('http')) {
                          return url.replace('http://localhost:5000', BASE_URL);
                        }
                        const cleanPath = url.startsWith('/') ? url : `/${url}`;
                        return `${BASE_URL}${cleanPath}`;
                      })()} 
                      alt="Logo" 
                      className="max-w-full max-h-full object-contain p-2" 
                    />
                  ) : (
                    <div className="text-gray-300 text-xs font-bold">No Logo</div>
                  )}
                </div>
                <label className="cursor-pointer bg-hst-teal/10 text-hst-teal px-4 py-2 rounded-xl font-bold text-xs hover:bg-hst-teal hover:text-white transition-all">
                  {uploadingLogo ? 'Uploading...' : 'Change Logo'}
                  <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                </label>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Navigation Links */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl flex items-center gap-2">
                  <Layout className="text-hst-teal" size={24} />
                  Navigation Links
                </h3>
                <button 
                  type="button" 
                  onClick={addNavLink}
                  className="bg-hst-teal/10 text-hst-teal px-4 py-2 rounded-xl font-bold text-xs hover:bg-hst-teal hover:text-white transition-all flex items-center gap-2"
                >
                  <Plus size={14} /> Add Main Link
                </button>
              </div>

              <div className="space-y-4">
                {headerData.nav_links.map((link, idx) => (
                  <div key={idx} className="bg-hst-light p-6 rounded-[24px] border border-gray-100 space-y-4 relative group">
                    <button 
                      type="button" 
                      onClick={() => removeNavLink(idx)}
                      className="absolute top-4 right-4 p-2 bg-white text-red-400 rounded-full shadow-md hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Link Name</label>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => updateNavLink(idx, 'name', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-hst-teal font-bold"
                          placeholder="e.g., About Us"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Path / URL</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input
                            type="text"
                            value={link.path}
                            onChange={(e) => updateNavLink(idx, 'path', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-hst-teal font-bold"
                            placeholder="e.g., /about"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Links */}
                    <div className="pt-4 border-t border-white/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Dropdown Menu (Optional)</label>
                        <button 
                          type="button" 
                          onClick={() => addDropdownLink(idx)}
                          className="text-hst-teal hover:text-hst-dark flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                        >
                          <Plus size={12} /> Add Dropdown Item
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {link.dropdown?.map((drop, dIdx) => (
                          <div key={dIdx} className="flex gap-2 items-center bg-white/50 p-2 rounded-xl">
                            <input
                              type="text"
                              value={drop.name}
                              onChange={(e) => updateDropdownLink(idx, dIdx, 'name', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg bg-white border-none focus:ring-2 focus:ring-hst-teal font-bold text-xs"
                              placeholder="Name"
                            />
                            <input
                              type="text"
                              value={drop.path}
                              onChange={(e) => updateDropdownLink(idx, dIdx, 'path', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg bg-white border-none focus:ring-2 focus:ring-hst-teal font-bold text-xs"
                              placeholder="Path"
                            />
                            <button 
                              type="button" 
                              onClick={() => removeDropdownLink(idx, dIdx)}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-hst-teal text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-hst-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-hst-teal/20"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Navbar Configuration
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminNavbar;
