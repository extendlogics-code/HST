import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Mail, Phone, Search, Loader2, 
  ShieldCheck, Download, History, Edit, X, Save,
  ArrowUpDown, Filter, ChevronLeft, ChevronRight,
  MapPin, Globe, Info, IndianRupee, Hash, FileText,
  UserCheck, Briefcase, FileCheck, Calendar, Activity,
  BookOpen, LayoutList, CreditCard, CalendarDays, Building
} from 'lucide-react';
import api from './api/api';

const AdminCorporateDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewingDonor, setViewingDonor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditingInView, setIsEditingInView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const initialDonorState = {
    donor_name: '',
    donor_type: 'CORPORATE',
    category: 'local',
    email: '',
    phone: '',
    address: '',
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
    installment_details: ''
  };

  const [newDonorData, setNewDonorData] = useState(initialDonorState);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await api.get('/donors');
      if (response.data.success) {
        // Filter for CORPORATE type
        const corporateDonors = response.data.data.filter(d => d.donor_type === 'CORPORATE' || d.donor_type === 'COMPANY');
        setDonors(corporateDonors);
        
        // Update viewing donor if it's currently open to reflect changes
        if (viewingDonor) {
          const updatedViewingDonor = corporateDonors.find(d => d.id === viewingDonor.id);
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

  const handleAddSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newDonorData.donor_name || !newDonorData.cin || !newDonorData.pan) {
      alert('Please fill in mandatory fields: Company Name, CIN, and PAN');
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
      alert(err.response?.data?.error || 'Failed to add corporate donor');
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
    const searchMatch = 
      (item.donor_name && item.donor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.phone && item.phone.includes(searchTerm)) ||
      (item.pan && item.pan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.cin && item.cin.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
          <h1 className="text-4xl font-black text-hst-dark mb-2">Corporate <span className="text-hst-teal">Donors</span></h1>
          <p className="text-gray-500 font-medium">CSR Fund Management & Corporate Identification Directory</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Companies</span>
            <span className="text-2xl font-black text-hst-dark">{donors.length}</span>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-hst-dark text-white px-8 py-4 rounded-2xl font-black hover:bg-hst-teal transition-all shadow-xl shadow-hst-dark/10 flex items-center gap-3"
          >
            <Building2 size={20} />
            Add Corporate Donor
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
              placeholder="Search by name, CIN, PAN, or email..."
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

      {/* Corporate Donor Blocks */}
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
                           title="View & Edit CSR Details"
                           className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-hst-dark text-white hover:bg-hst-teal transition-all shadow-lg flex items-center gap-2 font-bold text-xs md:text-sm"
                         >
                           <Info size={16} />
                           View CSR
                         </button>
                      </div>
                      <div className="text-left lg:text-left">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Registered On</p>
                        <p className="text-xs md:text-sm font-bold text-hst-dark">
                          {new Date(donor.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Middle Section: Corporate Identity */}
                    <div className="flex items-center gap-4 md:gap-6 min-w-0 lg:min-w-[320px] w-full lg:w-auto">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-hst-teal/10 flex items-center justify-center text-hst-teal shrink-0">
                        <Building2 size={32} className="md:w-10 md:h-10" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl md:text-2xl font-black text-hst-dark truncate mb-1">{donor.donor_name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-hst-teal/5 text-hst-teal`}>
                            {donor.cin || 'CIN N/A'}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                            donor.category === 'foreign' ? 'bg-hst-teal text-white' : 'bg-hst-teal/10 text-hst-teal'
                          }`}>
                            {donor.category === 'foreign' ? 'Foreign' : 'Local'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Key Financials */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 w-full">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                          <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">PAN</p>
                          <p className="text-sm md:text-base font-bold text-hst-dark truncate uppercase tracking-widest">{donor.pan || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                          <FileCheck size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">CSR-1 Reg</p>
                          <p className="text-sm md:text-base font-bold text-hst-dark truncate">{donor.csr_registration_number || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-hst-light/50 flex items-center justify-center text-hst-dark shrink-0">
                          <IndianRupee size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total CSR Contributed</p>
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
            <Building2 size={48} />
          </div>
          <h3 className="text-2xl font-black text-hst-dark mb-3">No Corporate Donors Found</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Try adjusting your search or category filters.
          </p>
        </div>
      )}

      {/* Add Corporate Donor Modal */}
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
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-hst-teal text-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-hst-teal rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <Building2 size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black">Intake Form: Corporate Donor</h2>
                    <p className="text-xs md:text-sm text-white/80 font-medium">Capture CSR fund & compliance details</p>
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
                {/* Section 1: Corporate Identification */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <Building2 className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">1. Corporate Identification Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField 
                      label="Company Legal Name" 
                      icon={<Building2 size={18} />} 
                      value={newDonorData.donor_name} 
                      isEditing={true}
                      required
                      onChange={(val) => setNewDonorData({...newDonorData, donor_name: val})}
                    />
                    <InputField 
                      label="CIN (Corporate ID Number)" 
                      icon={<Hash size={18} />} 
                      value={newDonorData.cin} 
                      isEditing={true}
                      required
                      placeholder="U12345MH2024PTC123456"
                      onChange={(val) => setNewDonorData({...newDonorData, cin: val})}
                    />
                    <InputField 
                      label="PAN of Company" 
                      icon={<ShieldCheck size={18} />} 
                      value={newDonorData.pan} 
                      isEditing={true}
                      required
                      placeholder="ABCDE1234F"
                      onChange={(val) => setNewDonorData({...newDonorData, pan: val.toUpperCase()})}
                    />
                    <InputField 
                      label="Company Email ID" 
                      icon={<Mail size={18} />} 
                      value={newDonorData.email} 
                      isEditing={true}
                      onChange={(val) => setNewDonorData({...newDonorData, email: val})}
                    />
                    <InputField 
                      label="Company Phone Number" 
                      icon={<Phone size={18} />} 
                      value={newDonorData.phone} 
                      isEditing={true}
                      onChange={(val) => setNewDonorData({...newDonorData, phone: val})}
                    />
                    <InputField 
                      label="Website URL" 
                      icon={<Globe size={18} />} 
                      value={newDonorData.website_url} 
                      isEditing={true}
                      placeholder="https://company.com"
                      onChange={(val) => setNewDonorData({...newDonorData, website_url: val})}
                    />
                    <div className="md:col-span-2">
                      <InputField 
                        label="Registered Office Address" 
                        icon={<MapPin size={18} />} 
                        value={newDonorData.registered_office_address} 
                        isEditing={true}
                        isTextArea
                        onChange={(val) => setNewDonorData({...newDonorData, registered_office_address: val})}
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
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
                  </div>
                </div>

                {/* Section 2: Authorized Signatory */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <UserCheck className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">2. Authorized Signatory Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField 
                      label="Name of Signatory" 
                      icon={<UserCheck size={18} />} 
                      value={newDonorData.authorized_signatory_name} 
                      isEditing={true}
                      onChange={(val) => setNewDonorData({...newDonorData, authorized_signatory_name: val})}
                    />
                    <InputField 
                      label="Designation" 
                      icon={<Briefcase size={18} />} 
                      value={newDonorData.authorized_signatory_designation} 
                      isEditing={true}
                      placeholder="CSR Head / Director / CFO"
                      onChange={(val) => setNewDonorData({...newDonorData, authorized_signatory_designation: val})}
                    />
                    <InputField 
                      label="Official Email ID" 
                      icon={<Mail size={18} />} 
                      value={newDonorData.authorized_signatory_email} 
                      isEditing={true}
                      onChange={(val) => setNewDonorData({...newDonorData, authorized_signatory_email: val})}
                    />
                    <InputField 
                      label="Contact Number" 
                      icon={<Phone size={18} />} 
                      value={newDonorData.authorized_signatory_phone} 
                      isEditing={true}
                      onChange={(val) => setNewDonorData({...newDonorData, authorized_signatory_phone: val})}
                    />
                    <InputField 
                      label="Board Resolution Ref" 
                      icon={<FileText size={18} />} 
                      value={newDonorData.board_resolution_ref} 
                      isEditing={true}
                      placeholder="BR No / Date"
                      onChange={(val) => setNewDonorData({...newDonorData, board_resolution_ref: val})}
                    />
                  </div>
                </div>

                {/* Section 3: CSR Compliance */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <FileCheck className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">3. CSR Compliance Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField 
                      label="CSR Registration No (CSR-1)" 
                      icon={<FileCheck size={18} />} 
                      value={newDonorData.csr_registration_number} 
                      isEditing={true}
                      placeholder="CSR00001234"
                      onChange={(val) => setNewDonorData({...newDonorData, csr_registration_number: val})}
                    />
                    <InputField 
                      label="CSR Financial Year" 
                      icon={<Calendar size={18} />} 
                      value={newDonorData.csr_financial_year} 
                      isEditing={true}
                      placeholder="FY 2025-26"
                      onChange={(val) => setNewDonorData({...newDonorData, csr_financial_year: val})}
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <Activity size={14} className="text-hst-teal" /> Nature of Contribution
                      </label>
                      <select 
                        value={newDonorData.nature_of_csr_contribution || ''}
                        onChange={(e) => setNewDonorData({...newDonorData, nature_of_csr_contribution: e.target.value})}
                        className="w-full bg-hst-light/30 border-2 border-hst-teal/10 rounded-2xl px-5 py-3.5 outline-none font-bold text-hst-dark focus:border-hst-teal/30 focus:bg-white transition-all"
                      >
                        <option value="">Select Option</option>
                        <option value="One-time">One-time</option>
                        <option value="Ongoing project">Ongoing project</option>
                      </select>
                    </div>
                    <InputField 
                      label="CSR Act Reference" 
                      icon={<BookOpen size={18} />} 
                      value={newDonorData.csr_act_reference} 
                      isEditing={true}
                      onChange={(val) => setNewDonorData({...newDonorData, csr_act_reference: val})}
                    />
                    <InputField 
                      label="Schedule VII Category" 
                      icon={<LayoutList size={18} />} 
                      value={newDonorData.schedule_vii_category} 
                      isEditing={true}
                      placeholder="Healthcare, Education, etc."
                      onChange={(val) => setNewDonorData({...newDonorData, schedule_vii_category: val})}
                    />
                  </div>
                </div>

                {/* Section 4: Donation / Fund Transfer Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <IndianRupee className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">4. Donation / Fund Transfer Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField 
                      label="CSR Amount Sanctioned" 
                      icon={<IndianRupee size={18} />} 
                      value={newDonorData.csr_amount_sanctioned} 
                      isEditing={true}
                      type="number"
                      onChange={(val) => setNewDonorData({...newDonorData, csr_amount_sanctioned: val})}
                    />
                    <InputField 
                      label="Amount Released (Initial)" 
                      icon={<Activity size={18} />} 
                      value={newDonorData.amount_released} 
                      isEditing={true}
                      type="number"
                      onChange={(val) => setNewDonorData({...newDonorData, amount_released: val})}
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <CreditCard size={14} className="text-hst-teal" /> Mode of Transfer
                      </label>
                      <div className="bg-hst-light/20 rounded-2xl px-5 py-3.5 font-bold text-hst-dark border border-gray-100 min-h-[56px] flex items-center">
                        Non-Cash Only (Bank/Cheque)
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <InputField 
                        label="Installment Details" 
                        icon={<LayoutList size={18} />} 
                        value={newDonorData.installment_details} 
                        isEditing={true}
                        isTextArea
                        placeholder="e.g. 1st Installment (50%) on 01/01/2026..."
                        onChange={(val) => setNewDonorData({...newDonorData, installment_details: val})}
                      />
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-[24px] flex items-start gap-4 lg:mt-6">
                       <Info className="text-yellow-600 shrink-0 mt-1" size={24} />
                       <div>
                         <h4 className="font-black text-yellow-800 uppercase text-xs tracking-widest mb-1">Important Compliance</h4>
                         <p className="text-yellow-700 text-sm font-bold leading-relaxed">
                           As per CSR regulations, all funds must be received via NON-CASH modes (Bank Transfer / Cheque). Ensure UTR numbers are captured for all transactions.
                         </p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 rounded-b-[24px] md:rounded-b-[40px]">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-white hover:text-hst-dark transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="px-10 py-4 rounded-2xl font-black bg-hst-dark text-white hover:bg-hst-teal transition-all shadow-xl shadow-hst-dark/10 flex items-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Create Corporate Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Corporate CSR Details Modal */}
      <AnimatePresence>
        {viewingDonor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!submitting) {
                  setViewingDonor(null);
                  setIsEditingInView(false);
                }
              }}
              className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[24px] md:rounded-[40px] w-full max-w-5xl overflow-hidden relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-custom"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-hst-dark text-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-hst-teal text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <Building2 size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-black truncate">{isEditingInView ? 'Edit CSR Profile' : 'Corporate CSR Profile'}</h2>
                    <p className="text-xs md:text-sm text-gray-400 font-medium truncate">
                      {isEditingInView ? 'Update details for' : 'CSR compliance & Identification for'} {viewingDonor.donor_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isEditingInView ? (
                    <button 
                      onClick={() => setIsEditingInView(true)}
                      className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-hst-teal transition-all flex items-center gap-2 font-bold text-sm"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  ) : (
                    <button 
                      onClick={handleEditSubmit}
                      disabled={submitting}
                      className="px-4 py-2 rounded-xl bg-hst-teal text-white hover:bg-hst-teal/80 transition-all flex items-center gap-2 font-bold text-sm disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save
                    </button>
                  )}
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
              </div>

              <div className="p-6 md:p-10 space-y-12">
                {/* Section 1: Corporate Identification */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <Building2 className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">1. Corporate Identification Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField 
                      label="Company Legal Name" 
                      icon={<Building2 size={18} />} 
                      value={viewingDonor.donor_name} 
                      isEditing={isEditingInView}
                      onChange={(val) => setViewingDonor({...viewingDonor, donor_name: val})}
                    />
                    <InputField 
                      label="CIN (Corporate ID Number)" 
                      icon={<Hash size={18} />} 
                      value={viewingDonor.cin} 
                      isEditing={isEditingInView}
                      placeholder="U12345MH2024PTC123456"
                      onChange={(val) => setViewingDonor({...viewingDonor, cin: val})}
                      required
                    />
                    <InputField 
                      label="PAN of Company" 
                      icon={<ShieldCheck size={18} />} 
                      value={viewingDonor.pan} 
                      isEditing={isEditingInView}
                      placeholder="ABCDE1234F"
                      onChange={(val) => setViewingDonor({...viewingDonor, pan: val})}
                      required
                    />
                    <InputField 
                      label="Company Email ID" 
                      icon={<Mail size={18} />} 
                      value={viewingDonor.email} 
                      isEditing={isEditingInView}
                      onChange={(val) => setViewingDonor({...viewingDonor, email: val})}
                    />
                    <InputField 
                      label="Company Phone Number" 
                      icon={<Phone size={18} />} 
                      value={viewingDonor.phone} 
                      isEditing={isEditingInView}
                      onChange={(val) => setViewingDonor({...viewingDonor, phone: val})}
                    />
                    <InputField 
                      label="Website URL" 
                      icon={<Globe size={18} />} 
                      value={viewingDonor.website_url} 
                      isEditing={isEditingInView}
                      placeholder="https://company.com"
                      onChange={(val) => setViewingDonor({...viewingDonor, website_url: val})}
                    />
                    <div className="md:col-span-2">
                      <InputField 
                        label="Registered Office Address" 
                        icon={<MapPin size={18} />} 
                        value={viewingDonor.registered_office_address} 
                        isEditing={isEditingInView}
                        isTextArea
                        onChange={(val) => setViewingDonor({...viewingDonor, registered_office_address: val})}
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                      <InputField 
                        label="Corporate Office Address" 
                        icon={<MapPin size={18} />} 
                        value={viewingDonor.corporate_office_address} 
                        isEditing={isEditingInView}
                        isTextArea
                        placeholder="Same as registered if empty"
                        onChange={(val) => setViewingDonor({...viewingDonor, corporate_office_address: val})}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Authorized Signatory */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <UserCheck className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">2. Authorized Signatory Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField 
                      label="Name of Signatory" 
                      icon={<UserCheck size={18} />} 
                      value={viewingDonor.authorized_signatory_name} 
                      isEditing={isEditingInView}
                      onChange={(val) => setViewingDonor({...viewingDonor, authorized_signatory_name: val})}
                    />
                    <InputField 
                      label="Designation" 
                      icon={<Briefcase size={18} />} 
                      value={viewingDonor.authorized_signatory_designation} 
                      isEditing={isEditingInView}
                      placeholder="CSR Head / Director / CFO"
                      onChange={(val) => setViewingDonor({...viewingDonor, authorized_signatory_designation: val})}
                    />
                    <InputField 
                      label="Official Email ID" 
                      icon={<Mail size={18} />} 
                      value={viewingDonor.authorized_signatory_email} 
                      isEditing={isEditingInView}
                      onChange={(val) => setViewingDonor({...viewingDonor, authorized_signatory_email: val})}
                    />
                    <InputField 
                      label="Contact Number" 
                      icon={<Phone size={18} />} 
                      value={viewingDonor.authorized_signatory_phone} 
                      isEditing={isEditingInView}
                      onChange={(val) => setViewingDonor({...viewingDonor, authorized_signatory_phone: val})}
                    />
                    <InputField 
                      label="Board Resolution Ref" 
                      icon={<FileText size={18} />} 
                      value={viewingDonor.board_resolution_ref} 
                      isEditing={isEditingInView}
                      placeholder="BR No / Date"
                      onChange={(val) => setViewingDonor({...viewingDonor, board_resolution_ref: val})}
                    />
                  </div>
                </div>

                {/* Section 3: CSR Compliance */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <FileCheck className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">3. CSR Compliance Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField 
                      label="CSR Registration No (CSR-1)" 
                      icon={<FileCheck size={18} />} 
                      value={viewingDonor.csr_registration_number} 
                      isEditing={isEditingInView}
                      placeholder="CSR00001234"
                      onChange={(val) => setViewingDonor({...viewingDonor, csr_registration_number: val})}
                    />
                    <InputField 
                      label="CSR Financial Year" 
                      icon={<Calendar size={18} />} 
                      value={viewingDonor.csr_financial_year} 
                      isEditing={isEditingInView}
                      placeholder="FY 2025-26"
                      onChange={(val) => setViewingDonor({...viewingDonor, csr_financial_year: val})}
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <Activity size={14} className="text-hst-teal" /> Nature of Contribution
                      </label>
                      {isEditingInView ? (
                        <select 
                          value={viewingDonor.nature_of_csr_contribution || ''}
                          onChange={(e) => setViewingDonor({...viewingDonor, nature_of_csr_contribution: e.target.value})}
                          className="w-full bg-hst-light/30 border-2 border-hst-teal/10 rounded-2xl px-5 py-3.5 outline-none font-bold text-hst-dark focus:border-hst-teal/30 focus:bg-white transition-all"
                        >
                          <option value="">Select Option</option>
                          <option value="One-time">One-time</option>
                          <option value="Ongoing project">Ongoing project</option>
                        </select>
                      ) : (
                        <div className="bg-hst-light/20 rounded-2xl px-5 py-3.5 font-bold text-hst-dark border border-gray-100 min-h-[56px] flex items-center">
                          {viewingDonor.nature_of_csr_contribution || 'Not Specified'}
                        </div>
                      )}
                    </div>
                    <InputField 
                      label="CSR Act Reference" 
                      icon={<BookOpen size={18} />} 
                      value={viewingDonor.csr_act_reference || 'Section 135 of Companies Act, 2013'} 
                      isEditing={isEditingInView}
                      onChange={(val) => setViewingDonor({...viewingDonor, csr_act_reference: val})}
                    />
                    <InputField 
                      label="Schedule VII Category" 
                      icon={<LayoutList size={18} />} 
                      value={viewingDonor.schedule_vii_category} 
                      isEditing={isEditingInView}
                      placeholder="Healthcare, Education, etc."
                      onChange={(val) => setViewingDonor({...viewingDonor, schedule_vii_category: val})}
                    />
                  </div>
                </div>

                {/* Section 4: Donation / Fund Transfer Details */}
                {/* Note: These are usually per-donation, but showing summaries here if available */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-hst-light pb-4">
                    <IndianRupee className="text-hst-teal" size={24} />
                    <h3 className="text-xl font-black text-hst-dark uppercase tracking-wider">4. Donation / Fund Transfer Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField 
                      label="CSR Amount Sanctioned" 
                      icon={<IndianRupee size={18} />} 
                      value={viewingDonor.csr_amount_sanctioned} 
                      isEditing={isEditingInView}
                      type="number"
                      onChange={(val) => setViewingDonor({...viewingDonor, csr_amount_sanctioned: val})}
                    />
                    <InputField 
                      label="Amount Released (Total)" 
                      icon={<Activity size={18} />} 
                      value={viewingDonor.amount_released || viewingDonor.total_donated} 
                      isEditing={isEditingInView}
                      type="number"
                      onChange={(val) => setViewingDonor({...viewingDonor, amount_released: val})}
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <CreditCard size={14} className="text-hst-teal" /> Mode of Transfer
                      </label>
                      <div className="bg-hst-light/20 rounded-2xl px-5 py-3.5 font-bold text-hst-dark border border-gray-100 min-h-[56px] flex items-center">
                        Non-Cash Only (Bank/Cheque)
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <InputField 
                        label="Installment Details" 
                        icon={<LayoutList size={18} />} 
                        value={viewingDonor.installment_details} 
                        isEditing={isEditingInView}
                        isTextArea
                        placeholder="e.g. 1st Installment (50%) on 01/01/2026..."
                        onChange={(val) => setViewingDonor({...viewingDonor, installment_details: val})}
                      />
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-[24px] flex items-start gap-4 lg:mt-6">
                       <Info className="text-yellow-600 shrink-0 mt-1" size={24} />
                       <div>
                         <h4 className="font-black text-yellow-800 uppercase text-xs tracking-widest mb-1">Important Compliance</h4>
                         <p className="text-yellow-700 text-sm font-bold leading-relaxed">
                           As per CSR regulations, all funds must be received via NON-CASH modes (Bank Transfer / Cheque). Ensure UTR numbers are captured for all transactions.
                         </p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer (only visible when editing) */}
              {isEditingInView && (
                <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                  <button 
                    onClick={() => setIsEditingInView(false)}
                    className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-white hover:text-hst-dark transition-all"
                  >
                    Cancel Changes
                  </button>
                  <button 
                    onClick={handleEditSubmit}
                    disabled={submitting}
                    className="px-10 py-4 rounded-2xl font-black bg-hst-dark text-white hover:bg-hst-teal transition-all shadow-xl shadow-hst-dark/10 flex items-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Corporate Details
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Component for Input Fields
const InputField = ({ label, icon, value, isEditing, onChange, isTextArea, placeholder, type = "text", required }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
      <span className="text-hst-teal">{icon}</span> {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isEditing ? (
      isTextArea ? (
        <textarea 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-hst-light/30 border-2 border-hst-teal/10 rounded-2xl px-5 py-3.5 outline-none font-bold text-hst-dark focus:border-hst-teal/30 focus:bg-white transition-all min-h-[100px] resize-none"
        />
      ) : (
        <input 
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-hst-light/30 border-2 border-hst-teal/10 rounded-2xl px-5 py-3.5 outline-none font-bold text-hst-dark focus:border-hst-teal/30 focus:bg-white transition-all"
        />
      )
    ) : (
      <div className={`bg-hst-light/20 rounded-2xl px-5 py-3.5 font-bold text-hst-dark border border-gray-100 min-h-[56px] flex items-center ${!value ? 'text-gray-400 italic font-medium' : ''}`}>
        {value || 'Not Provided'}
      </div>
    )}
  </div>
);

export default AdminCorporateDonors;
