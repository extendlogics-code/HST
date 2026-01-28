import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2, ChevronDown, UserPlus, Loader2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollNavigator from './components/ScrollNavigator';
import api from './api/api';

const ContactUs = () => {
  const [subject, setSubject] = useState('General Enquiry');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [headerRes, footerRes] = await Promise.all([
          api.get('/website/header'),
          api.get('/website/footer')
        ]);
        if (headerRes.data.success) setHeaderData(headerRes.data.data);
        if (footerRes.data.success) setFooterData(footerRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const subjects = [
    "General Enquiry",
    "Donation",
    "CSR Partnership",
    "Volunteering",
    "Project Enquiry"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please consent to be contacted by the Trust");
      return;
    }

    setLoading(true);
    try {
      await api.post('/enquiries', {
        ...formData,
        subject
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        consent: false
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Something went wrong';
      alert(`Failed to submit enquiry: ${errorMessage}. Please ensure the backend and database are running.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Help To Self Help Trust HST
N:HST;Help To Self Help Trust;;;
ORG:Help To Self Help Trust
TEL;TYPE=WORK,VOICE:+919865086296
EMAIL;TYPE=PREF,INTERNET:hstindia@yahoo.com
EMAIL;TYPE=INTERNET:contact@helptoselfhelptrust.org
ADR;TYPE=WORK:;;Chetpet;Thiruvannamalai;Tamil Nadu;606801;India
URL:https://helptoselfhelptrust.org
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'HST_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-hst-light/30 font-sans text-hst-dark overflow-x-hidden">
      <Header data={headerData} />
      
      <main className="max-w-6xl mx-auto pt-40 pb-20 px-6 lg:pt-48">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black text-hst-dark mb-6"
          >
            Get In <span className="text-hst-teal">Touch</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-xl lg:text-2xl font-bold text-gray-600 leading-relaxed mb-2">
              Have a question or want to work with us?
            </p>
            <p className="text-lg text-gray-500 font-medium">
              We’d love to hear from you. Please reach out to Help To Self Help Trust using the details below.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[40px] shadow-2xl shadow-hst-dark/5 p-10 border border-gray-100 flex flex-col h-full"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black mb-2">Contact Information</h2>
              <p className="text-gray-500 font-medium">Reach out to us through any of these channels</p>
            </div>
            
            <div className="space-y-8 flex-grow">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-hst-light flex items-center justify-center text-hst-green shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Office Address</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Chetpet, Thiruvannamalai - 606801,<br />
                    Tamil Nadu, India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-hst-light flex items-center justify-center text-hst-teal shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email Us</h3>
                  <div className="flex flex-col">
                    <a href="mailto:contact@helptoselfhelptrust.org,hstindia@yahoo.com" className="text-gray-600 hover:text-hst-teal transition-colors">
                      contact@helptoselfhelptrust.org
                    </a>
                    <a href="mailto:contact@helptoselfhelptrust.org,hstindia@yahoo.com" className="text-gray-600 hover:text-hst-teal transition-colors">
                      hstindia@yahoo.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-hst-light flex items-center justify-center text-hst-green shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-gray-600">+91 98650 86296, +91 87540 60638</p>
                </div>
              </div>
            </div>

            {/* Social/Quick Connect */}
            <div className="mt-12 pt-10 border-t border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="https://wa.me/919865086296" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-4 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-500/10"
                >
                  <MessageCircle size={20} />
                  <span className="whitespace-nowrap">WhatsApp Us</span>
                </a>
                <a 
                  href="mailto:contact@helptoselfhelptrust.org,hstindia@yahoo.com"
                  className="flex items-center justify-center gap-3 bg-hst-dark text-white px-4 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-hst-dark/10"
                >
                  <Mail size={20} />
                  <span className="whitespace-nowrap">Send Email</span>
                </a>
              </div>
              
              <button 
                onClick={handleDownloadVCard}
                className="w-full hst-gradient text-white px-6 py-4 rounded-2xl font-black text-lg shadow-xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <UserPlus size={22} className="group-hover:scale-110 transition-transform" />
                Save Contact to Phone
              </button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[40px] shadow-2xl shadow-hst-dark/5 p-10 border border-gray-100 flex flex-col h-full"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black mb-2">Have an <span className="text-hst-teal">Enquiry?</span></h2>
              <p className="text-gray-500 font-medium">Share your details and we’ll reach out to you</p>
            </div>

            {submitted ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-hst-green/10 text-hst-green rounded-full flex items-center justify-center">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-hst-dark mb-2">Message Sent!</h3>
                  <p className="text-gray-500 font-medium max-w-xs mx-auto">
                    Thank you for contacting Help To Self Help Trust. We’ll get in touch with you soon.
                  </p>
                </div>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-hst-teal font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
                <div className="space-y-6 flex-grow">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 ml-1">Full Name *</label>
                      <input 
                        required
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full bg-hst-light/30 border-2 border-gray-200 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 ml-1">Email Address *</label>
                      <input 
                        required
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full bg-hst-light/30 border-2 border-gray-200 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 ml-1">Mobile Number *</label>
                      <input 
                        required
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 00000 00000"
                        className="w-full bg-hst-light/30 border-2 border-gray-200 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 ml-1">Subject</label>
                      <div 
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <div 
                          className={`w-full bg-hst-light/30 border-2 transition-all duration-300 rounded-2xl px-6 py-4 font-medium cursor-pointer flex justify-between items-center ${
                            isDropdownOpen ? 'border-hst-teal/30 bg-white shadow-lg' : 'border-gray-200'
                          }`}
                        >
                          <span>{subject}</span>
                          <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-hst-teal' : 'text-gray-400'}`} />
                        </div>

                        {/* Custom Dropdown List */}
                        <div 
                          className={`absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl border border-gray-50 p-3 z-50 transition-all duration-300 origin-top ${
                            isDropdownOpen 
                              ? 'opacity-100 scale-100 visible' 
                              : 'opacity-0 scale-95 invisible'
                          }`}
                          style={{ borderRadius: '24px' }}
                        >
                          <div className="space-y-1">
                            {subjects.map((opt) => (
                              <div
                                key={opt}
                                onClick={() => {
                                  setSubject(opt);
                                  setIsDropdownOpen(false);
                                }}
                                className={`px-5 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm ${
                                  subject === opt 
                                    ? 'bg-hst-teal text-white' 
                                    : 'hover:bg-hst-light/40 text-gray-600 hover:text-hst-dark'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Message *</label>
                    <textarea 
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4" 
                      placeholder="Tell us more about your inquiry..."
                      className="w-full bg-hst-light/30 border-2 border-gray-200 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium resize-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <label className="relative flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        className="sr-only peer" 
                      />
                      <div className="w-6 h-6 bg-hst-light/50 border-2 border-gray-200 rounded-lg peer-checked:bg-hst-green peer-checked:border-hst-green transition-all group-hover:border-hst-green/30"></div>
                      <CheckCircle2 className="absolute w-4 h-4 text-white scale-0 peer-checked:scale-100 left-1 transition-transform" />
                    </label>
                    <span className="text-sm font-bold text-gray-500">I consent to be contacted by the Trust</span>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-gray-100">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full hst-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit Enquiry
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </main>
      <Footer data={footerData} />
      <ScrollNavigator />
    </div>
  );
};

export default ContactUs;
