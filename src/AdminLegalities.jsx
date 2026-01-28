import React, { useState, useEffect } from 'react';
import api from './api/api';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Save, 
  Loader2, 
  User, 
  FileText, 
  Landmark, 
  CreditCard,
  MapPin
} from 'lucide-react';

const AdminLegalities = () => {
  const [formData, setFormData] = useState({
    managing_trustee: '',
    contact_person_label: 'Contact Person',
    legal_status: '',
    registration_number: '',
    tax_exemption_label: '12AA/80G Certificate',
    tax_exemption_value: '',
    fcra_number: '',
    pan_number: '',
    ngo_darpan_id: '',
    csr_number: '',
    registered_office: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLegalities();
  }, []);

  const fetchLegalities = async () => {
    try {
      const res = await api.get('/website/legalities');
      if (res.data.success && res.data.data) {
        // Ensure all fields have at least an empty string to avoid uncontrolled input warnings
        const sanitizedData = { ...formData };
        Object.keys(formData).forEach(key => {
          if (res.data.data[key] !== undefined && res.data.data[key] !== null) {
            sanitizedData[key] = res.data.data[key];
          }
        });
        setFormData(sanitizedData);
      }
    } catch (err) {
      console.error('Failed to fetch legalities data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/website/legalities', formData);
      alert('Legalities section updated successfully');
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
        <h2 className="text-3xl font-black text-hst-dark">Legal <span className="text-hst-teal">Information</span></h2>
        <p className="text-gray-500 font-medium">Manage transparency and compliance details shown on the website.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
            <h3 className="font-black text-xl flex items-center gap-2">
              <User className="text-hst-teal" size={24} />
              Trustees & Leadership
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Managing Trustee</label>
                <input
                  type="text"
                  value={formData.managing_trustee || ''}
                  onChange={(e) => setFormData({...formData, managing_trustee: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder="e.g. Mr. S.Vivek"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Contact Person Label</label>
                <input
                  type="text"
                  value={formData.contact_person_label || ''}
                  onChange={(e) => setFormData({...formData, contact_person_label: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder="e.g. Contact Person"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
            <h3 className="font-black text-xl flex items-center gap-2">
              <ShieldCheck className="text-hst-teal" size={24} />
              Registration Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Legal Status</label>
                <input
                  type="text"
                  value={formData.legal_status || ''}
                  onChange={(e) => setFormData({...formData, legal_status: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder="e.g. Registered under Indian Trust Act 1882"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Registration Number</label>
                <input
                  type="text"
                  value={formData.registration_number || ''}
                  onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder="e.g. 625/2000"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
            <h3 className="font-black text-xl flex items-center gap-2">
              <MapPin className="text-hst-teal" size={24} />
              Registered Office
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Office Address</label>
                <textarea
                  value={formData.registered_office || ''}
                  onChange={(e) => setFormData({...formData, registered_office: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold min-h-[100px]"
                  placeholder="Enter full registered address..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
            <h3 className="font-black text-xl flex items-center gap-2">
              <Landmark className="text-hst-teal" size={24} />
              Tax & Compliance
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Tax Exemption Label</label>
                <input
                  type="text"
                  value={formData.tax_exemption_label || ''}
                  onChange={(e) => setFormData({...formData, tax_exemption_label: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder="e.g. 12AA/80G Certificate"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Tax Exemption Certificate No.</label>
                <input
                  type="text"
                  value={formData.tax_exemption_value || ''}
                  onChange={(e) => setFormData({...formData, tax_exemption_value: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder="Enter certificate numbers..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">FCRA Number</label>
                  <input
                    type="text"
                    value={formData.fcra_number || ''}
                    onChange={(e) => setFormData({...formData, fcra_number: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="e.g. 76080066"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">PAN Number</label>
                  <input
                    type="text"
                    value={formData.pan_number || ''}
                    onChange={(e) => setFormData({...formData, pan_number: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                    placeholder="e.g. AAATH4490F"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">CSR Registration Number</label>
                <input
                  type="text"
                  value={formData.csr_number || ''}
                  onChange={(e) => setFormData({...formData, csr_number: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder="e.g. CSR00001234"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">NGO Darpan / NITI Aayog ID</label>
                <input
                  type="text"
                  value={formData.ngo_darpan_id || ''}
                  onChange={(e) => setFormData({...formData, ngo_darpan_id: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
                  placeholder="e.g. TN/2017/0169112"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-hst-dark text-white py-5 rounded-2xl font-black text-lg hover:bg-hst-teal transition-all shadow-xl shadow-hst-dark/10 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            Update Legal Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLegalities;
