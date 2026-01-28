import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Search, Loader2, 
  ShieldCheck, Download, History, Edit, X, Save,
  ArrowUpDown, Filter, ChevronLeft, ChevronRight,
  MapPin, Globe, Info, IndianRupee
} from 'lucide-react';
import api from './api/api';

const AdminIndividualDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewingDonor, setViewingDonor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditingInView, setIsEditingInView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await api.get('/donors');
      if (response.data.success) {
        // Filter for INDIVIDUAL type only
        const individualDonors = response.data.data.filter(d => d.donor_type === 'INDIVIDUAL');
        setDonors(individualDonors);
        
        // Update viewing donor if it's currently open to reflect changes
        if (viewingDonor) {
          const updatedViewingDonor = individualDonors.find(d => d.id === viewingDonor.id);
          if (updatedViewingDonor) {
            setViewingDonor(updatedViewingDonor);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch donors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.patch(`/donors/${viewingDonor.id}`, viewingDonor);
      if (data.success) {
        setIsEditingInView(false);
        fetchDonors();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update donor');
    } finally {
      setSubmitting(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDonors = React.useMemo(() => {
    let sortableDonors = [...donors];
    if (sortConfig.key !== null) {
      sortableDonors.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDonors;
  }, [donors, sortConfig]);

  const filteredDonors = sortedDonors.filter(item => {
    const searchMatch = 
      (item.donor_name && item.donor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.phone && item.phone.includes(searchTerm)) ||
      (item.pan && item.pan.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    
    return searchMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 font-sans p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-hst-dark mb-2">Individual <span className="text-hst-teal">Donors</span></h1>
          <p className="text-gray-500 font-medium">Directory of individual supporters and their contributions</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Individuals</span>
            <span className="text-2xl font-black text-hst-dark">{donors.length}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hst-teal transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email, phone or PAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-bold text-hst-dark"
            />
          </div>
        </div>

        <div className="bg-white p-2 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-2">
          {['all', 'local', 'foreign'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-8 py-4 rounded-2xl font-black transition-all capitalize ${
                filterCategory === cat 
                  ? 'bg-hst-dark text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-hst-light hover:text-hst-dark'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blocks Section */}
      {loading ? (
        <div className="bg-white rounded-[40px] p-32 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-hst-teal mb-4" size={48} />
          <p className="text-gray-400 font-bold animate-pulse">Loading individual donors...</p>
        </div>
      ) : filteredDonors.length > 0 ? (
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {filteredDonors.map((donor, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                key={donor.id}
                className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-hst-dark/5 transition-all group overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-8">
                    {/* Left Section: Status & Actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-center gap-4 md:gap-6 min-w-full lg:min-w-[180px] lg:w-auto border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-8 mb-2 lg:mb-0">
                      <div className="flex gap-2 md:gap-3">
                         <button 
                           onClick={() => setViewingDonor(donor)}
                           title="View & Edit Details"
                           className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-hst-dark text-white hover:bg-hst-teal transition-all shadow-lg flex items-center gap-2 font-bold text-xs md:text-sm"
                         >
                           <Info size={16} />
                           View
                         </button>
                      </div>
                      <div className="text-left lg:text-left">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Joined</p>
                        <p className="text-xs md:text-sm font-bold text-hst-dark">
                          {new Date(donor.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Middle Section: User Identity */}
                    <div className="flex items-center gap-4 md:gap-6 min-w-0 lg:min-w-[280px] w-full lg:w-auto">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-hst-teal/10 flex items-center justify-center text-hst-teal shrink-0">
                        <User size={32} className="md:w-10 md:h-10" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl md:text-2xl font-black text-hst-dark truncate mb-1">{donor.donor_name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                            donor.category === 'foreign' 
                              ? 'bg-hst-teal text-white' 
                              : 'bg-hst-teal/5 text-hst-teal'
                          }`}>
                            {donor.category === 'foreign' ? 'Foreign' : 'Local'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Contact & Financial Details */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 w-full">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                          <Mail size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                          <p className="text-sm md:text-base font-bold text-hst-dark truncate">{donor.email || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                          <Phone size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Phone</p>
                          <p className="text-sm md:text-base font-bold text-hst-dark">{donor.phone || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-hst-teal/5 flex items-center justify-center text-hst-teal shrink-0">
                          <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">PAN</p>
                          <p className="text-sm md:text-base font-black text-hst-teal tracking-widest uppercase truncate">{donor.pan || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-hst-light/50 flex items-center justify-center text-hst-dark shrink-0">
                          <IndianRupee size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Donated</p>
                          <p className="text-sm md:text-base font-black text-hst-dark truncate">
                            ₹{(donor.total_donated || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
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
            <User size={48} />
          </div>
          <h3 className="text-2xl font-black text-hst-dark mb-3">No Individual Donors Found</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Try adjusting your search or category filters.
          </p>
        </div>
      )}

      {/* View Details Modal */}
      <AnimatePresence>
        {viewingDonor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingDonor(null)}
              className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[24px] md:rounded-[40px] w-full max-w-3xl overflow-hidden relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-custom"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-hst-dark text-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-hst-teal text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <Info size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-black truncate">{isEditingInView ? 'Edit Profile' : 'Donor Profile'}</h2>
                    <p className="text-xs md:text-sm text-gray-400 font-medium truncate">
                      {isEditingInView ? 'Update details for' : 'Full details for'} {viewingDonor.donor_name}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setViewingDonor(null);
                    setIsEditingInView(false);
                  }}
                  className="w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-10 space-y-8 md:space-y-10">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-hst-light/30 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] md:rounded-[32px] bg-hst-teal text-white flex items-center justify-center text-3xl md:text-4xl font-black shadow-lg shadow-hst-teal/20 shrink-0">
                    {viewingDonor.donor_name.charAt(0)}
                  </div>
                  <div className="text-center md:text-left min-w-0 flex-1">
                    {isEditingInView ? (
                      <div className="space-y-2 mb-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text"
                          value={viewingDonor.donor_name}
                          onChange={(e) => setViewingDonor(prev => ({ ...prev, donor_name: e.target.value }))}
                          className="w-full bg-white border-2 border-hst-teal/20 rounded-xl px-4 py-2 outline-none font-bold text-hst-dark"
                        />
                      </div>
                    ) : (
                      <h3 className="text-2xl md:text-3xl font-black text-hst-dark mb-2 truncate">{viewingDonor.donor_name}</h3>
                    )}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                      <span className={`px-3 md:px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        viewingDonor.category === 'foreign' ? 'bg-hst-teal text-white' : 'bg-hst-teal/10 text-hst-teal'
                      }`}>
                        {viewingDonor.category === 'foreign' ? 'Foreign' : 'Local'} Donor
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-hst-light/30 rounded-2xl border border-gray-100">
                        <Mail className="text-hst-teal" size={20} />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                          {isEditingInView ? (
                            <input 
                              type="email"
                              value={viewingDonor.email || ''}
                              onChange={(e) => setViewingDonor(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full bg-white border-b-2 border-hst-teal/20 px-2 py-1 outline-none font-black text-hst-dark"
                            />
                          ) : (
                            <p className="font-black text-hst-dark">{viewingDonor.email || 'Not Provided'}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-hst-light/30 rounded-2xl border border-gray-100">
                        <Phone className="text-hst-teal" size={20} />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number</p>
                          {isEditingInView ? (
                            <input 
                              type="text"
                              value={viewingDonor.phone || ''}
                              onChange={(e) => setViewingDonor(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full bg-white border-b-2 border-hst-teal/20 px-2 py-1 outline-none font-black text-hst-dark"
                            />
                          ) : (
                            <p className="font-black text-hst-dark">{viewingDonor.phone || 'Not Provided'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identity & Type</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-hst-light/30 rounded-2xl border border-gray-100">
                        <ShieldCheck className="text-hst-teal" size={20} />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PAN Number</p>
                          {isEditingInView ? (
                            <input 
                              type="text"
                              value={viewingDonor.pan || ''}
                              onChange={(e) => setViewingDonor(prev => ({ ...prev, pan: e.target.value }))}
                              className="w-full bg-white border-b-2 border-hst-teal/20 px-2 py-1 outline-none font-black text-hst-dark uppercase tracking-widest"
                            />
                          ) : (
                            <p className="font-black text-hst-dark tracking-widest uppercase">{viewingDonor.pan || 'Not Provided'}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-hst-light/30 rounded-2xl border border-gray-100">
                        <Globe className="text-hst-teal" size={20} />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Donor Category</p>
                          {isEditingInView ? (
                            <select 
                              value={viewingDonor.category || 'local'}
                              onChange={(e) => setViewingDonor(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full bg-white border-b-2 border-hst-teal/20 px-2 py-1 outline-none font-black text-hst-dark capitalize cursor-pointer"
                            >
                              <option value="local">Local</option>
                              <option value="foreign">Foreign</option>
                            </select>
                          ) : (
                            <p className="font-black text-hst-dark capitalize">{viewingDonor.category}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Location Details</h3>
                  <div className="p-6 bg-hst-light/30 rounded-[32px] border border-gray-100 space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="text-hst-teal mt-1" size={20} />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Address</p>
                        {isEditingInView ? (
                          <textarea 
                            rows="2"
                            value={viewingDonor.address || ''}
                            onChange={(e) => setViewingDonor(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full bg-white border-2 border-hst-teal/20 rounded-xl px-4 py-2 outline-none font-bold text-hst-dark resize-none"
                          />
                        ) : (
                          <p className="font-bold text-hst-dark leading-relaxed">
                            {viewingDonor.address || 'No address provided.'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200/50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">City</p>
                        {isEditingInView ? (
                          <input 
                            type="text"
                            value={viewingDonor.city || ''}
                            onChange={(e) => setViewingDonor(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full bg-white border-b-2 border-hst-teal/20 px-2 py-1 outline-none font-black text-hst-dark"
                          />
                        ) : (
                          <p className="font-black text-hst-dark">{viewingDonor.city || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Country</p>
                        {isEditingInView ? (
                          <input 
                            type="text"
                            value={viewingDonor.country || ''}
                            onChange={(e) => setViewingDonor(prev => ({ ...prev, country: e.target.value }))}
                            className="w-full bg-white border-b-2 border-hst-teal/20 px-2 py-1 outline-none font-black text-hst-dark"
                          />
                        ) : (
                          <p className="font-black text-hst-dark">{viewingDonor.country || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {isEditingInView ? (
                    <>
                      <button 
                        disabled={submitting}
                        onClick={() => handleEditSubmit()}
                        className="flex-[2] hst-gradient text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {submitting ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={() => setIsEditingInView(false)}
                        className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-[24px] font-black text-lg hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditingInView(true)}
                        className="flex-1 hst-gradient text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                      >
                        <Edit size={20} /> Edit Profile
                      </button>
                      <button 
                        onClick={() => setViewingDonor(null)}
                        className="flex-1 bg-hst-dark text-white py-5 rounded-[24px] font-black text-lg hover:bg-hst-teal transition-all flex items-center justify-center"
                      >
                        Close Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #0d9488;
          border-radius: 10px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #0f766e;
        }
      `}</style>
    </div>
  );
};

export default AdminIndividualDonors;
