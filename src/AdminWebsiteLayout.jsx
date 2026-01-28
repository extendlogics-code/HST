import React, { useState, useEffect } from 'react';
import api from './api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Eye, 
  EyeOff, 
  GripVertical, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Edit3,
  X
} from 'lucide-react';

const AdminWebsiteLayout = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [headerData, setHeaderData] = useState({
    subtitle: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await api.get('/website/sections');
      if (res.data.success) {
        let allSections = res.data.data;
        
        // Ensure header is at the top and footer is at the bottom
    const middle = allSections.filter(s => s.section_key !== 'header' && s.section_key !== 'footer');
    
    const sortedSections = [
      ...middle.sort((a, b) => a.sort_order - b.sort_order)
    ];
        
        setSections(sortedSections);
      }
    } catch (err) {
      setError('Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await api.put(`/website/sections/${id}`, { is_active: !currentStatus });
      if (res.data.success) {
        setSections(sections.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
      }
    } catch (err) {
      alert('Failed to update section visibility');
    }
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    const newIndex = index + direction;
    
    // Check bounds
    if (newIndex < 0 || newIndex >= sections.length) return;

    const [movedItem] = newSections.splice(index, 1);
    newSections.splice(newIndex, 0, movedItem);

    // Update sort_order locally
    const updatedSections = newSections.map((s, i) => ({ ...s, sort_order: i + 1 }));
    setSections(updatedSections);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      // Re-assign sort_orders to ensure they are sequential
      const orders = sections.map((s, i) => {
        return { id: s.id, sort_order: i + 1 };
      });

      const res = await api.put('/website/sections/reorder', { orders });
      if (res.data.success) {
        setSuccess('Layout saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
        fetchSections(); // Refresh to get the actual orders from DB
      }
    } catch (err) {
      setError('Failed to save layout order');
    } finally {
      setSaving(false);
    }
  };

  const handleEditHeader = (section) => {
    setEditingSection(section);
    setHeaderData({
      subtitle: section.subtitle || '',
      title: section.title || '',
      description: section.description || ''
    });
  };

  const handleSaveHeader = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/website/sections/${editingSection.id}`, headerData);
      if (res.data.success) {
        setSections(sections.map(s => s.id === editingSection.id ? { ...s, ...headerData } : s));
        setEditingSection(null);
        setSuccess('Section header updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Failed to update section header');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-hst-teal" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-hst-dark">Website <span className="text-hst-teal">Layout</span></h2>
          <p className="text-gray-500 font-medium">Manage visibility and display order of website sections.</p>
        </div>
        <button
          onClick={handleSaveOrder}
          disabled={saving}
          className="bg-hst-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-hst-teal transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center gap-3 border border-green-100"
          >
            <CheckCircle2 size={20} />
            <span className="font-bold">{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100"
          >
            <AlertCircle size={20} />
            <span className="font-bold">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
        <div className="divide-y divide-gray-50">
          {sections.map((section, index) => {
            const canMoveUp = index > 0;
            const canMoveDown = index < sections.length - 1;

            return (
              <motion.div 
                key={section.id}
                layout
                className={`p-6 flex items-center gap-6 transition-colors ${!section.is_active ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
              >
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => moveSection(index, -1)}
                    disabled={!canMoveUp}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-0"
                  >
                    <motion.div whileHover={canMoveUp ? { scale: 1.1 } : {}}>▲</motion.div>
                  </button>
                  <div className="flex justify-center text-xs font-black text-gray-300">
                    {section.sort_order}
                  </div>
                  <button 
                    onClick={() => moveSection(index, 1)}
                    disabled={!canMoveDown}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-0"
                  >
                    <motion.div whileHover={canMoveDown ? { scale: 1.1 } : {}}>▼</motion.div>
                  </button>
                </div>

                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-hst-light text-hst-teal">
                  <Layout size={24} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-black text-lg ${!section.is_active ? 'text-gray-400' : 'text-hst-dark'}`}>
                      {section.name}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Key: {section.section_key}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {section.section_key !== 'hero' && section.section_key !== 'cta' && (
                    <button
                      onClick={() => handleEditHeader(section)}
                      className="p-2 text-gray-400 hover:text-hst-teal hover:bg-hst-light rounded-lg transition-all"
                      title="Edit Section Headers"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleActive(section.id, section.is_active)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                      section.is_active 
                      ? 'bg-hst-green/10 text-hst-green hover:bg-hst-green/20' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {section.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    {section.is_active ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
          <AlertCircle size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-blue-900">How to use</h4>
          <p className="text-sm text-blue-700 font-medium">
            Use the arrows to reorder sections. Toggle the eye icon to show or hide a section from the website. 
            Click "Save Changes" to apply the new order. Click the edit icon to change section titles and descriptions.
          </p>
        </div>
      </div>

      {/* Edit Header Modal */}
      <AnimatePresence>
        {editingSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingSection(null)}
              className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-hst-light/30">
                <div>
                  <h3 className="text-2xl font-black text-hst-dark">Edit Section <span className="text-hst-teal">Content</span></h3>
                  <p className="text-gray-500 text-sm font-medium">Update the header information for {editingSection.name}</p>
                </div>
                <button 
                  onClick={() => setEditingSection(null)}
                  className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-hst-dark transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Section Subtitle</label>
                  <input
                    type="text"
                    value={headerData.subtitle}
                    onChange={(e) => setHeaderData({ ...headerData, subtitle: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="e.g. Our Approach"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Section Title</label>
                  <input
                    type="text"
                    value={headerData.title}
                    onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="e.g. Fostering a Self-Sustaining Cycle of Change"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Section Description</label>
                  <textarea
                    value={headerData.description}
                    onChange={(e) => setHeaderData({ ...headerData, description: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[120px]"
                    placeholder="Enter a brief description for this section..."
                  />
                </div>
              </div>

              <div className="p-8 bg-hst-light/30 border-t border-gray-100 flex justify-end gap-4">
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:text-hst-dark transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHeader}
                  disabled={saving}
                  className="bg-hst-dark text-white px-10 py-4 rounded-2xl font-black hover:bg-hst-teal transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-hst-dark/20"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save Content
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminWebsiteLayout;
