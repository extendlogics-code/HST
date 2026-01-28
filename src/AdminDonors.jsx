import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, Hash, Search, Loader2, 
  ChevronRight, ExternalLink, Calendar, ShieldCheck,
  CreditCard, MapPin, Download, History, Plus, X, UserPlus,
  Users, Edit, Globe, Info, Save, IndianRupee,
  Building2, FileText, UserCheck, Briefcase, FileCheck, CalendarDays, Activity, BookOpen, LayoutList, Building,
  Flag, Globe2
} from 'lucide-react';
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
          className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold"
        />
      )
    ) : (
      <div className="bg-hst-light/10 border-2 border-transparent px-6 py-4 rounded-2xl font-bold text-hst-dark min-h-[58px] flex items-center">
        {value || <span className="text-gray-300 font-medium italic">Not Provided</span>}
      </div>
    )}
  </div>
);

const AdminDonors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewingDonor, setViewingDonor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditingInView, setIsEditingInView] = useState(false);
  
  // Sync donor type with URL search params
  const filterDonorType = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('type') || 'all';
  }, [location.search]);

  // Update URL search params for type filter
  const handleTypeFilter = (type) => {
    const params = new URLSearchParams(location.search);
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    navigate({ search: params.toString() });
  };

  // Helper to format donor type label for display
  const getDonorTypeLabel = (type) => {
    switch (type) {
      case 'INDIVIDUAL': return 'Individual';
      case 'CORPORATE': 
      case 'COMPANY': return 'Corporate';
      case 'INTERNATIONAL': return 'International NGO';
      default: return type;
    }
  };

  const getModalMaxWidth = () => {
    if (newDonorData.donor_type === 'CORPORATE' || newDonorData.donor_type === 'INTERNATIONAL') {
      return 'max-w-5xl';
    }
    return 'max-w-2xl';
  };

  const getHeaderStyle = () => {
    if (newDonorData.donor_type === 'CORPORATE') return 'bg-hst-teal text-white';
    if (newDonorData.donor_type === 'INTERNATIONAL') return 'bg-hst-dark text-white';
    return 'bg-hst-light/30 text-hst-dark';
  };

  const getIconStyle = () => {
    if (newDonorData.donor_type === 'CORPORATE') return 'bg-white text-hst-teal';
    if (newDonorData.donor_type === 'INTERNATIONAL') return 'bg-white text-hst-dark';
    return 'bg-hst-teal text-white';
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const initialDonorState = {
    donor_name: '',
    donor_type: 'INDIVIDUAL',
    category: 'local',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    pan: '',
    cin: '',
    registered_office_address: '',
    corporate_office_address: '',
    website_url: '',
    authorized_signatory_name: '',
    authorized_signatory_designation: '',
    authorized_signatory_email: '',
    authorized_signatory_phone: '',
    board_resolution_ref: '',
    csr_registration_number: '',
    csr_financial_year: 'FY 2025-26',
    nature_of_csr_contribution: '',
    csr_act_reference: 'Section 135 of Companies Act, 2013',
    schedule_vii_category: '',
    csr_amount_sanctioned: '',
    amount_released: '',
    installment_details: '',
    // International NGO fields
    ngo_type: '',
    tax_id: '',
    contact_person_name: '',
    contact_person_designation: '',
    funding_category: '',
    funding_cycle_type: 'One-time',
    cycle_duration: '',
    grant_start_date: '',
    grant_end_date: '',
    funding_status: 'Planned'
  };

  const [newDonorData, setNewDonorData] = useState(initialDonorState);

  // Automatically set category to foreign if type is INTERNATIONAL
  useEffect(() => {
    if (newDonorData.donor_type === 'INTERNATIONAL') {
      setNewDonorData(prev => ({ ...prev, category: 'foreign' }));
    }
  }, [newDonorData.donor_type]);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await api.get('/donors');
      if (response.data.success) {
        setDonors(response.data.data);

        // Update viewing donor if it's currently open to reflect changes
        if (viewingDonor) {
          const updatedViewingDonor = response.data.data.find(d => d.id === viewingDonor.id);
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

  const handleNewDonorSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Mandatory field validation
    if (!newDonorData.donor_name || !newDonorData.pan) {
      alert('Please fill in mandatory fields: Donor Name and PAN');
      return;
    }

    if (newDonorData.donor_type === 'CORPORATE' && !newDonorData.cin) {
      alert('CIN is mandatory for Corporate donors');
      return;
    }

    if (newDonorData.donor_type === 'INTERNATIONAL' && !newDonorData.country) {
      alert('Country is mandatory for International NGOs');
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
      alert(err.response?.data?.error || 'Failed to create donor');
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
      alert(err.response?.data?.error || 'Failed to update donor');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDonors = donors.filter(item => {
    const searchMatch = 
      (item.donor_name && item.donor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.phone && item.phone.includes(searchTerm)) ||
      (item.pan && item.pan.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const typeMatch = filterDonorType === 'all' || item.donor_type === filterDonorType;
    
    return searchMatch && categoryMatch && typeMatch;
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-hst-dark mb-2">Donor <span className="text-hst-teal">Directory</span></h1>
          <p className="text-sm md:text-base text-gray-500 font-medium">Manage and view information of all supporters</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6">
          <button 
            onClick={() => setShowAddModal(true)}
            className="hst-gradient text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-hst-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm md:text-base"
          >
            <UserPlus size={20} />
            Add New Donor
          </button>
          
          <div className="flex items-center justify-end gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Supporters</span>
              <span className="text-xl md:text-2xl font-black text-hst-dark">{donors.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Row 1: Search and Categories */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className="flex-1 bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hst-teal transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by name, email, phone or PAN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-hst-light/30 border-2 border-transparent focus:border-hst-teal/20 focus:bg-white rounded-2xl pl-14 pr-6 py-3 md:py-4 outline-none transition-all font-bold text-hst-dark text-sm md:text-base shadow-sm"
              />
            </div>
          </div>

          <div className="bg-white p-2 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'local', label: 'Local' },
              { id: 'foreign', label: 'Foreign' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all whitespace-nowrap text-xs md:text-base ${
                  filterCategory === tab.id 
                    ? 'bg-hst-dark text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-hst-light hover:text-hst-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Type Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 md:gap-6">
          <div className="bg-white p-2 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'INDIVIDUAL', label: 'Individual' },
              { id: 'CORPORATE', label: 'Corporate' },
              { id: 'INTERNATIONAL', label: 'Intl NGO' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeFilter(type.id)}
                className={`px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all whitespace-nowrap text-xs md:text-base ${
                  filterDonorType === type.id 
                    ? 'bg-hst-teal text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-hst-light hover:text-hst-teal'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {filterDonorType !== 'all' && (
            <div className="bg-hst-teal/10 text-hst-teal px-6 py-3 md:py-4 rounded-[24px] md:rounded-[32px] font-black flex items-center gap-3 border border-hst-teal/20 w-fit">
              <Users size={18} />
              <span className="uppercase tracking-widest text-[10px] md:text-xs whitespace-nowrap">Active Type Filter: {getDonorTypeLabel(filterDonorType)}</span>
              <Link to="/admin/donors" className="hover:rotate-90 transition-all ml-2 text-hst-teal/60 hover:text-hst-teal">
                <X size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[40px] p-32 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-hst-teal mb-4" size={48} />
          <p className="text-gray-400 font-bold animate-pulse">Loading donor directory...</p>
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

                    {/* Right Section: Contact Details */}
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
                        <div className="w-10 h-10 rounded-xl bg-hst-light/50 flex items-center justify-center text-hst-teal shrink-0">
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
          <h3 className="text-2xl font-black text-hst-dark mb-3">No Donors Found</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Try searching for a different name, email or check the search term.
          </p>
        </div>
      )}

      {/* Add Donor Modal */}
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
              className={`bg-white rounded-[24px] md:rounded-[40px] w-full ${getModalMaxWidth()} overflow-hidden relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-custom`}
            >
              <div className={`p-6 md:p-8 border-b border-gray-100 flex items-center justify-between ${getHeaderStyle()} sticky top-0 z-20 backdrop-blur-md`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${getIconStyle()} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0`}>
                    <UserPlus size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-black truncate">
                      {newDonorData.donor_type === 'CORPORATE' ? 'Corporate Intake Form' : 
                       newDonorData.donor_type === 'INTERNATIONAL' ? 'International NGO Intake' : 'Add New Donor'}
                    </h2>
                    <p className={`text-xs md:text-sm ${newDonorData.donor_type === 'CORPORATE' || newDonorData.donor_type === 'INTERNATIONAL' ? 'text-white/80' : 'text-gray-500'} font-medium truncate`}>
                      {newDonorData.donor_type === 'CORPORATE' ? 'Capture CSR fund & compliance details' : 
                       newDonorData.donor_type === 'INTERNATIONAL' ? 'Organization Details & Funding Classification' : 'Enter details for the new supporter'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className={`w-10 h-10 rounded-xl ${newDonorData.donor_type === 'CORPORATE' || newDonorData.donor_type === 'INTERNATIONAL' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-gray-400 hover:text-red-500'} transition-all flex items-center justify-center shrink-0`}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleNewDonorSubmit} className="p-6 md:p-10 space-y-12">
                {/* Section 1: Basic Identification */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <User className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">1. Basic Identification</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <InputField 
                      label={newDonorData.donor_type === 'CORPORATE' ? "Company Legal Name" : 
                             newDonorData.donor_type === 'INTERNATIONAL' ? "Organization Name" : "Full Name"}
                      icon={newDonorData.donor_type === 'CORPORATE' || newDonorData.donor_type === 'INTERNATIONAL' ? <Building2 size={18} /> : <User size={18} />}
                      value={newDonorData.donor_name}
                      isEditing={true}
                      required
                      placeholder={newDonorData.donor_type === 'CORPORATE' ? "Enter company name" : 
                                   newDonorData.donor_type === 'INTERNATIONAL' ? "Legal name of donor" : "Enter donor name"}
                      onChange={(val) => setNewDonorData({...newDonorData, donor_name: val})}
                    />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Users size={18} />
                        Donor Type
                      </label>
                      <select 
                        value={newDonorData.donor_type}
                        onChange={(e) => setNewDonorData(prev => ({ ...prev, donor_type: e.target.value }))}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                      >
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="CORPORATE">Corporate</option>
                        <option value="INTERNATIONAL">International NGO</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Globe size={18} />
                        Category
                      </label>
                      <select 
                        value={newDonorData.category}
                        onChange={(e) => setNewDonorData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold h-[58px]"
                      >
                        <option value="local">Local</option>
                        <option value="foreign">Foreign</option>
                      </select>
                    </div>
                    <InputField 
                      label="PAN Number"
                      icon={<ShieldCheck size={18} />}
                      value={newDonorData.pan}
                      isEditing={true}
                      required
                      placeholder="ABCDE1234F"
                      onChange={(val) => setNewDonorData({...newDonorData, pan: val.toUpperCase()})}
                    />
                    {newDonorData.donor_type === 'CORPORATE' && (
                      <InputField 
                        label="CIN (Corporate ID Number)" 
                        icon={<Hash size={18} />} 
                        value={newDonorData.cin} 
                        isEditing={true}
                        required
                        placeholder="U12345MH2024PTC123456"
                        onChange={(val) => setNewDonorData({...newDonorData, cin: val})}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label={newDonorData.donor_type === 'INTERNATIONAL' ? "Official Email" : "Email ID"} 
                      icon={<Mail size={18} />} 
                      value={newDonorData.email} 
                      isEditing={true}
                      type="email"
                      placeholder={newDonorData.donor_type === 'INTERNATIONAL' ? "Domain-based email" : "donor@example.com"}
                      onChange={(val) => setNewDonorData({...newDonorData, email: val})}
                    />
                    <InputField 
                      label="Phone Number" 
                      icon={<Phone size={18} />} 
                      value={newDonorData.phone} 
                      isEditing={true}
                      placeholder="+91 00000 00000"
                      onChange={(val) => setNewDonorData({...newDonorData, phone: val})}
                    />
                  </div>

                  {newDonorData.donor_type === 'CORPORATE' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField 
                        label="Registered Office Address" 
                        icon={<MapPin size={18} />} 
                        value={newDonorData.registered_office_address} 
                        isEditing={true}
                        isTextArea
                        onChange={(val) => setNewDonorData({...newDonorData, registered_office_address: val})}
                      />
                      <InputField 
                        label="Corporate Office Address" 
                        icon={<MapPin size={18} />} 
                        value={newDonorData.corporate_office_address} 
                        isEditing={true}
                        isTextArea
                        placeholder="Leave empty if same as registered"
                        onChange={(val) => setNewDonorData({...newDonorData, corporate_office_address: val})}
                      />
                    </div>
                  ) : (
                    <InputField 
                      label="Full Address" 
                      icon={<MapPin size={18} />} 
                      value={newDonorData.address} 
                      isEditing={true}
                      isTextArea
                      placeholder="Enter donor's full address"
                      onChange={(val) => setNewDonorData({...newDonorData, address: val})}
                    />
                  )}
                </div>

                {newDonorData.donor_type === 'CORPORATE' && (
                  <>
                    {/* Section 2: Authorized Signatory */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                        <UserCheck className="text-hst-teal" size={24} />
                        <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">2. Authorized Signatory</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputField 
                          label="Full Name" 
                          icon={<User size={18} />} 
                          value={newDonorData.authorized_signatory_name} 
                          isEditing={true}
                          onChange={(val) => setNewDonorData({...newDonorData, authorized_signatory_name: val})}
                        />
                        <InputField 
                          label="Designation" 
                          icon={<Briefcase size={18} />} 
                          value={newDonorData.authorized_signatory_designation} 
                          isEditing={true}
                          onChange={(val) => setNewDonorData({...newDonorData, authorized_signatory_designation: val})}
                        />
                        <InputField 
                          label="Official Email" 
                          icon={<Mail size={18} />} 
                          value={newDonorData.authorized_signatory_email} 
                          isEditing={true}
                          onChange={(val) => setNewDonorData({...newDonorData, authorized_signatory_email: val})}
                        />
                      </div>
                    </div>

                    {/* Section 3: CSR Compliance */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                        <FileCheck className="text-hst-teal" size={24} />
                        <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">3. CSR Compliance & Purpose</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputField 
                          label="CSR-1 Registration No." 
                          icon={<FileText size={18} />} 
                          value={newDonorData.csr_registration_number} 
                          isEditing={true}
                          placeholder="CSR0000XXXX"
                          onChange={(val) => setNewDonorData({...newDonorData, csr_registration_number: val})}
                        />
                        <InputField 
                          label="Financial Year" 
                          icon={<CalendarDays size={18} />} 
                          value={newDonorData.csr_financial_year} 
                          isEditing={true}
                          onChange={(val) => setNewDonorData({...newDonorData, csr_financial_year: val})}
                        />
                        <InputField 
                          label="Nature of Contribution" 
                          icon={<Activity size={18} />} 
                          value={newDonorData.nature_of_csr_contribution} 
                          isEditing={true}
                          placeholder="Ongoing / One-time"
                          onChange={(val) => setNewDonorData({...newDonorData, nature_of_csr_contribution: val})}
                        />
                        <div className="md:col-span-2">
                          <InputField 
                            label="Schedule VII Category" 
                            icon={<BookOpen size={18} />} 
                            value={newDonorData.schedule_vii_category} 
                            isEditing={true}
                            placeholder="e.g. Education, Healthcare, Rural Development"
                            onChange={(val) => setNewDonorData({...newDonorData, schedule_vii_category: val})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Donation Details */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                        <CreditCard className="text-hst-teal" size={24} />
                        <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">4. Donation / Fund Transfer</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputField 
                          label="Sanctioned Amount (₹)" 
                          icon={<IndianRupee size={18} />} 
                          value={newDonorData.csr_amount_sanctioned} 
                          isEditing={true}
                          type="number"
                          onChange={(val) => setNewDonorData({...newDonorData, csr_amount_sanctioned: val})}
                        />
                        <InputField 
                          label="Amount Released (₹)" 
                          icon={<IndianRupee size={18} />} 
                          value={newDonorData.amount_released} 
                          isEditing={true}
                          type="number"
                          onChange={(val) => setNewDonorData({...newDonorData, amount_released: val})}
                        />
                        <InputField 
                          label="Installment Details" 
                          icon={<LayoutList size={18} />} 
                          value={newDonorData.installment_details} 
                          isEditing={true}
                          placeholder="e.g. 1st of 3 installments"
                          onChange={(val) => setNewDonorData({...newDonorData, installment_details: val})}
                        />
                      </div>
                    </div>

                    <div className="bg-hst-teal/5 border-2 border-hst-teal/20 rounded-3xl p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-hst-teal text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-hst-dark mb-1 uppercase tracking-tight">Important Compliance</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                          All CSR contributions must be received through <span className="text-hst-teal font-black">NON-CASH</span> channels only (Cheque/NEFT/RTGS). 
                          Please ensure the transaction reference is captured in the donations module after creating this donor.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {newDonorData.donor_type === 'INTERNATIONAL' && (
                  <>
                    {/* Section 2: Organization Details */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                        <Building2 className="text-hst-teal" size={24} />
                        <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">2. Organization Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          placeholder="Role in donor organization"
                          onChange={(val) => setNewDonorData({...newDonorData, contact_person_designation: val})}
                        />
                      </div>
                    </div>

                    {/* Section 3: Funding Classification */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                        <FileCheck className="text-hst-teal" size={24} />
                        <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">3. Funding Classification</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputField 
                          label="Funding Category" 
                          icon={<BookOpen size={18} />} 
                          value={newDonorData.funding_category} 
                          isEditing={true}
                          placeholder="Healthcare, Education, etc."
                          onChange={(val) => setNewDonorData({...newDonorData, funding_category: val})}
                        />
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Clock size={18} />
                            Cycle Type
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
                          placeholder="6 Months / 1 Year / 3 Years etc."
                          onChange={(val) => setNewDonorData({...newDonorData, cycle_duration: val})}
                        />
                        <InputField 
                          label="Grant Start Date" 
                          icon={<Calendar size={18} />} 
                          value={newDonorData.grant_start_date} 
                          isEditing={true}
                          type="date"
                          onChange={(val) => setNewDonorData({...newDonorData, grant_start_date: val})}
                        />
                        <InputField 
                          label="Grant End Date" 
                          icon={<Calendar size={18} />} 
                          value={newDonorData.grant_end_date} 
                          isEditing={true}
                          type="date"
                          onChange={(val) => setNewDonorData({...newDonorData, grant_end_date: val})}
                        />
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Activity size={18} />
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
                  </>
                )}

                <div className="pt-8">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full hst-gradient text-white py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-hst-teal/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Plus size={24} />
                        {newDonorData.donor_type === 'CORPORATE' ? 'Register Corporate Donor' : 'Register New Donor'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Donor Modal - REMOVED since editing is now in View modal */}

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

export default AdminDonors;
