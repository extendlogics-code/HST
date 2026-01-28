import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Mail, Phone, Search, Loader2, 
  ShieldCheck, Download, History, Edit, X, Save,
  ArrowUpDown, Filter, ChevronLeft, ChevronRight,
  MapPin, Globe, Info, IndianRupee, Hash, FileText,
  UserCheck, Briefcase, FileCheck, Calendar, Activity,
  BookOpen, LayoutList, CreditCard, CalendarDays, Building,
  Flag, Globe2, Clock, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from './api/api';

const InputField = ({ label, icon, value, isEditing, onChange, isTextArea, type = "text", placeholder, required }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
      {icon}
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isEditing ? (
      isTextArea ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold min-h-[100px] resize-none"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
        />
      )
    ) : (
      <div className="bg-hst-light/10 border-2 border-transparent px-6 py-4 rounded-2xl font-bold text-hst-dark min-h-[58px] flex items-center">
        {value || <span className="text-gray-300 font-medium italic">Not Provided</span>}
      </div>
    )}
  </div>
);

const AdminInternationalNGOs = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingDonor, setViewingDonor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditingInView, setIsEditingInView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const initialDonorState = {
    donor_name: '',
    donor_type: 'INTERNATIONAL',
    category: 'foreign',
    country: '',
    ngo_type: '', // Foundation / INGO / Development Agency / University
    tax_id: '', // EIN / Charity No / VAT
    email: '',
    phone: '',
    address: '',
    contact_person_name: '',
    contact_person_designation: '',
    funding_category: '', // Healthcare, Education, etc.
    funding_cycle_type: 'One-time', // One-time, Annual, Multi-Year, Phase-based
    cycle_duration: '',
    grant_start_date: '',
    grant_end_date: '',
    funding_status: 'Planned' // Planned, Active, On Hold, Completed, Closed
  };

  const [newDonorData, setNewDonorData] = useState(initialDonorState);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await api.get('/donors');
      if (response.data.success) {
        const ngoDonors = response.data.data.filter(d => d.donor_type === 'INTERNATIONAL');
        setDonors(ngoDonors);
        
        if (viewingDonor) {
          const updatedViewingDonor = ngoDonors.find(d => d.id === viewingDonor.id);
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

  const handleAddSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newDonorData.donor_name || !newDonorData.country || !newDonorData.email) {
      alert('Please fill in mandatory fields: Organization Name, Country, and Official Email');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/donors', newDonorData);
      if (data.success) {
        setShowAddModal(false);
        setNewDonorData(initialDonorState);
        fetchDonors();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add International NGO');
    } finally {
      setSubmitting(false);
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
      alert(err.response?.data?.error || 'Failed to update NGO details');
    } finally {
      setSubmitting(false);
    }
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
    return (
      (item.donor_name && item.donor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.country && item.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.ngo_type && item.ngo_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
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
          <h1 className="text-4xl font-black text-hst-dark mb-2">International <span className="text-hst-teal">NGOs</span></h1>
          <p className="text-gray-500 font-medium">Global Partnerships & Grant Funding Management</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Organizations</span>
            <span className="text-2xl font-black text-hst-dark">{donors.length}</span>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-hst-dark text-white px-8 py-4 rounded-2xl font-black hover:bg-hst-teal transition-all shadow-xl shadow-hst-dark/10 flex items-center gap-3"
          >
            <Globe size={20} />
            Add New NGO
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hst-teal transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, country, type or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-bold text-hst-dark"
            />
          </div>
        </div>
      </div>

      {/* NGO Donor Blocks */}
      {filteredDonors.length > 0 ? (
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
                           className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-hst-dark text-white hover:bg-hst-teal transition-all shadow-lg flex items-center gap-2 font-bold text-xs md:text-sm"
                         >
                           <Info size={16} />
                           View Details
                         </button>
                         <button 
                           onClick={() => navigate('/admin/applications', { state: { donorId: donor.id, donorName: donor.donor_name } })}
                           className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-hst-teal text-white hover:bg-hst-dark transition-all shadow-lg flex items-center gap-2 font-bold text-xs md:text-sm"
                         >
                           <Plus size={16} />
                           Add Window
                         </button>
                      </div>
                      <div className="text-left lg:text-left">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          donor.funding_status === 'Active' ? 'bg-green-100 text-green-600' :
                          donor.funding_status === 'Planned' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {donor.funding_status || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Organization Identity */}
                    <div className="flex items-center gap-4 md:gap-6 min-w-0 lg:min-w-[320px] w-full lg:w-auto">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-hst-teal/10 flex items-center justify-center text-hst-teal shrink-0">
                        <Globe size={32} className="md:w-10 md:h-10" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl md:text-2xl font-black text-hst-dark truncate mb-1">{donor.donor_name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-hst-teal/5 text-hst-teal flex items-center gap-1">
                            <Flag size={10} /> {donor.country || 'N/A'}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-hst-teal/10 text-hst-teal">
                            {donor.ngo_type || 'INGO'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Funding Info */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 w-full">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                          <BookOpen size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Focus Area</p>
                          <p className="text-sm md:text-base font-bold text-hst-dark truncate">{donor.funding_category || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                          <Clock size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Cycle Type</p>
                          <p className="text-sm md:text-base font-bold text-hst-dark truncate">{donor.funding_cycle_type || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-hst-light/50 flex items-center justify-center text-hst-dark shrink-0">
                          <IndianRupee size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Grant</p>
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
            <Globe size={48} />
          </div>
          <h3 className="text-2xl font-black text-hst-dark mb-3">No International NGOs Found</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Try adjusting your search or add a new global partner.
          </p>
        </div>
      )}

      {/* Add NGO Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setShowAddModal(false)}
              className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[24px] md:rounded-[40px] w-full max-w-5xl overflow-hidden relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-custom"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-hst-dark text-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-hst-teal text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <Globe size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black">Intake Form: International NGO</h2>
                    <p className="text-xs md:text-sm text-white/80 font-medium">Organization Details & Funding Classification</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 md:p-10 space-y-12">
                {/* Section 1: Organization Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <Building2 className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">1. Organization Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField 
                      label="Organization Name" 
                      icon={<Building2 size={18} />} 
                      value={newDonorData.donor_name} 
                      isEditing={true}
                      required
                      placeholder="Legal name of donor"
                      onChange={(val) => setNewDonorData({...newDonorData, donor_name: val})}
                    />
                    <InputField 
                      label="Country" 
                      icon={<Flag size={18} />} 
                      value={newDonorData.country} 
                      isEditing={true}
                      required
                      placeholder="Country of registration"
                      onChange={(val) => setNewDonorData({...newDonorData, country: val})}
                    />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Globe2 size={18} />
                        Organization Type
                      </label>
                      <select 
                        value={newDonorData.ngo_type}
                        onChange={(e) => setNewDonorData({...newDonorData, ngo_type: e.target.value})}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                      >
                        <option value="">Select Type</option>
                        <option value="Foundation">Foundation</option>
                        <option value="INGO">INGO</option>
                        <option value="Development Agency">Development Agency</option>
                        <option value="University">University</option>
                      </select>
                    </div>
                    <InputField 
                      label="Registration / Tax ID" 
                      icon={<Hash size={18} />} 
                      value={newDonorData.tax_id} 
                      isEditing={true}
                      placeholder="EIN / Charity No / VAT"
                      onChange={(val) => setNewDonorData({...newDonorData, tax_id: val})}
                    />
                    <InputField 
                      label="Official Email" 
                      icon={<Mail size={18} />} 
                      value={newDonorData.email} 
                      isEditing={true}
                      required
                      placeholder="Domain-based email"
                      onChange={(val) => setNewDonorData({...newDonorData, email: val})}
                    />
                    <InputField 
                      label="Contact Person" 
                      icon={<UserCheck size={18} />} 
                      value={newDonorData.contact_person_name} 
                      isEditing={true}
                      placeholder="Primary donor contact"
                      onChange={(val) => setNewDonorData({...newDonorData, contact_person_name: val})}
                    />
                    <InputField 
                      label="Designation" 
                      icon={<Briefcase size={18} />} 
                      value={newDonorData.contact_person_designation} 
                      isEditing={true}
                      placeholder="Role in organization"
                      onChange={(val) => setNewDonorData({...newDonorData, contact_person_designation: val})}
                    />
                    <div className="md:col-span-2">
                      <InputField 
                        label="Registered Address" 
                        icon={<MapPin size={18} />} 
                        value={newDonorData.address} 
                        isEditing={true}
                        isTextArea
                        placeholder="Complete international address"
                        onChange={(val) => setNewDonorData({...newDonorData, address: val})}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Funding Classification */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <Activity className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">2. Funding Classification</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <BookOpen size={18} />
                        Funding Category
                      </label>
                      <select 
                        value={newDonorData.funding_category}
                        onChange={(e) => setNewDonorData({...newDonorData, funding_category: e.target.value})}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                      >
                        <option value="">Select Category</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Environment">Environment</option>
                        <option value="WASH">WASH</option>
                        <option value="Livelihoods">Livelihoods</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Clock size={18} />
                        Funding Cycle Type
                      </label>
                      <select 
                        value={newDonorData.funding_cycle_type}
                        onChange={(e) => setNewDonorData({...newDonorData, funding_cycle_type: e.target.value})}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                      >
                        <option value="One-time">One-time</option>
                        <option value="Annual">Annual</option>
                        <option value="Multi-Year">Multi-Year</option>
                        <option value="Phase-based">Phase-based</option>
                      </select>
                    </div>
                    <InputField 
                      label="Cycle Duration" 
                      icon={<CalendarDays size={18} />} 
                      value={newDonorData.cycle_duration} 
                      isEditing={true}
                      placeholder="e.g. 6 Months / 1 Year"
                      onChange={(val) => setNewDonorData({...newDonorData, cycle_duration: val})}
                    />
                    <InputField 
                      label="Grant Start Date" 
                      icon={<Calendar size={18} />} 
                      type="date"
                      value={newDonorData.grant_start_date} 
                      isEditing={true}
                      onChange={(val) => setNewDonorData({...newDonorData, grant_start_date: val})}
                    />
                    <InputField 
                      label="Grant End Date" 
                      icon={<Calendar size={18} />} 
                      type="date"
                      value={newDonorData.grant_end_date} 
                      isEditing={true}
                      onChange={(val) => setNewDonorData({...newDonorData, grant_end_date: val})}
                    />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <LayoutList size={18} />
                        Funding Status
                      </label>
                      <select 
                        value={newDonorData.funding_status}
                        onChange={(e) => setNewDonorData({...newDonorData, funding_status: e.target.value})}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                      >
                        <option value="Planned">Planned</option>
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-hst-dark text-white py-6 rounded-[32px] font-black text-xl shadow-2xl hover:bg-hst-teal hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <Globe size={24} />}
                    Register International NGO
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View/Edit Modal */}
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
              className="bg-white rounded-[24px] md:rounded-[40px] w-full max-w-4xl overflow-hidden relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-custom"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-hst-teal text-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-hst-teal rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <Info size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black">{isEditingInView ? 'Edit NGO Details' : 'NGO Profile'}</h2>
                    <p className="text-xs md:text-sm text-white/80 font-medium">{viewingDonor.donor_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditingInView && (
                    <button 
                      onClick={() => setIsEditingInView(true)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold flex items-center gap-2 transition-all"
                    >
                      <Edit size={16} /> Edit
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setViewingDonor(null);
                      setIsEditingInView(false);
                    }}
                    className="w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Reuse InputField with isEditing={isEditingInView} */}
                  <InputField 
                    label="Organization Name" icon={<Building2 size={18} />} 
                    value={viewingDonor.donor_name} isEditing={isEditingInView} 
                    onChange={(val) => setViewingDonor({...viewingDonor, donor_name: val})}
                  />
                  <InputField 
                    label="Country" icon={<Flag size={18} />} 
                    value={viewingDonor.country} isEditing={isEditingInView} 
                    onChange={(val) => setViewingDonor({...viewingDonor, country: val})}
                  />
                  <InputField 
                    label="Official Email" icon={<Mail size={18} />} 
                    value={viewingDonor.email} isEditing={isEditingInView} 
                    onChange={(val) => setViewingDonor({...viewingDonor, email: val})}
                  />
                  {/* ... other fields ... */}
                </div>
                
                {isEditingInView && (
                  <div className="mt-10">
                    <button 
                      onClick={handleEditSubmit}
                      disabled={submitting}
                      className="w-full hst-gradient text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminInternationalNGOs;
