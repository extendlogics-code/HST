import React, { useState } from 'react';
import { X, Heart, Landmark, Globe, CheckCircle, Copy, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';

const DonateModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [donationId, setDonationId] = useState(null);
  const [donationType, setDonationType] = useState(null);
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
        // Save donation details to backend
        const response = await api.post('/donations', {
          ...formData,
          type: donationType
        });
        if (response.data.success) {
          setDonationId(response.data.data.id);
        }
        setStep(2);
      } catch (error) {
        console.error('Error saving donation:', error);
        // Even if backend fails, let them see payment details for now
        setStep(2);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  const handleCompleteTransfer = async () => {
    // We no longer update status to COMPLETED automatically.
    // Online donations stay PENDING until manually verified by admin.
    setShowSuccess(true);
  };

  const localBankDetails = {
    accountName: "HELP TO SELF HELP TRUST",
    accountNumber: "333202010026005",
    ifscCode: "UBIN0533327",
    bankName: "Union Bank of India",
    branch: "Chetpet Branch, Thiruvannamalai",
    swift: "UBININBBOMD"
  };

  const fcraBankDetails = {
    accountName: "HELP TO SELF HELP TRUST (FCRA)",
    accountNumber: "333202010026005",
    ifscCode: "UBIN0533327",
    bankName: "Union Bank of India",
    branch: "Chetpet Branch, Thiruvannamalai",
    swift: "UBININBBOMD"
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
      >
        {/* Header */}
        <div className="hst-gradient p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Heart className="fill-white" size={24} />
            <h2 className="text-2xl font-bold">Support Our Cause</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {showSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="w-20 h-20 bg-hst-green/10 text-hst-green rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="fill-hst-green/20" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-hst-dark">Information Received!</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Thank you for supporting Help To Self Help Trust. <br />
                  Your donation information has been received and is currently under review. Our team will verify the details and get back to you with the receipt and 80G certificate, if applicable.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full hst-gradient text-white py-4 rounded-xl font-bold shadow-lg shadow-hst-teal/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <>
              {/* Step 1: Donation Type & Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setDonationType('local')}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        donationType === 'local' 
                        ? 'border-hst-teal bg-hst-light text-hst-teal' 
                        : 'border-gray-100 hover:border-hst-teal/30'
                      }`}
                    >
                      <Landmark size={32} />
                      <span className="font-semibold">Local Donation</span>
                      <span className="text-xs text-center opacity-70">(India Only)</span>
                    </button>
                    <button
                      onClick={() => setDonationType('fcra')}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        donationType === 'fcra' 
                        ? 'border-hst-teal bg-hst-light text-hst-teal' 
                        : 'border-gray-100 hover:border-hst-teal/30'
                      }`}
                    >
                      <Globe size={32} />
                      <span className="font-semibold">Foreign Donation</span>
                      <span className="text-xs text-center opacity-70">(FCRA Account)</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hst-teal/50"
                      onChange={handleInputChange}
                      value={formData.name}
                      required
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hst-teal/50"
                        onChange={handleInputChange}
                        value={formData.email}
                        required
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number *"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hst-teal/50"
                        onChange={handleInputChange}
                        value={formData.phone}
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        name="amount"
                        placeholder="Donation Amount (₹ / $) *"
                        min="100"
                        className={`w-full px-4 py-3 rounded-xl border transition-all font-bold text-lg focus:outline-none focus:ring-2 ${
                          formData.amount && Number(formData.amount) < 100 
                            ? 'border-red-200 focus:ring-red-200' 
                            : 'border-gray-200 focus:ring-hst-teal/50'
                        }`}
                        onChange={handleInputChange}
                        value={formData.amount}
                        required
                      />
                      {formData.amount && Number(formData.amount) < 100 && (
                        <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                          Minimum donation is {donationType === 'fcra' ? '$' : '₹'}100.
                        </p>
                      )}
                    </div>

                    {donationType === 'local' && (
                      <div className="space-y-3 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="requires80G"
                            checked={formData.requires80G}
                            onChange={handleInputChange}
                            className="w-5 h-5 border-2 border-gray-200 rounded text-hst-teal focus:ring-hst-teal"
                          />
                          <span className="text-sm font-bold text-hst-dark group-hover:text-hst-teal transition-colors">I require an 80G tax certificate</span>
                        </label>

                        {formData.requires80G && (
                          <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                            <input
                              type="text"
                              name="pan"
                              placeholder="PAN Card Number *"
                              className={`w-full px-4 py-3 rounded-xl border transition-all font-bold uppercase tracking-widest focus:outline-none focus:ring-2 ${
                                isPanRequired && (!formData.pan || formData.pan.length !== 10)
                                  ? 'border-red-200 focus:ring-red-200' 
                                  : 'border-gray-200 focus:ring-hst-teal/50'
                              }`}
                              onChange={(e) => {
                                e.target.value = e.target.value.toUpperCase();
                                handleInputChange(e);
                              }}
                              value={formData.pan}
                              maxLength={10}
                            />
                            <p className="text-[10px] font-bold text-red-500 ml-1">
                              Required for 80G tax certificate
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    disabled={!isFormValid || loading}
                    onClick={nextStep}
                    className="w-full hst-gradient text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-hst-teal/30 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                </div>
              )}

              {/* Step 2: Payment Details */}
              {step === 2 && (
                <div className="space-y-6 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-hst-teal/30">
                      <QrCode size={180} className="text-hst-teal" />
                      <p className="mt-2 text-sm font-medium text-gray-500 italic">Scan to Pay via UPI</p>
                    </div>
                    
                    <div className="w-full text-left space-y-4">
                      <h3 className="font-bold text-hst-dark border-b pb-2">Account Details ({donationType === 'local' ? 'Local' : 'FCRA'})</h3>
                      <div className="grid gap-3 text-sm">
                        {[
                          { label: 'A/C Name', value: donationType === 'local' ? localBankDetails.accountName : fcraBankDetails.accountName },
                          { label: 'A/C Number', value: donationType === 'local' ? localBankDetails.accountNumber : fcraBankDetails.accountNumber },
                          { label: 'IFSC Code', value: donationType === 'local' ? localBankDetails.ifscCode : fcraBankDetails.ifscCode },
                          { label: 'Bank', value: donationType === 'local' ? localBankDetails.bankName : fcraBankDetails.bankName },
                          ...(donationType === 'fcra' ? [{ label: 'SWIFT Code', value: fcraBankDetails.swift }] : []),
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center group">
                            <span className="text-gray-500">{item.label}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-hst-dark">{item.value}</span>
                              <button onClick={() => copyToClipboard(item.value)} className="text-hst-teal opacity-0 group-hover:opacity-100 transition-opacity">
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={prevStep}
                      className="flex-1 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCompleteTransfer}
                      className="flex-[2] hst-gradient text-white py-3 rounded-xl font-bold shadow-lg shadow-hst-teal/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      I've Made the Payment
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DonateModal;
