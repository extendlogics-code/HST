import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, Globe, Calendar, User, Search, Filter, 
  Loader2, CheckCircle2, Clock, Mail, Phone, Hash, 
  ChevronRight, Download, FileText, Landmark, ShieldCheck, Plus, X
} from 'lucide-react';
import api from './api/api';
import DonorSelect from './components/DonorSelect';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, local, fcra
  const [filterStatus, setFilterStatus] = useState('all'); // all, PENDING, COMPLETED, CANCELLED
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: ''
  });

  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [manualData, setManualData] = useState({
    amount: '',
    donation_date: new Date().toISOString().split('T')[0],
    payment_mode: 'UPI',
    transaction_ref: '',
    bank_name: '',
    purpose: 'General Donation',
    remarks: '',
    type: 'local',
    status: 'COMPLETED'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get('/donations');
      if (response.data.success) {
        setDonations(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDonor) return alert('Please select a donor');
    
    setSubmitting(true);
    try {
      const response = await api.post('/donations', {
        ...manualData,
        donor_id: selectedDonor.id,
        is_direct_certificate: false // Manual entry to donations page
      });

      if (response.data.success) {
        setShowManualModal(false);
        setSelectedDonor(null);
        setManualData({
          amount: '',
          donation_date: new Date().toISOString().split('T')[0],
          payment_mode: 'UPI',
          transaction_ref: '',
          bank_name: '',
          purpose: 'General Donation',
          remarks: '',
          type: 'local',
          status: 'COMPLETED'
        });
        fetchDonations();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add donation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await api.patch(`/donations/${id}/status`, { status: newStatus });
      if (response.data.success) {
        fetchDonations();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update donation status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredDonations = donations.filter(item => {
    // Hide direct certificate donations as per user request
    if (item.is_direct_certificate) return false;

    // Search filter
    const searchMatch = 
      (item.donor_name && item.donor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.transaction_ref && item.transaction_ref.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Type filter
    const actualTypeMatch = filterType === 'all' || item.type === filterType;

    // Status filter
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;

    // Date filter
    const itemDate = item.created_at ? new Date(item.created_at) : null;
    const startMatch = !dateFilter.start || (itemDate && itemDate >= new Date(dateFilter.start));
    const endMatch = !dateFilter.end || (itemDate && itemDate <= new Date(dateFilter.end + 'T23:59:59'));

    return searchMatch && actualTypeMatch && statusMatch && startMatch && endMatch;
  });

  const stats = {
    total: filteredDonations
      .filter(d => d.status === 'COMPLETED')
      .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0),
    count: filteredDonations.length,
    local: filteredDonations.filter(d => d.type === 'local').length,
    fcra: filteredDonations.filter(d => d.type === 'fcra').length
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-hst-dark mb-2">Donation <span className="text-hst-teal">Submissions</span></h1>
          <p className="text-gray-500 font-medium">Review and verify successful payment notifications</p>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-2 bg-hst-teal text-white px-6 py-4 rounded-2xl font-black text-sm shadow-xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={18} />
            Add Manual Entry
          </button>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filtered Total</span>
              <span className="text-2xl font-black text-hst-teal">₹ {stats.total.toLocaleString()}</span>
            </div>
            <div className="w-px h-10 bg-gray-100 mx-2"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entries</span>
              <span className="text-2xl font-black text-hst-dark">{stats.count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hst-teal transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search donor name, email or ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-bold text-hst-dark shadow-sm"
            />
          </div>

          {/* Date & Type Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-hst-light/30 p-2 rounded-2xl border border-transparent">
              <div className="flex gap-1">
                {['all', 'PENDING', 'COMPLETED', 'CANCELLED'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      filterStatus === s 
                        ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/20' 
                        : 'text-gray-400 hover:text-hst-dark'
                    }`}
                  >
                    {s === 'all' ? 'All Status' : s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-hst-light/30 p-2 rounded-2xl border border-transparent">
              <div className="flex gap-1">
                {['all', 'local', 'fcra'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      filterType === t 
                        ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/20' 
                        : 'text-gray-400 hover:text-hst-dark'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-hst-light/30 px-4 py-2 rounded-2xl border border-transparent">
              <Calendar size={16} className="text-gray-400" />
              <input 
                type="date" 
                value={dateFilter.start}
                onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                className="bg-transparent outline-none text-xs font-bold text-hst-dark"
              />
              <span className="text-gray-300 mx-1">to</span>
              <input 
                type="date" 
                value={dateFilter.end}
                onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                className="bg-transparent outline-none text-xs font-bold text-hst-dark"
              />
              {(dateFilter.start || dateFilter.end) && (
                <button 
                  onClick={() => setDateFilter({start: '', end: ''})}
                  className="ml-2 text-red-400 hover:text-red-500 transition-colors"
                >
                  <Clock size={14} className="rotate-45" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[40px] p-32 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-hst-teal mb-4" size={48} />
          <p className="text-gray-400 font-bold animate-pulse">Fetching donations...</p>
        </div>
      ) : filteredDonations.length > 0 ? (
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredDonations.map((item, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                key={item.id}
                className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-hst-dark/5 transition-all group overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Donor Summary */}
                  <div className="lg:w-80 bg-gray-50/50 p-8 border-r border-gray-50 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-hst-teal">
                          <Calendar size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{formatDate(item.created_at)}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.type === 'fcra' ? 'bg-blue-50 text-blue-500' : 'bg-hst-green/10 text-hst-green'
                        }`}>
                          {item.type === 'fcra' ? 'FCRA / Foreign' : 'Local / 80G'}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-hst-dark shrink-0">
                            <User size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Donor</p>
                            <p className="font-black text-hst-dark truncate">{item.donor_name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-hst-teal shrink-0">
                            <Mail size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contact</p>
                            <span className="font-bold text-xs text-gray-600 truncate block">{item.email || 'No Email'}</span>
                            <span className="font-bold text-[10px] text-gray-400 block mt-0.5">{item.phone || 'No Phone'}</span>
                          </div>
                        </div>

                        {item.pan && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500 shrink-0">
                              <ShieldCheck size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">PAN Number</p>
                              <span className="font-black text-xs text-hst-dark uppercase tracking-widest">{item.pan}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100">
                      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-hst-teal text-white font-black text-xs shadow-lg shadow-hst-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <FileText size={14} />
                        Issue Receipt
                      </button>
                    </div>
                  </div>

                  {/* Right: Payment Details */}
                  <div className="flex-1 p-8 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Donation Amount</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-hst-dark">
                            {item.type === 'fcra' ? '$' : '₹'} {parseFloat(item.amount).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-hst-light/20 p-4 rounded-2xl border border-hst-light/50">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Landmark size={10} /> Mode
                          </p>
                          <p className="font-black text-hst-dark text-sm uppercase">{item.payment_mode || 'BANK TRANSFER'}</p>
                        </div>
                        <div className="bg-hst-light/20 p-4 rounded-2xl border border-hst-light/50">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Hash size={10} /> Reference
                          </p>
                          <p className="font-black text-hst-teal text-sm truncate">{item.transaction_ref || 'PENDING'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status & Compliance</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                              className={`px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-wider outline-none transition-all cursor-pointer ${
                                item.status === 'COMPLETED' 
                                  ? 'bg-hst-green/10 text-hst-green border-hst-green/20' 
                                  : item.status === 'CANCELLED'
                                  ? 'bg-red-50 text-red-500 border-red-100'
                                  : 'bg-amber-50 text-amber-500 border-amber-100'
                              }`}
                            >
                              <option value="PENDING">Pending Verification</option>
                              <option value="COMPLETED">Confirmed / Received</option>
                              <option value="CANCELLED">Cancelled / Failed</option>
                            </select>
                            {item.status === 'COMPLETED' ? (
                              <CheckCircle2 size={14} className="text-hst-green" />
                            ) : item.status === 'CANCELLED' ? (
                              <X size={14} className="text-red-500" />
                            ) : (
                              <Clock size={14} className="text-amber-500" />
                            )}
                          </div>
                          
                          {item.remarks && (
                            <div className="flex items-start gap-2 text-hst-teal bg-hst-teal/5 px-3 py-2 rounded-lg border border-hst-teal/10">
                              <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                              <span className="text-[10px] font-bold leading-tight uppercase tracking-wider">{item.remarks}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Internal Note</p>
                         <p className="text-xs font-medium text-gray-500 italic">"User has notified completion of transfer. Verify bank statement before issuing 80G."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-24 text-center border border-gray-100 shadow-sm">
          <div className="bg-hst-light/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
            <IndianRupee size={48} />
          </div>
          <h3 className="text-2xl font-black text-hst-dark mb-3">No Donations Found</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Try adjusting your filters or search term to find what you're looking for.
          </p>
        </div>
      )}

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-hst-dark/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden relative"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-hst-dark">Add Manual Donation</h2>
                  <p className="text-sm text-gray-500 font-medium">Record a donation received offline</p>
                </div>
                <button 
                  onClick={() => setShowManualModal(false)}
                  className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Donor Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Select Donor</label>
                  <DonorSelect 
                    selectedDonor={selectedDonor}
                    onSelect={setSelectedDonor}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Amount (INR)</label>
                    <input 
                      required
                      type="number"
                      value={manualData.amount}
                      onChange={(e) => setManualData({...manualData, amount: e.target.value})}
                      className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-hst-teal"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Donation Date</label>
                    <input 
                      required
                      type="date"
                      value={manualData.donation_date}
                      onChange={(e) => setManualData({...manualData, donation_date: e.target.value})}
                      className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-hst-dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Payment Mode</label>
                    <select 
                      value={manualData.payment_mode}
                      onChange={(e) => setManualData({...manualData, payment_mode: e.target.value})}
                      className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-hst-dark"
                    >
                      <option value="UPI">UPI / QR Code</option>
                      <option value="BANK TRANSFER">Bank Transfer (NEFT/IMPS)</option>
                      <option value="CASH">Cash</option>
                      <option value="CHEQUE">Cheque</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Transaction Ref / Cheque No</label>
                    <input 
                      type="text"
                      value={manualData.transaction_ref}
                      onChange={(e) => setManualData({...manualData, transaction_ref: e.target.value})}
                      className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-hst-dark"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Purpose / Remarks</label>
                  <textarea 
                    value={manualData.remarks}
                    onChange={(e) => setManualData({...manualData, remarks: e.target.value})}
                    className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium min-h-[100px]"
                    placeholder="e.g. General Donation, Education Fund..."
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="flex-1 py-5 rounded-3xl border-2 border-gray-100 font-black text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting || !selectedDonor}
                    className="flex-[2] hst-gradient text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                    Save Donation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDonations;
