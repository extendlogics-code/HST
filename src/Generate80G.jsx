import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  IndianRupee, 
  MapPin, 
  Tag, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  Eye, 
  X,
  CheckCircle2,
  AlertTriangle,
  Plus,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from './api/api';
import DonorSelect from './components/DonorSelect';
import LiveCertificatePreview from './components/LiveCertificatePreview';

const Generate80G = () => {
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showNewDonorModal, setShowNewDonorModal] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [newDonorData, setNewDonorData] = useState({
    donor_name: '',
    donor_type: 'INDIVIDUAL',
    email: '',
    phone: '',
    address: '',
    pan: ''
  });
  const [donationData, setDonationData] = useState({
    amount: '',
    donation_date: new Date().toISOString().split('T')[0],
    payment_mode: 'UPI',
    transaction_ref: '',
    bank_name: '',
    purpose: 'General Donation',
    remarks: ''
  });
  const [showCashWarning, setShowCashWarning] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [orientation, setOrientation] = useState('landscape');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings/trust');
      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch settings');
    }
  };

  const handleNewDonorSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for 80G donors
    if (!newDonorData.pan || newDonorData.pan.length !== 10) {
      return alert('A valid 10-digit PAN is mandatory for 80G certificates');
    }

    setLoading(true);
    try {
      // Set category to local for 80G donors
      const donorToCreate = {
        ...newDonorData,
        category: 'local'
      };
      
      const { data } = await api.post('/donors', donorToCreate);
      if (data.success) {
        setSelectedDonor(data.data);
        setShowNewDonorModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create donor');
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDonor) return alert('Please select a donor');
    
    // CASH compliance check
    if (donationData.payment_mode === 'CASH' && parseFloat(donationData.amount) > 2000 && !showCashWarning) {
      setShowCashWarning(true);
      return;
    }

    setLoading(true);
    try {
      // 1. Create Donation
      const donationRes = await api.post('/donations', {
        ...donationData,
        donor_id: selectedDonor.id,
        is_direct_certificate: true,
        status: 'COMPLETED'
      });

      if (donationRes.data.success) {
        // 2. Generate Certificate
        const certRes = await api.post('/certificates', {
          donation_id: donationRes.data.data.id,
          orientation: orientation
        });

        if (certRes.data.success) {
          setSuccessData({
            certificate_no: certRes.data.data.certificate_no,
            pdf_url: certRes.data.data.pdf_url,
            id: certRes.data.data.id
          });
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process donation');
    } finally {
      setLoading(false);
      setShowCashWarning(false);
    }
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    if (!selectedDonor) return alert('Please select a donor');
    
    setPreviewLoading(true);
    try {
      // Revoke old URL if it exists
      if (previewPdfUrl) {
        window.URL.revokeObjectURL(previewPdfUrl);
      }

      const res = await api.post('/certificates/preview-raw', {
        donor: selectedDonor,
        donation: donationData,
        settings: settings,
        orientation: orientation
      }, { responseType: 'blob' });

      // Ensure we have a blob
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      setPreviewPdfUrl(url);
      setShowPreviewModal(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setShowPreviewModal(false);
    if (previewPdfUrl) {
      window.URL.revokeObjectURL(previewPdfUrl);
      setPreviewPdfUrl(null);
    }
  };

  const downloadPDF = async (certId) => {
    try {
      const response = await api.get(`/certificates/${certId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[40px] p-12 shadow-2xl shadow-hst-teal/10 border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-hst-dark mb-4">Certificate Generated!</h1>
          <p className="text-gray-500 font-medium mb-8">
            Receipt No: <span className="text-hst-teal font-bold">{successData.certificate_no}</span> has been issued to {selectedDonor.donor_name}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => downloadPDF(successData.id)}
              className="hst-gradient text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-hst-teal/20"
            >
              <Download size={20} />
              Download PDF
            </button>
            <button 
              onClick={() => {
                setSuccessData(null);
                setSelectedDonor(null);
                setDonationData({
                  amount: '',
                  donation_date: new Date().toISOString().split('T')[0],
                  payment_mode: 'UPI',
                  transaction_ref: '',
                  bank_name: '',
                  purpose: 'General Donation',
                  remarks: ''
                });
              }}
              className="bg-hst-light text-hst-dark px-8 py-4 rounded-2xl font-black hover:bg-gray-200 transition-colors"
            >
              New Donation
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-hst-dark mb-2">Generate <span className="text-hst-teal">80G Certificate</span></h1>
          <p className="text-gray-500 font-medium italic">Create and issue tax-exemption certificates for donors</p>
        </div>

        <div className="flex gap-3">
          <Link 
            to="/admin/history"
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black text-sm text-hst-dark hover:border-hst-teal/30 transition-all shadow-sm"
          >
            <History size={18} className="text-hst-teal" />
            View History
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-hst-dark">Generate 80G</h1>
            <div className="flex gap-3">
              <span className="px-4 py-2 bg-hst-teal/10 text-hst-teal rounded-xl text-xs font-black uppercase tracking-widest">Manual Entry</span>
            </div>
          </div>

          {/* Donor Selection */}
          <section className="bg-white rounded-[40px] p-8 shadow-xl shadow-hst-dark/5 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-hst-teal/10 text-hst-teal rounded-xl flex items-center justify-center">
                <User size={20} />
              </div>
              <h2 className="text-xl font-black text-hst-dark">Donor Details</h2>
            </div>

            {selectedDonor ? (
              <div className="flex items-center justify-between p-6 bg-hst-light/30 rounded-3xl border-2 border-hst-teal/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white text-hst-teal rounded-2xl flex items-center justify-center shadow-sm">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-hst-dark">{selectedDonor.donor_name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{selectedDonor.email} • {selectedDonor.phone}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDonor(null)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <DonorSelect 
                onSelect={setSelectedDonor} 
                onNewDonor={(name) => {
                  setNewDonorData(prev => ({ ...prev, donor_name: name }));
                  setShowNewDonorModal(true);
                }}
              />
            )}
          </section>

          {/* Donation Details */}
          <section className="bg-white rounded-[40px] p-8 shadow-xl shadow-hst-dark/5 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-hst-teal/10 text-hst-teal rounded-xl flex items-center justify-center">
                  <IndianRupee size={20} />
                </div>
                <h2 className="text-xl font-black text-hst-dark">Donation Info</h2>
              </div>

              {/* Orientation Toggle */}
              <div className="flex items-center bg-gray-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOrientation('portrait')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    orientation === 'portrait' 
                    ? 'bg-white text-hst-teal shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  PORTRAIT
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('landscape')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    orientation === 'landscape' 
                    ? 'bg-white text-hst-teal shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  LANDSCAPE
                </button>
              </div>
            </div>

            <form onSubmit={handleDonationSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Amount (INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required
                      type="number"
                      name="amount"
                      value={donationData.amount}
                      onChange={(e) => setDonationData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter amount"
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-12 pr-4 py-4 outline-none transition-all font-bold text-hst-teal"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required
                      type="date"
                      name="donation_date"
                      value={donationData.donation_date}
                      onChange={(e) => setDonationData(prev => ({ ...prev, donation_date: e.target.value }))}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-12 pr-4 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Payment Mode</label>
                  <div className="relative">
                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      name="payment_mode"
                      value={donationData.payment_mode}
                      onChange={(e) => setDonationData(prev => ({ ...prev, payment_mode: e.target.value }))}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-12 pr-4 py-4 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="UPI">UPI / QR Code</option>
                      <option value="NEFT">Bank Transfer (NEFT/IMPS)</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="CASH">Cash</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Transaction Ref / Cheque No</label>
                  <div className="relative">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text"
                      name="transaction_ref"
                      value={donationData.transaction_ref}
                      onChange={(e) => setDonationData(prev => ({ ...prev, transaction_ref: e.target.value }))}
                      placeholder="Optional reference number"
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-12 pr-4 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Purpose / Remarks</label>
                <textarea 
                  name="purpose"
                  value={donationData.purpose}
                  onChange={(e) => setDonationData(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="e.g. General Donation, Education Fund..."
                  className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl p-6 outline-none transition-all font-medium min-h-[100px]"
                ></textarea>
              </div>

              {showCashWarning && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-orange-50 border-2 border-orange-200 rounded-3xl flex items-start gap-4"
                >
                  <AlertTriangle className="text-orange-500 shrink-0" size={24} />
                  <div>
                    <h4 className="font-black text-orange-800">Compliance Warning</h4>
                    <p className="text-sm text-orange-700 font-medium mt-1">
                      Cash donations above ₹2,000 are not eligible for 80G tax exemption under Income Tax rules. 
                      Are you sure you want to proceed?
                    </p>
                    <button 
                      type="submit"
                      className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
                    >
                      Yes, I Confirm
                    </button>
                  </div>
                </motion.div>
              )}

              {!showCashWarning && (
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowLivePreview(true)}
                    disabled={!selectedDonor}
                    className="flex-1 bg-white border-2 border-hst-teal text-hst-teal py-5 rounded-3xl font-black text-lg hover:bg-hst-teal/5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Eye size={24} />
                    Live Preview
                  </button>
                  <button 
                    type="submit"
                    disabled={loading || !selectedDonor}
                    className="flex-[2] hst-gradient text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-hst-teal/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <FileText size={24} />}
                    Generate Certificate
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>

        {/* Info/Help Section */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-hst-dark text-white rounded-[40px] p-8 shadow-2xl">
            <h3 className="text-xl font-black mb-6">NGO Compliance</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-hst-teal" />
                </div>
                <div>
                  <p className="text-sm font-bold">80G Exemption</p>
                  <p className="text-xs text-white/50 font-medium mt-1">Donors get 50% tax deduction on eligible modes.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle size={16} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Cash Limit</p>
                  <p className="text-xs text-white/50 font-medium mt-1">Strict ₹2,000 limit for 80G benefits.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <Tag size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">PAN Required</p>
                  <p className="text-xs text-white/50 font-medium mt-1">PAN is mandatory for 80G reporting.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="p-8 bg-hst-teal/5 rounded-[40px] border-2 border-hst-teal/10">
            <h4 className="font-black text-hst-dark mb-2">Need Help?</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              If you encounter issues with certificate generation or numbering, please contact the admin.
            </p>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <AnimatePresence>
        {showLivePreview && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLivePreview(false)}
              className="absolute inset-0 bg-hst-dark/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full ${orientation === 'landscape' ? 'max-w-7xl' : 'max-w-4xl'} max-h-[95vh] bg-gray-100 rounded-[40px] shadow-2xl overflow-hidden flex flex-col`}
            >
              <div className="p-6 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-hst-teal/10 text-hst-teal rounded-xl flex items-center justify-center">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-hst-dark">Live Certificate Preview</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Draft preview in {orientation} mode</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live View Active
                  </div>
                  <button 
                    onClick={() => setShowLivePreview(false)}
                    className="w-10 h-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-200 hover:text-hst-dark transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 md:p-12 flex justify-center bg-gray-200/50">
                <div className={`${orientation === 'landscape' ? 'w-full transform scale-[0.6] sm:scale-[0.7] md:scale-[0.85] lg:scale-100' : 'w-fit'} origin-top`}>
                  <LiveCertificatePreview 
                    donor={selectedDonor}
                    donation={donationData}
                    settings={settings}
                    orientation={orientation}
                  />
                </div>
              </div>

              <div className="p-8 bg-white border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                  <AlertCircle size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">This is a visual preview. The final PDF may vary slightly.</span>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => setShowLivePreview(false)}
                    className="flex-1 sm:flex-none px-8 py-4 bg-gray-100 text-hst-dark rounded-2xl font-black hover:bg-gray-200 transition-colors"
                  >
                    Back to Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      setShowLivePreview(false);
                      handleDonationSubmit(e);
                    }}
                    className="flex-1 sm:flex-none px-10 py-4 hst-gradient text-white rounded-2xl font-black shadow-xl shadow-hst-teal/20 flex items-center justify-center gap-3"
                  >
                    <FileText size={20} />
                    Issue Certificate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* New Donor Modal */}
      <AnimatePresence>
        {showNewDonorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewDonorModal(false)}
              className="absolute inset-0 bg-hst-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-hst-teal/10 text-hst-teal rounded-xl flex items-center justify-center">
                    <Plus size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-hst-dark">New Donor</h2>
                </div>
                <button onClick={() => setShowNewDonorModal(false)} className="text-gray-400 hover:text-hst-dark transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleNewDonorSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Full Name / Company Name</label>
                    <input 
                      required
                      type="text"
                      value={newDonorData.donor_name}
                      onChange={(e) => setNewDonorData(prev => ({ ...prev, donor_name: e.target.value }))}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Type</label>
                    <select 
                      value={newDonorData.donor_type}
                      onChange={(e) => setNewDonorData(prev => ({ ...prev, donor_type: e.target.value }))}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="COMPANY">Company</option>
                      <option value="TRUST">Trust/NGO</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">PAN Number (Mandatory for 80G)</label>
                    <input 
                      required
                      type="text"
                      placeholder="ABCDE1234F"
                      value={newDonorData.pan}
                      onChange={(e) => setNewDonorData(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Email</label>
                    <input 
                      type="email"
                      value={newDonorData.email}
                      onChange={(e) => setNewDonorData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Phone</label>
                    <input 
                      type="text"
                      value={newDonorData.phone}
                      onChange={(e) => setNewDonorData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Address</label>
                  <textarea 
                    value={newDonorData.address}
                    onChange={(e) => setNewDonorData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium min-h-[100px]"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full hst-gradient text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-hst-teal/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                  Create & Select Donor
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Generate80G;
