import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Download, FileText, Calendar, User, IndianRupee, 
  Loader2, ExternalLink, Filter, X, Trash2, Eye, AlertCircle,
  AlertTriangle, ShieldAlert
} from 'lucide-react';
import api from './api/api';
import { useAuth } from './context/AuthContext';

const CertificateHistory = () => {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewCertNo, setPreviewCertNo] = useState('');
  const [voidReason, setVoidReason] = useState('');
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: ''
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/certificates');
      if (data.success) {
        setCertificates(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleVoid = async () => {
    if (!voidReason) return alert('Please provide a reason for voiding');
    try {
      const { data } = await api.patch(`/certificates/${showVoidModal}/void`, { void_reason: voidReason });
      if (data.success) {
        setShowVoidModal(null);
        setVoidReason('');
        fetchCertificates();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to void certificate');
    }
  };

  const downloadPDF = async (certId, certNo) => {
    try {
      const response = await api.get(`/certificates/${certId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `HST-80G-${certNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  const viewPDF = async (certId, certNo) => {
    try {
      const response = await api.get(`/certificates/${certId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPreviewUrl(url);
      setPreviewCertNo(certNo);
      setShowPreviewModal(true);
    } catch (err) {
      alert('Failed to load PDF preview');
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setShowPreviewModal(false);
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificate_no.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = 
      (!filters.startDate || new Date(cert.issue_date) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(cert.issue_date) <= new Date(filters.endDate));
    
    const matchesStatus = !filters.status || cert.status === filters.status;

    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-hst-dark">Certificate History</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and track issued 80G certificates</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search donor or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-hst-teal/30 transition-all font-medium text-sm w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border-2 transition-all ${showFilters ? 'bg-hst-teal text-white border-hst-teal shadow-lg shadow-hst-teal/20' : 'bg-white text-gray-400 border-gray-100 hover:border-hst-teal/30'}`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-hst-dark/5 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">From Date</label>
                <input 
                  type="date" 
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  className="w-full p-3 bg-hst-light/30 border-2 border-gray-50 rounded-xl outline-none focus:bg-white focus:border-hst-teal/30 transition-all text-sm font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">To Date</label>
                <input 
                  type="date" 
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="w-full p-3 bg-hst-light/30 border-2 border-gray-50 rounded-xl outline-none focus:bg-white focus:border-hst-teal/30 transition-all text-sm font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                <select 
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full p-3 bg-hst-light/30 border-2 border-gray-50 rounded-xl outline-none focus:bg-white focus:border-hst-teal/30 transition-all text-sm font-medium"
                >
                  <option value="">All Status</option>
                  <option value="ISSUED">Issued</option>
                  <option value="VOIDED">Voided</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => {setFilters({startDate:'', endDate:'', status:''}); setSearchTerm('');}}
                  className="w-full p-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-hst-dark/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-hst-light/30">
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Certificate No</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Donor Name</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Issue Date</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <Loader2 className="animate-spin text-hst-teal mx-auto mb-4" size={32} />
                    <p className="text-gray-400 font-bold">Loading certificates...</p>
                  </td>
                </tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText size={32} />
                    </div>
                    <p className="text-gray-400 font-bold">No certificates found</p>
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => (
                  <tr key={cert.id} className={`group transition-colors ${cert.status === 'VOIDED' ? 'bg-red-50/30' : 'hover:bg-hst-light/20'}`}>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cert.status === 'VOIDED' ? 'bg-red-100 text-red-500' : 'bg-hst-teal/10 text-hst-teal'}`}>
                          <FileText size={18} />
                        </div>
                        <span className="font-black text-hst-dark">{cert.certificate_no}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-gray-700">{cert.donor_name}</span>
                    </td>
                    <td className="p-6">
                      <span className="font-black text-hst-teal">₹{parseFloat(cert.amount).toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Calendar size={14} />
                        {new Date(cert.issue_date).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        cert.status === 'ISSUED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => viewPDF(cert.id, cert.certificate_no)}
                          className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          title="View PDF"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => downloadPDF(cert.id, cert.certificate_no)}
                          className="p-2.5 text-hst-teal hover:bg-hst-teal/10 rounded-xl transition-all"
                          title="Download PDF"
                        >
                          <Download size={18} />
                        </button>
                        {user?.role === 'ADMIN' && cert.status === 'ISSUED' && (
                          <button 
                            onClick={() => setShowVoidModal(cert.id)}
                            className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                            title="Void Certificate"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Void Modal */}
      <AnimatePresence>
        {showVoidModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVoidModal(null)}
              className="absolute inset-0 bg-hst-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={40} />
              </div>
              <h2 className="text-2xl font-black text-hst-dark mb-2">Void Certificate?</h2>
              <p className="text-gray-500 font-medium mb-8">This action cannot be undone. The certificate number will be retained as VOIDED.</p>
              
              <div className="text-left mb-8">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Reason for voiding</label>
                <textarea 
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="e.g. Incorrect donor details, duplicate entry..."
                  className="w-full mt-2 p-4 bg-hst-light/30 border-2 border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-red-200 transition-all text-sm font-medium min-h-[100px]"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowVoidModal(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleVoid}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-xl shadow-red-200 hover:bg-red-600 transition-colors"
                >
                  Yes, Void it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePreview}
              className="absolute inset-0 bg-hst-dark/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-7xl h-[90vh] bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-hst-teal/10 text-hst-teal rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-hst-dark">Certificate Preview</h3>
                    <p className="text-sm text-gray-500 font-medium">No: {previewCertNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = previewUrl;
                      link.setAttribute('download', `HST-80G-${previewCertNo}.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-hst-teal text-white rounded-xl font-bold hover:bg-hst-teal-dark transition-all text-sm shadow-lg shadow-hst-teal/20"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button 
                    onClick={closePreview}
                    className="p-3 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* PDF Content */}
              <div className="flex-1 bg-gray-100 p-4 md:p-8 overflow-hidden">
                <iframe 
                  src={`${previewUrl}#toolbar=0`}
                  className="w-full h-full rounded-2xl border-none shadow-inner bg-white"
                  title="PDF Preview"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificateHistory;
