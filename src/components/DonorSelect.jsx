import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, Phone, MapPin } from 'lucide-react';
import api from '../api/api';

const DonorSelect = ({ onSelect, onNewDonor }) => {
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2) {
        fetchDonors();
      } else {
        setDonors([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/donors?search=${searchTerm}`);
      if (data.success) {
        setDonors(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-12 pr-4 py-4 outline-none transition-all font-medium"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />
      </div>

      {showResults && (searchTerm.length >= 2 || donors.length > 0) && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-500 font-medium">Searching...</div>
          ) : (
            <>
              {donors.map((donor) => (
                <button
                  key={donor.id}
                  onClick={() => {
                    onSelect(donor);
                    setShowResults(false);
                    setSearchTerm('');
                  }}
                  className="w-full text-left p-4 hover:bg-hst-light/30 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-hst-teal/10 text-hst-teal rounded-xl flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-hst-dark">{donor.donor_name}</h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {donor.email} • {donor.phone}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  onNewDonor(searchTerm);
                  setShowResults(false);
                  setSearchTerm('');
                }}
                className="w-full p-4 text-hst-teal font-black text-sm flex items-center justify-center gap-2 hover:bg-hst-teal/5 transition-colors"
              >
                <Plus size={18} />
                Create New Donor "{searchTerm}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DonorSelect;
