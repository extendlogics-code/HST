import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from './api/api';
import { motion } from 'framer-motion';
import { 
  Info, 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  History,
  Heart,
  Target,
  User,
  Quote
} from 'lucide-react';

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    experience_years: '',
    features: [],
    button_text: '',
    button_url: '',
    origin_title: '',
    origin_content: '',
    objectives_title: '',
    objectives: [],
    mission_title: '',
    mission_statement: '',
    founder_name: '',
    founder_degree: '',
    founder_title: '',
    founder_bio: '',
    founder_image_url: '',
    founder_quote: '',
    trustee_name: '',
    trustee_degree: '',
    trustee_title: '',
    trustee_message: '',
    trustee_image: '',
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [uploading, setUploading] = useState(false);
  const [founderUploading, setFounderUploading] = useState(false);
  const [trusteeUploading, setTrusteeUploading] = useState(false);
  const [rollingUploading, setRollingUploading] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await api.get('/website/about');
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        // Ensure all string fields have at least an empty string to avoid uncontrolled input warnings
        const sanitizedData = { ...formData };
        Object.keys(formData).forEach(key => {
          if (data[key] !== undefined && data[key] !== null) {
            sanitizedData[key] = data[key];
          }
        });

        setFormData({
          ...sanitizedData,
          features: typeof data.features === 'string' ? JSON.parse(data.features) : (data.features || []),
          objectives: typeof data.objectives === 'string' ? JSON.parse(data.objectives) : (data.objectives || []),
          images: typeof data.images === 'string' ? JSON.parse(data.images) : (data.images || [])
        });
      }
    } catch (err) {
      console.error('Failed to fetch about data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const section = field === 'image_url' || field === 'rolling' ? 'about' : field === 'founder_image_url' ? 'founder' : 'trustee';
    const uploadData = new FormData();
    uploadData.append('section', section);
    uploadData.append('image', file);

    if (field === 'image_url') setUploading(true);
    else if (field === 'founder_image_url') setFounderUploading(true);
    else if (field === 'rolling') setRollingUploading(true);
    else setTrusteeUploading(true);

    try {
      const res = await api.post('/website/upload', uploadData);
      if (res.data.success) {
        if (field === 'rolling') {
          setFormData({ ...formData, images: [...formData.images, res.data.url] });
        } else {
          setFormData({ ...formData, [field]: res.data.url });
        }
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      if (field === 'image_url') setUploading(false);
      else if (field === 'founder_image_url') setFounderUploading(false);
      else if (field === 'rolling') setRollingUploading(false);
      else setTrusteeUploading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives, newObjective.trim()]
      });
      setNewObjective('');
    }
  };

  const removeObjective = (index) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index)
    });
  };

  const removeRollingImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/website/about', formData);
      alert('About section updated successfully');
    } catch (err) {
      alert('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-hst-teal" size={40} /></div>;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-black text-hst-dark">About <span className="text-hst-teal">Section</span></h2>
        <p className="text-gray-500 font-medium">Manage the content of your About Us section and page.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Homepage Section Content */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <Info className="text-hst-teal" size={24} />
                Homepage: Main Content
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="e.g. Fostering a Self-Sustaining Cycle of Change"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Subtitle (Approach)</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="e.g. Our Approach"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[150px]"
                    placeholder="Describe your approach..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Years Experience</label>
                    <input
                      type="text"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="e.g. 15+"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={formData.button_text}
                      onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="Read Our Story"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Button URL</label>
                  <input
                    type="text"
                    value={formData.button_url}
                    onChange={(e) => setFormData({...formData, button_url: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="/about"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <ImageIcon className="text-hst-teal" size={24} />
                Homepage: About Image
              </h3>
              
              <div className="space-y-4">
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
                    alt="About" 
                    className="w-full h-48 object-cover rounded-2xl border"
                  />
                )}
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full py-3 rounded-xl bg-hst-light border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-hst-teal hover:text-hst-teal transition-all">
                      {uploading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                      {formData.image_url ? 'Change Image' : 'Upload Image'}
                    </div>
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'image_url')} accept="image/*" />
                  </label>
                </div>
              </div>
            </div>

            {/* Rolling Images Section */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <History className="text-hst-teal" size={24} />
                Rolling Images (Slideshow)
              </h3>
              <p className="text-sm text-gray-500 font-medium">Add multiple images for a smooth rolling effect on the homepage.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {formData.images && formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={(() => {
                        if (!url) return '';
                        if (url.startsWith('http')) {
                          return url.replace('http://localhost:5000', BASE_URL);
                        }
                        const cleanPath = url.startsWith('/') ? url : `/${url}`;
                        return `${BASE_URL}${cleanPath}`;
                      })()} 
                      alt={`Rolling ${index}`} 
                      className="w-full h-32 object-cover rounded-2xl border"
                    />
                    <button
                      type="button"
                      onClick={() => removeRollingImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <label className="cursor-pointer h-32">
                  <div className="w-full h-full rounded-2xl bg-hst-light border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 font-bold hover:border-hst-teal hover:text-hst-teal transition-all">
                    {rollingUploading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                    <span className="text-[10px] uppercase tracking-widest">Add Image</span>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'rolling')} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <CheckCircle2 className="text-hst-teal" size={24} />
                Homepage: Features / Services
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="Add a feature..."
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="p-3 bg-hst-teal text-white rounded-xl hover:bg-hst-dark transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-hst-light rounded-xl group">
                      <span className="font-bold text-hst-dark">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Us Page Content: Mission & Origin */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <History className="text-hst-teal" size={24} />
                About Page: Origin Section
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Origin Title</label>
                  <input
                    type="text"
                    value={formData.origin_title}
                    onChange={(e) => setFormData({...formData, origin_title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="Origin of the Organization"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Origin Content</label>
                  <textarea
                    value={formData.origin_content}
                    onChange={(e) => setFormData({...formData, origin_content: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[200px]"
                    placeholder="Enter the origin story..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <Heart className="text-hst-teal" size={24} />
                About Page: Mission Section
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Mission Title</label>
                  <input
                    type="text"
                    value={formData.mission_title}
                    onChange={(e) => setFormData({...formData, mission_title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="Mission Statement"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Mission Statement</label>
                  <textarea
                    value={formData.mission_statement}
                    onChange={(e) => setFormData({...formData, mission_statement: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[100px]"
                    placeholder="Enter mission statement..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <Target className="text-hst-teal" size={24} />
                About Page: Main Objectives
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Objectives Title</label>
                  <input
                    type="text"
                    value={formData.objectives_title}
                    onChange={(e) => setFormData({...formData, objectives_title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="Main Objectives"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                    className="flex-1 px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="Add an objective..."
                  />
                  <button
                    type="button"
                    onClick={addObjective}
                    className="p-3 bg-hst-teal text-white rounded-xl hover:bg-hst-dark transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-hst-light rounded-xl group">
                      <span className="font-bold text-hst-dark text-sm">{objective}</span>
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Founder Section Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <User className="text-hst-teal" size={24} />
                Founder Information
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Founder Name</label>
                    <input
                      type="text"
                      value={formData.founder_name}
                      onChange={(e) => setFormData({...formData, founder_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="e.g. Mr. M. Shankar"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Degree</label>
                    <input
                      type="text"
                      value={formData.founder_degree}
                      onChange={(e) => setFormData({...formData, founder_degree: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="e.g. M.A.,B.Ed."
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Founder Title</label>
                    <input
                      type="text"
                      value={formData.founder_title}
                      onChange={(e) => setFormData({...formData, founder_title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="Founder & Managing Trustee"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Founder Bio</label>
                  <textarea
                    value={formData.founder_bio}
                    onChange={(e) => setFormData({...formData, founder_bio: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[150px]"
                    placeholder="Enter founder's biography..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <ImageIcon className="text-hst-teal" size={24} />
                Founder: Image & Quote
              </h3>
              
              <div className="space-y-4">
                {formData.founder_image_url && (
                  <img 
                    src={(() => {
                      const url = formData.founder_image_url;
                      if (!url) return '';
                      if (url.startsWith('http')) {
                        return url.replace('http://localhost:5000', BASE_URL);
                      }
                      const cleanPath = url.startsWith('/') ? url : `/${url}`;
                      return `${BASE_URL}${cleanPath}`;
                    })()} 
                    alt="Founder" 
                    className="w-full h-48 object-cover rounded-2xl border"
                  />
                )}
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full py-3 rounded-xl bg-hst-light border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-hst-teal hover:text-hst-teal transition-all">
                      {founderUploading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                      {formData.founder_image_url ? 'Change Image' : 'Upload Image'}
                    </div>
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'founder_image_url')} accept="image/*" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                    <Quote size={12} /> Founder Quote
                  </label>
                  <textarea
                    value={formData.founder_quote}
                    onChange={(e) => setFormData({...formData, founder_quote: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[100px]"
                    placeholder="Enter a meaningful quote from the founder..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <User className="text-hst-teal" size={24} />
                Managing Trustee Information
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.trustee_name}
                      onChange={(e) => setFormData({...formData, trustee_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="Mr. Vivek Shankar"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Degree</label>
                    <input
                      type="text"
                      value={formData.trustee_degree}
                      onChange={(e) => setFormData({...formData, trustee_degree: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="B.E"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.trustee_title}
                      onChange={(e) => setFormData({...formData, trustee_title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                      placeholder="Managing Trustee"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Trustee Message</label>
                  <textarea
                    value={formData.trustee_message}
                    onChange={(e) => setFormData({...formData, trustee_message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[250px]"
                    placeholder="Enter the trustee's message..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <ImageIcon className="text-hst-teal" size={24} />
                Trustee Image
              </h3>
              
              <div className="space-y-4">
                {formData.trustee_image && (
                  <img 
                    src={(() => {
                      const url = formData.trustee_image;
                      if (!url) return '';
                      if (url.startsWith('http')) {
                        return url.replace('http://localhost:5000', BASE_URL);
                      }
                      const cleanPath = url.startsWith('/') ? url : `/${url}`;
                      return `${BASE_URL}${cleanPath}`;
                    })()} 
                    alt="Trustee" 
                    className="w-full h-48 object-cover rounded-2xl border"
                  />
                )}
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full py-3 rounded-xl bg-hst-light border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-hst-teal hover:text-hst-teal transition-all">
                      {trusteeUploading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                      {formData.trustee_image ? 'Change Image' : 'Upload Image'}
                    </div>
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'trustee_image')} accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={saving}
            className="w-full max-w-lg bg-hst-dark text-white py-6 rounded-3xl font-black text-xl hover:bg-hst-teal transition-all shadow-2xl shadow-hst-dark/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={28} /> : <Save size={28} />}
            Save All About Us Content
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAbout;
