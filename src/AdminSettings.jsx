import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Loader2, Building2, FileText, MapPin, Phone, Mail, User, ShieldCheck, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import api, { BASE_URL } from './api/api';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const signatureInputRef = useRef(null);
  const sealInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const [formData, setFormData] = useState({
    trust_name: '',
    pan_number: '',
    reg_80g_no: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    authorized_signatory_name: '',
    authorized_signatory_designation: '',
    certificate_prefix: 'HST-80G',
    signature_image_url: '',
    seal_image_url: '',
    logo_image_url: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/trust');
      if (response.data.success && response.data.data) {
        // Ensure null values are converted to empty strings for controlled inputs
        const sanitizedData = { ...response.data.data };
        Object.keys(sanitizedData).forEach(key => {
          if (sanitizedData[key] === null) sanitizedData[key] = '';
        });
        setFormData(sanitizedData);
      }
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('asset', file); 

    setLoading(true);
    try {
      let endpoint = '';
      if (type === 'signature') endpoint = '/settings/assets/signature';
      else if (type === 'seal') endpoint = '/settings/assets/seal';
      else if (type === 'logo') endpoint = '/settings/assets/logo';

      const response = await api.post(endpoint, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        let fieldName = '';
        if (type === 'signature') fieldName = 'signature_image_url';
        else if (type === 'seal') fieldName = 'seal_image_url';
        else if (type === 'logo') fieldName = 'logo_image_url';

        const newUrl = response.data.data[fieldName];
        setFormData(prev => ({
          ...prev,
          [fieldName]: newUrl
        }));
        
        // Success feedback for upload
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-10 right-10 bg-hst-green text-white px-8 py-4 rounded-2xl font-bold shadow-2xl z-50 animate-bounce';
        toast.innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
    } catch (err) {
      alert(`Failed to upload ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove metadata fields before sending to API
      const { id, created_at, updated_at, ...updateData } = formData;
      const response = await api.put('/settings/trust', updateData);
      
      if (response.data.success) {
        // Show success toast instead of alert for better UX
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-10 right-10 bg-hst-teal text-white px-8 py-4 rounded-2xl font-bold shadow-2xl z-50 animate-bounce';
        toast.innerText = 'Settings updated successfully!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
        
        // Update local state with returned data
        if (response.data.data) {
          const sanitizedData = { ...response.data.data };
          Object.keys(sanitizedData).forEach(key => {
            if (sanitizedData[key] === null) sanitizedData[key] = '';
          });
          setFormData(sanitizedData);
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  return (
    <div className="font-sans text-hst-dark">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black mb-2">Trust <span className="text-hst-teal">Settings</span></h1>
            <p className="text-gray-500 font-medium">Update trust details and assets used in 80G certificates</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <CheckCircle2 size={14} className="text-hst-green" />
            Changes affect all new certificates
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl shadow-hst-dark/5"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Trust Details */}
            <div className="space-y-8">
              <h3 className="text-xl font-black flex items-center gap-2 border-b border-gray-100 pb-4">
                <Building2 size={24} className="text-hst-teal" />
                Trust Information
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Trust Name</label>
                <div className="relative">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    required
                    type="text" 
                    name="trust_name"
                    value={formData.trust_name}
                    onChange={handleInputChange}
                    placeholder="Enter full legal trust name"
                    className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">PAN Number</label>
                  <div className="relative">
                    <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      required
                      type="text" 
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleInputChange}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">80G Reg Number</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      required
                      type="text" 
                      name="reg_80g_no"
                      value={formData.reg_80g_no}
                      onChange={handleInputChange}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Address Line 1</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      required
                      type="text" 
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      placeholder="Street address, P.O. box"
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Address Line 2</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">City</label>
                  <input 
                    required
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">State</label>
                  <input 
                    required
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Pincode</label>
                  <input 
                    required
                    type="text" 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Cert Prefix</label>
                  <div className="relative">
                    <Settings className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      name="certificate_prefix"
                      value={formData.certificate_prefix}
                      onChange={handleInputChange}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Assets & Signatory */}
            <div className="space-y-8 pt-4">
              <h3 className="text-xl font-black flex items-center gap-2 border-b border-gray-100 pb-4">
                <User size={24} className="text-hst-green" />
                Signatory & Assets
              </h3>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Signatory Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        required
                        type="text" 
                        name="authorized_signatory_name"
                        value={formData.authorized_signatory_name}
                        onChange={handleInputChange}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Designation</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        required
                        type="text" 
                        name="authorized_signatory_designation"
                        value={formData.authorized_signatory_designation}
                        onChange={handleInputChange}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider text-center block">Trust Logo</label>
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="aspect-square bg-hst-light/30 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-hst-teal/50 hover:bg-white transition-all overflow-hidden relative group"
                    >
                      {formData.logo_image_url ? (
                        <>
                          <img src={(() => {
                            const url = formData.logo_image_url;
                            if (url.startsWith('http')) {
                              return url.replace('http://localhost:5000', BASE_URL);
                            }
                            const cleanPath = url.startsWith('/') ? url : `/${url}`;
                            return `${BASE_URL}${cleanPath}`;
                          })()} alt="Trust Logo" className="w-full h-full object-contain p-4" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                            <Upload size={20} />
                          </div>
                          <span className="text-xs font-black text-gray-400">Upload JPG/PNG</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                    />
                  </div>

                  {/* Signature Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider text-center block">Signature</label>
                    <div 
                      onClick={() => signatureInputRef.current?.click()}
                      className="aspect-square bg-hst-light/30 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-hst-teal/50 hover:bg-white transition-all overflow-hidden relative group"
                    >
                      {formData.signature_image_url ? (
                        <>
                          <img src={(() => {
                            const url = formData.signature_image_url;
                            if (!url) return '';
                            if (url.startsWith('http')) {
                              return url.replace('http://localhost:5000', BASE_URL);
                            }
                            const cleanPath = url.startsWith('/') ? url : `/${url}`;
                            return `${BASE_URL}${cleanPath}`;
                          })()} alt="Signature" className="w-full h-full object-contain p-4" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                            <Upload size={20} />
                          </div>
                          <span className="text-xs font-black text-gray-400">Upload JPG/PNG</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={signatureInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'signature')}
                    />
                  </div>

                  {/* Seal Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider text-center block">Trust Seal</label>
                    <div 
                      onClick={() => sealInputRef.current?.click()}
                      className="aspect-square bg-hst-light/30 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-hst-teal/50 hover:bg-white transition-all overflow-hidden relative group"
                    >
                      {formData.seal_image_url ? (
                        <>
                          <img src={(() => {
                            const url = formData.seal_image_url;
                            if (!url) return '';
                            if (url.startsWith('http')) {
                              return url.replace('http://localhost:5000', BASE_URL);
                            }
                            const cleanPath = url.startsWith('/') ? url : `/${url}`;
                            return `${BASE_URL}${cleanPath}`;
                          })()} alt="Trust Seal" className="w-full h-full object-contain p-4" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                            <Upload size={20} />
                          </div>
                          <span className="text-xs font-black text-gray-400">Upload JPG/PNG</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={sealInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'seal')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <button 
                type="submit"
                disabled={loading}
                className="w-full hst-gradient text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-hst-teal/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <Save size={24} />
                    Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;
