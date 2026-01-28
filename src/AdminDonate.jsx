import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from './api/api';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Save, 
  Loader2, 
  Landmark, 
  CheckCircle2,
  AlertCircle,
  Copy,
  Upload
} from 'lucide-react';

const AdminDonate = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    local_bank_details: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
      address: '',
      ifscCode: '',
      swiftCode: ''
    },
    fcra_bank_details: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
      address: '',
      ifscCode: '',
      swiftCode: ''
    },
    local_qr_code_url: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localUploading, setLocalUploading] = useState(false);

  useEffect(() => {
    fetchDonate();
  }, []);

  const fetchDonate = async () => {
    try {
      const res = await api.get('/website/donate');
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          local_bank_details: typeof data.local_bank_details === 'string' 
            ? JSON.parse(data.local_bank_details) 
            : (data.local_bank_details || formData.local_bank_details),
          fcra_bank_details: typeof data.fcra_bank_details === 'string' 
            ? JSON.parse(data.fcra_bank_details) 
            : (data.fcra_bank_details || formData.fcra_bank_details),
          local_qr_code_url: data.local_qr_code_url || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch donate data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBankDetailChange = (type, field, value) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [field]: value
      }
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('section', 'donate');
    uploadData.append('image', file);

    setLocalUploading(true);

    try {
      const res = await api.post('/website/upload', uploadData);
      if (res.data.success) {
        setFormData({ ...formData, local_qr_code_url: res.data.url });
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setLocalUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/website/donate', formData);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to save donate data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-hst-teal" size={32} />
      </div>
    );
  }

  const BankForm = ({ type, title, icon: Icon }) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
        <div className="w-10 h-10 rounded-xl bg-hst-teal/10 flex items-center justify-center text-hst-teal">
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-black text-hst-dark">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Account Name</label>
          <input
            type="text"
            value={formData[type].accountName}
            onChange={(e) => handleBankDetailChange(type, 'accountName', e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-hst-teal/20 text-sm font-bold"
            placeholder="Account Name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Account Number</label>
          <input
            type="text"
            value={formData[type].accountNumber}
            onChange={(e) => handleBankDetailChange(type, 'accountNumber', e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-hst-teal/20 text-sm font-bold"
            placeholder="Account Number"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Bank Name</label>
          <input
            type="text"
            value={formData[type].bankName}
            onChange={(e) => handleBankDetailChange(type, 'bankName', e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-hst-teal/20 text-sm font-bold"
            placeholder="Bank Name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Branch</label>
          <input
            type="text"
            value={formData[type].branch}
            onChange={(e) => handleBankDetailChange(type, 'branch', e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-hst-teal/20 text-sm font-bold"
            placeholder="Branch"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Bank Address</label>
          <input
            type="text"
            value={formData[type].address}
            onChange={(e) => handleBankDetailChange(type, 'address', e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-hst-teal/20 text-sm font-bold"
            placeholder="Bank Address"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">IFSC Code</label>
          <input
            type="text"
            value={formData[type].ifscCode}
            onChange={(e) => handleBankDetailChange(type, 'ifscCode', e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-hst-teal/20 text-sm font-bold"
            placeholder="IFSC Code"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">SWIFT Code</label>
          <input
            type="text"
            value={formData[type].swiftCode}
            onChange={(e) => handleBankDetailChange(type, 'swiftCode', e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-hst-teal/20 text-sm font-bold"
            placeholder="SWIFT Code"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[22px] bg-hst-teal/10 flex items-center justify-center text-hst-teal shadow-sm">
            <Heart size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-hst-dark">Donate Page</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Manage donation information & bank details</p>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-3 px-8 py-4 bg-hst-teal text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-hst-dark transition-all disabled:opacity-50 shadow-lg shadow-hst-teal/20"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : success ? (
            <CheckCircle2 size={16} />
          ) : (
            <Save size={16} />
          )}
          {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Content */}
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hero Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-6 py-5 bg-gray-50 border-none rounded-[24px] focus:ring-2 focus:ring-hst-teal/20 text-sm font-bold"
                  placeholder="e.g., Make a Difference"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hero Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-6 py-5 bg-gray-50 border-none rounded-[24px] focus:ring-2 focus:ring-hst-teal/20 text-lg font-black"
                  placeholder="e.g., Support Our Mission"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-6 py-5 bg-gray-50 border-none rounded-[24px] focus:ring-2 focus:ring-hst-teal/20 text-sm font-bold leading-relaxed resize-none"
                  placeholder="Describe why people should donate..."
                />
              </div>
            </div>
          </div>

          <BankForm type="local_bank_details" title="Local Bank Details (Domestic)" icon={Landmark} />
          <BankForm type="fcra_bank_details" title="FCRA Bank Details (International)" icon={Landmark} />
        </div>

        <div className="space-y-10">
          {/* Local QR Code Upload */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-hst-dark flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-hst-teal/10 flex items-center justify-center text-hst-teal">
                <Copy size={16} />
              </div>
              Local QR Code
            </h3>
            
            <div className="relative group">
              <div className="aspect-square rounded-3xl bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden">
                {formData.local_qr_code_url ? (
                  <img 
                    src={`${BASE_URL}/${formData.local_qr_code_url}`} 
                    alt="Local QR Code" 
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white mx-auto flex items-center justify-center text-gray-300 shadow-sm">
                      <Upload size={24} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Local QR</p>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
              </div>
              {localUploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <Loader2 className="animate-spin text-hst-teal" size={24} />
                </div>
              )}
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
              Upload a UPI or Bank QR code that domestic donors can scan to make direct transfers.
            </p>
          </div>

          {/* Tips/Info */}
          <div className="bg-hst-dark p-8 rounded-[40px] text-white space-y-6 shadow-xl shadow-hst-dark/20">
            <h3 className="text-lg font-black flex items-center gap-3">
              <AlertCircle size={20} className="text-hst-teal" />
              Pro Tips
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-xs font-bold opacity-80 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-hst-teal mt-1.5 shrink-0" />
                FCRA donations are restricted to account transfers (SWIFT/Wire) only. QR codes are not permitted for international donations.
              </li>
              <li className="flex gap-3 text-xs font-bold opacity-80 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-hst-teal mt-1.5 shrink-0" />
                Ensure bank details are 100% accurate to avoid transfer issues.
              </li>
              <li className="flex gap-3 text-xs font-bold opacity-80 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-hst-teal mt-1.5 shrink-0" />
                Update the QR codes whenever you change your UPI IDs or bank accounts.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDonate;