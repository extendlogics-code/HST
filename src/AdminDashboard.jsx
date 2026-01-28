import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, 
  History,
  PlusCircle,
  Users, 
  FileText, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from './api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    donorCount: 0,
    certificateCount: 0,
    recentDonations: [],
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // In a real app, we'd have a specific dashboard stats endpoint
      // For now, let's fetch donations and donors to calculate
      const [donationsRes, donorsRes, certsRes] = await Promise.all([
        api.get('/donations'),
        api.get('/donors'),
        api.get('/certificates')
      ]);

      const allDonations = donationsRes.data.data;
      const completedDonations = allDonations.filter(d => d.status === 'COMPLETED');
      const totalAmount = completedDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
      
      setStats({
        totalDonations: totalAmount,
        donorCount: donorsRes.data.data.length,
        certificateCount: certsRes.data.data.length,
        recentDonations: completedDonations.slice(0, 5),
        monthlyGrowth: 12.5 // Mock value
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Donations',
      value: `₹ ${stats.totalDonations.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-hst-teal',
      trend: '+12.5%',
      trendUp: true
    },
    {
      label: 'Active Donors',
      value: stats.donorCount,
      icon: Users,
      color: 'bg-hst-dark',
      trend: '+4.2%',
      trendUp: true
    },
    {
      label: 'Certs Issued',
      value: stats.certificateCount,
      icon: FileText,
      color: 'bg-hst-green',
      trend: '+18.3%',
      trendUp: true,
      link: '/admin/history'
    }
  ];

  return (
    <div className="font-sans text-hst-dark">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black mb-2">Admin <span className="text-hst-teal">Dashboard</span></h1>
          <p className="text-gray-500 font-medium">Overview of trust operations and compliance</p>
        </div>
        
        <div className="flex gap-3">
          <Link 
            to="/admin/history"
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black text-sm text-hst-dark hover:border-hst-teal/30 transition-all shadow-sm"
          >
            <History size={18} className="text-hst-teal" />
            View History
          </Link>
          <Link 
            to="/admin/generate-80g"
            className="flex items-center gap-2 px-6 py-3 bg-hst-teal text-white rounded-2xl font-black text-sm hover:bg-hst-dark transition-all shadow-lg shadow-hst-teal/20"
          >
            <PlusCircle size={18} />
            Generate 80G
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-hst-dark/5 relative overflow-hidden group"
          >
            {card.link && (
              <Link to={card.link} className="absolute inset-0 z-10" />
            )}
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-5 rounded-bl-[80px] group-hover:scale-110 transition-transform`} />
            <div className="relative z-10 space-y-4">
              <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <card.icon size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{card.label}</p>
                <h2 className="text-4xl font-black text-hst-dark">{card.value}</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  card.trendUp ? 'bg-hst-green/10 text-hst-green' : 'bg-red-50 text-red-400'
                }`}>
                  {card.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.trend}
                </div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Since last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Donations Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black flex items-center gap-3">
              <Clock className="text-hst-teal" size={24} />
              Recent Donations
            </h3>
            <button className="text-xs font-black text-hst-teal uppercase tracking-widest hover:text-hst-dark transition-colors">
              View All
            </button>
          </div>
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-hst-dark/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-hst-light/30">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Donor</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mode</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-hst-light/10 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-hst-teal/10 text-hst-teal flex items-center justify-center text-xs font-black">
                          {donation.donor_name.charAt(0)}
                        </div>
                        <span className="font-bold text-hst-dark text-sm">{donation.donor_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-hst-dark text-sm">₹ {parseFloat(donation.amount).toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                        {donation.payment_mode}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-gray-400">
                      {new Date(donation.donation_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Compliance Check */}
        <div className="space-y-6">
          <h3 className="text-xl font-black flex items-center gap-3 px-4">
            <CheckCircle2 className="text-hst-green" size={24} />
            Compliance Status
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-hst-green/10 text-hst-green rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="font-black text-hst-dark text-sm">80G Registration</p>
                <p className="text-[10px] font-bold text-hst-green uppercase tracking-widest">Active & Valid</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-hst-teal/10 text-hst-teal rounded-2xl flex items-center justify-center">
                <IndianRupee size={24} />
              </div>
              <div>
                <p className="font-black text-hst-dark text-sm">FCRA Compliance</p>
                <p className="text-[10px] font-bold text-hst-teal uppercase tracking-widest">Report Filed</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-hst-dark/10 text-hst-dark rounded-2xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <p className="font-black text-hst-dark text-sm">Audit Log Trail</p>
                <p className="text-[10px] font-bold text-hst-dark/40 uppercase tracking-widest">100% Traceability</p>
              </div>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-hst-dark p-8 rounded-[40px] text-white space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[80px]" />
              <div className="relative z-10 space-y-4">
                <h4 className="text-lg font-black leading-tight">Generate Yearly 80G Summary</h4>
                <p className="text-white/60 text-xs font-medium leading-relaxed">
                  Prepare consolidated donation reports for income tax filing and compliance.
                </p>
                <button className="w-full py-4 bg-hst-teal text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-hst-dark transition-all">
                  Prepare Report
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;