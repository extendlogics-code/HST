import React, { useState, useEffect } from 'react';
import { Heart, Landmark, Globe, CheckCircle, Copy, QrCode, ArrowLeft, ShieldCheck, Mail, Phone, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from './api/api';
import { Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollNavigator from './components/ScrollNavigator';

const Donate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [donationType, setDonationType] = useState(null);
  const [donationId, setDonationId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    donor_type: 'INDIVIDUAL',
    message: '',
    pan: '',
    requires80G: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [headerRes, footerRes, donateRes] = await Promise.all([
          api.get('/website/header'),
          api.get('/website/footer'),
          api.get('/website/donate')
        ]);
        if (headerRes.data.success) setHeaderData(headerRes.data.data);
        if (footerRes.data.success) setFooterData(footerRes.data.data);
        if (donateRes.data.success) setPageData(donateRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Prevent negative values for amount
    if (name === 'amount' && value < 0) return;

    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const isPanRequired = donationType === 'local' && formData.requires80G;
  const isFormValid = donationType && 
                     formData.name && 
                     formData.email &&
                     formData.phone &&
                     formData.amount && 
                     Number(formData.amount) >= 100 &&
                     (!isPanRequired || (formData.pan && formData.pan.length === 10));

  const nextStep = async () => {
    if (step === 1) {
      if (!isFormValid) return;
      setLoading(true);
      try {
        const response = await api.post('/donations', {
          ...formData,
          type: donationType
        });
        if (response.data.success) {
          setDonationId(response.data.data.id);
        }
        setStep(2);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error saving donation:', error);
        setStep(2);
        window.scrollTo(0, 0);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleCompleteTransfer = async () => {
    // We no longer update status to COMPLETED automatically.
    // Online donations stay PENDING until manually verified by admin.
    setShowSuccess(true);
    window.scrollTo(0, 0);
  };

  const localBankDetails = pageData?.local_bank_details ? 
    (typeof pageData.local_bank_details === 'string' ? JSON.parse(pageData.local_bank_details) : pageData.local_bank_details) : {
    accountName: "HELP TO SELF HELP TRUST",
    accountNumber: "333202010026005",
    bankName: "Union Bank of India",
    branch: "Chetpet Branch",
    address: "Thiruvannamalai District, Tamilnadu, India - 606801",
    ifscCode: "UBIN0533327",
    swiftCode: "UBININBBOMD"
  };

  const fcraBankDetails = pageData?.fcra_bank_details ? 
    (typeof pageData.fcra_bank_details === 'string' ? JSON.parse(pageData.fcra_bank_details) : pageData.fcra_bank_details) : {
    accountName: "HELP TO SELF HELP TRUST",
    accountNumber: "40089867290",
    bankName: "State Bank of India",
    branch: "New Delhi Main Branch (Code: 00691)",
    address: "FCRA Cell, 4th Floor, 11 Sansad Marg, New Delhi - 110001",
    ifscCode: "SBIN0000691",
    swiftCode: "SBININBB104"
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could use a toast here instead of alert
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-hst-dark overflow-x-hidden">
      <Header data={headerData} />

      <main className="max-w-7xl mx-auto pt-40 pb-16 px-6 lg:pt-48 lg:pb-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Column: Info & Impact */}
          <div className="flex-1 space-y-10 lg:sticky lg:top-32">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 bg-hst-green/10 text-hst-green px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
              >
                <Heart size={14} className="fill-hst-green" /> {pageData?.subtitle || 'Make a Difference'}
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-6xl font-black leading-tight"
              >
                {pageData?.title?.split(' ').slice(0, -1).join(' ')} <br /><span className="text-hst-teal">{pageData?.title?.split(' ').slice(-1)}</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-lg leading-relaxed max-w-md"
              >
                {pageData?.description || 'Your contribution directly empowers marginalized communities through education, health, and sustainable development.'}
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-hst-teal shadow-sm shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-hst-dark">100% Transparency</h4>
                  <p className="text-sm text-gray-500">Every penny you donate is tracked and used directly for community projects.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-hst-green shadow-sm shrink-0">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-hst-dark">Tax Benefits</h4>
                  <p className="text-sm text-gray-500">All donations are eligible for tax exemption under 80G of the Income Tax Act.</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-[40px] bg-hst-dark text-white space-y-6"
            >
              <h4 className="text-xl font-bold">Need Assistance?</h4>
              <div className="space-y-4 opacity-80 text-sm">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-hst-green" />
                  <span>+91 98650 86296, 87540 60638</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-hst-green" />
                  <span>contact@helptoselfhelptrust.org</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-hst-green shrink-0" />
                  <span>Chetpet, Thiruvannamalai - 606801, Tamil Nadu, India.</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Donation Form */}
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] shadow-2xl shadow-hst-dark/5 p-8 lg:p-12 border border-gray-100"
            >
              {/* Progress Stepper */}
              <div className="flex items-center gap-4 mb-12">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= 1 ? 'bg-hst-teal text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-hst-teal' : 'bg-gray-100'}`} />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= 2 ? 'bg-hst-teal text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
              </div>

              {step === 1 && (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-hst-dark">Choose Donation Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setDonationType('local')}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center ${
                          donationType === 'local' 
                          ? 'border-hst-teal bg-hst-light text-hst-teal' 
                          : 'border-gray-100 hover:border-hst-teal/30'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${donationType === 'local' ? 'bg-white' : 'bg-hst-light/50'}`}>
                          <Landmark size={28} />
                        </div>
                        <div>
                          <span className="font-bold block">Local Donation</span>
                          <span className="text-xs opacity-60">(Indian Citizens Only)</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setDonationType('fcra')}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center ${
                          donationType === 'fcra' 
                          ? 'border-hst-teal bg-hst-light text-hst-teal' 
                          : 'border-gray-100 hover:border-hst-teal/30'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${donationType === 'fcra' ? 'bg-white' : 'bg-hst-light/50'}`}>
                          <Globe size={28} />
                        </div>
                        <div>
                          <span className="font-bold block">Foreign Donation</span>
                          <span className="text-xs opacity-60">(FCRA Registered Account)</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-hst-dark">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name *"
                          className="w-full px-6 py-4 rounded-2xl bg-hst-light/50 border-2 border-transparent focus:border-hst-teal/30 focus:bg-white focus:outline-none transition-all font-medium"
                          onChange={handleInputChange}
                          value={formData.name}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address *"
                          className="w-full px-6 py-4 rounded-2xl bg-hst-light/50 border-2 border-transparent focus:border-hst-teal/30 focus:bg-white focus:outline-none transition-all font-medium"
                          onChange={handleInputChange}
                          value={formData.email}
                          required
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number *"
                          className="w-full px-6 py-4 rounded-2xl bg-hst-light/50 border-2 border-transparent focus:border-hst-teal/30 focus:bg-white focus:outline-none transition-all font-medium"
                          onChange={handleInputChange}
                          value={formData.phone}
                          required
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-hst-teal text-xl">
                          {donationType === 'fcra' ? '$' : '₹'}
                        </span>
                        <input
                          type="number"
                          name="amount"
                          placeholder="Amount *"
                          min="100"
                          className={`w-full pl-12 pr-6 py-5 rounded-2xl bg-hst-light/50 border-2 transition-all font-black text-2xl text-hst-teal focus:bg-white focus:outline-none ${
                            formData.amount && Number(formData.amount) < 100 
                              ? 'border-red-200 focus:border-red-400' 
                              : 'border-transparent focus:border-hst-teal/30'
                          }`}
                          onChange={handleInputChange}
                          value={formData.amount}
                          required
                        />
                      </div>
                      {formData.amount && Number(formData.amount) < 100 && (
                        <p className="text-xs font-bold text-red-500 ml-1">
                          Minimum donation amount is {donationType === 'fcra' ? '$' : '₹'}100.
                        </p>
                      )}

                      {donationType === 'local' && (
                        <div className="space-y-4 pt-2">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                name="requires80G"
                                checked={formData.requires80G}
                                onChange={handleInputChange}
                                className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-lg checked:border-hst-teal checked:bg-hst-teal transition-all cursor-pointer"
                              />
                              <CheckCircle size={16} className="absolute left-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                            <span className="font-bold text-hst-dark group-hover:text-hst-teal transition-colors">I require an 80G tax exemption certificate</span>
                          </label>

                          <div className={`space-y-2 transition-all duration-300 overflow-hidden ${formData.requires80G ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="relative">
                              <input
                                type="text"
                                name="pan"
                                placeholder={isPanRequired ? "PAN Card Number *" : "PAN Card Number"}
                                className={`w-full px-6 py-4 rounded-2xl bg-hst-light/50 border-2 transition-all font-bold tracking-widest uppercase focus:bg-white focus:outline-none ${
                                  isPanRequired && (!formData.pan || formData.pan.length !== 10)
                                    ? 'border-red-200 focus:border-red-400' 
                                    : 'border-transparent focus:border-hst-teal/30'
                                }`}
                                onChange={(e) => {
                                  e.target.value = e.target.value.toUpperCase();
                                  handleInputChange(e);
                                }}
                                value={formData.pan}
                                maxLength={10}
                              />
                            </div>
                            <p className="text-xs font-medium text-gray-500 ml-1">
                              PAN is required if you wish to claim 80G tax benefits.
                            </p>
                          </div>
                        </div>
                      )}

                      <textarea
                        name="message"
                        placeholder="Your Message (Optional)"
                        rows="3"
                        className="w-full px-6 py-4 rounded-2xl bg-hst-light/50 border-2 border-transparent focus:border-hst-teal/30 focus:bg-white focus:outline-none transition-all font-medium resize-none"
                        onChange={handleInputChange}
                        value={formData.message}
                      />
                    </div>
                  </div>

                  <button
                    disabled={!isFormValid || loading}
                    onClick={nextStep}
                    className="w-full hst-gradient text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-hst-teal/20 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-3"
                  >
                    {loading ? (
                      <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Next Step <ArrowLeft className="rotate-180" size={24} /></>
                    )}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10 text-center">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-hst-dark">Complete Donation</h3>
                    <p className="text-gray-500">Scan the QR code or use the bank details below to transfer the amount.</p>
                  </div>

                  <div className="flex flex-col items-center gap-8">
                    {donationType === 'local' ? (
                      <div className="p-8 bg-hst-light/30 rounded-[40px] border-2 border-dashed border-hst-teal/20 relative group">
                        {pageData?.local_qr_code_url ? (
                          <img 
                            src={`${BASE_URL}/${pageData.local_qr_code_url}`} 
                            alt="Local QR Code" 
                            className="w-[220px] h-[220px] object-contain"
                          />
                        ) : (
                          <QrCode size={220} className="text-hst-teal" />
                        )}
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[40px]">
                          <p className="font-bold text-hst-dark text-center px-4">
                            Scan to pay via UPI
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full p-8 bg-hst-dark rounded-[40px] text-white space-y-4 text-center shadow-2xl shadow-hst-dark/30">
                        <div className="w-16 h-16 bg-hst-teal/20 rounded-2xl flex items-center justify-center mx-auto text-hst-teal">
                          <Globe size={32} />
                        </div>
                        <h4 className="text-xl font-black">Foreign Bank Transfer Required</h4>
                        <p className="text-sm font-medium opacity-70 leading-relaxed">
                          As per FCRA regulations, all international donations must be made directly via bank account transfer (SWIFT/Wire). QR codes and UPI are strictly for domestic donations only.
                        </p>
                        <div className="pt-2">
                          <span className="bg-hst-teal text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                            Use Details Below for SWIFT Transfer
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="w-full text-left space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h4 className="font-black text-hst-dark text-lg uppercase tracking-wider">Bank Transfer Details</h4>
                        <span className="bg-hst-teal/10 text-hst-teal text-[10px] font-black px-3 py-1 rounded-full uppercase">
                          {donationType === 'local' ? 'Local Account' : 'FCRA Account'}
                        </span>
                      </div>
                      
                      <div className="grid gap-4">
                        {[
                          { label: 'Account Name', key: 'accountName' },
                          { label: 'Account Number', key: 'accountNumber' },
                          { label: 'Bank Name', key: 'bankName' },
                          { label: 'Bank Branch', key: 'branch' },
                          { label: 'Bank Address', key: 'address' },
                          { label: 'IFSC Code', key: 'ifscCode' },
                          { label: 'Swift Code', key: 'swiftCode' },
                        ].map((field, i) => {
                          const details = donationType === 'local' ? localBankDetails : fcraBankDetails;
                          const value = details[field.key];
                          
                          return (
                            <div key={i} className="bg-hst-light/20 p-4 rounded-2xl flex justify-between items-center group border border-transparent hover:border-hst-teal/10 hover:bg-white transition-all">
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{field.label}</span>
                                <span className="font-mono font-bold text-hst-dark">{value}</span>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(value)} 
                                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-hst-teal shadow-sm opacity-0 group-hover:opacity-100 hover:bg-hst-teal hover:text-white transition-all"
                              >
                                <Copy size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 pt-6">
                    <button
                      onClick={prevStep}
                      className="flex-1 py-5 rounded-3xl border-2 border-gray-100 font-black text-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button
                      onClick={handleCompleteTransfer}
                      className="flex-[2] hst-gradient text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      I've Completed the Transfer
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer data={footerData} />
      <ScrollNavigator />

      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-hst-dark/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden relative p-10 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-hst-green/10 text-hst-green rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={48} className="fill-hst-green/20" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black text-hst-dark">Information Received!</h2>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Thank you for supporting Help To Self Help Trust. <br />
                  Your donation information has been received and is currently under review. Our team will verify the details and get back to you with the receipt and 80G certificate, if applicable.
                </p>
              </div>

              <button 
                onClick={() => {
                  setShowSuccess(false);
                  navigate('/');
                }}
                className="w-full hst-gradient text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Return Home
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          © 2026 Help To Self Help Trust. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Donate;