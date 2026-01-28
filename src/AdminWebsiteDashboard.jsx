import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Users, 
  MousePointer2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  Search,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';

import api from './api/api';

const AdminWebsiteDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [viewingFullReport, setViewingFullReport] = useState(false);
  const [viewingMap, setViewingMap] = useState(false);
  const [stats, setStats] = useState({
    totalVisits: '0',
    uniqueVisitors: '0',
    avgSessionTime: 'N/A',
    bounceRate: 'N/A',
    visitTrend: '+0%',
    visitorTrend: '+0%',
    topPages: [],
    devices: [],
    locations: [{ country: 'Local', visits: '100%', flag: '📍' }],
    recentVisitors: []
  });

  const fetchStats = async (range) => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/stats?range=${range}`);
      if (response.data.success) {
        const rawData = response.data.data;
        
        // Transform backend data to frontend format
        setStats({
          totalVisits: rawData.totalVisits.toLocaleString(),
          uniqueVisitors: rawData.uniqueVisitors.toLocaleString(),
          avgSessionTime: 'N/A',
          bounceRate: 'N/A',
          visitTrend: '+0%',
          visitorTrend: '+0%',
          topPages: rawData.topPages.map(p => ({
            path: p.path,
            views: p.count.toLocaleString(),
            change: '+0%'
          })),
          devices: rawData.devices.map(d => {
            let icon = Monitor;
            let type = d.type || 'desktop';
            if (type === 'mobile') icon = Smartphone;
            if (type === 'tablet') icon = Tablet;
            
            return {
              type: type.charAt(0).toUpperCase() + type.slice(1),
              icon,
              percentage: Math.round((d.count / rawData.totalVisits) * 100) || 0,
              color: type === 'mobile' ? 'bg-hst-teal' : (type === 'desktop' ? 'bg-hst-dark' : 'bg-hst-green')
            };
          }),
          locations: [
            { country: 'Local', visits: '100%', flag: '📍' }
          ],
          recentVisitors: rawData.recentVisitors
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(timeRange);
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const statCards = [
    {
      label: 'Total Page Views',
      value: stats.totalVisits,
      icon: Eye,
      color: 'bg-hst-teal',
      trend: stats.visitTrend,
      trendUp: true
    },
    {
      label: 'Unique Visitors',
      value: stats.uniqueVisitors,
      icon: Users,
      color: 'bg-hst-dark',
      trend: stats.visitorTrend,
      trendUp: true
    },
    {
      label: 'Avg. Session',
      value: stats.avgSessionTime,
      icon: Clock,
      color: 'bg-hst-green',
      trend: '+0%',
      trendUp: true
    },
    {
      label: 'Bounce Rate',
      value: stats.bounceRate,
      icon: MousePointer2,
      color: 'bg-orange-500',
      trend: '+0%',
      trendUp: true
    }
  ];

  if (loading && !stats.totalVisits) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-hst-teal/20 border-t-hst-teal rounded-full animate-spin" />
          <p className="text-xs font-black text-hst-teal uppercase tracking-widest">Gathering Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-hst-dark pb-12 relative">
      {/* Modal Overlay for Full Report / Map */}
      <AnimatePresence>
        {(viewingFullReport || viewingMap) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-hst-dark/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => { setViewingFullReport(false); setViewingMap(false); }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-hst-teal/5 rounded-bl-[120px]" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-hst-teal rounded-3xl flex items-center justify-center text-white shadow-xl shadow-hst-teal/20">
                    {viewingFullReport ? <BarChart3 size={32} /> : <MapPin size={32} />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">{viewingFullReport ? 'Analytics Report' : 'Global Distribution'}</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Detailed Insights • Live Data</p>
                  </div>
                </div>
                
                <div className="p-8 bg-hst-light/30 rounded-3xl border border-gray-100 max-h-[400px] overflow-y-auto">
                  {viewingFullReport ? (
                    <div className="space-y-4">
                      <h4 className="text-sm font-black uppercase tracking-widest text-hst-dark mb-4">Recent Activity</h4>
                      {stats.recentVisitors.length > 0 ? (
                        <div className="space-y-3">
                          {stats.recentVisitors.map((v, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-50 flex justify-between items-center text-[11px]">
                              <div className="space-y-1">
                                <div className="font-black text-hst-dark flex items-center gap-2">
                                  <span className="text-hst-teal">{v.ip_address}</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-gray-500 uppercase">{v.browser} / {v.os}</span>
                                </div>
                                <div className="text-gray-400 font-medium">
                                  Visited <span className="text-hst-dark font-bold">{v.path}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-gray-400 font-bold">{new Date(v.created_at).toLocaleTimeString()}</div>
                                <div className="text-[9px] text-gray-300 font-medium">{new Date(v.created_at).toLocaleDateString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-hst-dark font-medium leading-relaxed">No recent visitor data available yet.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-hst-dark font-medium leading-relaxed">
                      We're mapping your visitors across 12+ countries. Most traffic currently originates from tier-1 and tier-2 cities in India, with growing engagement from North America.
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => { setViewingFullReport(false); setViewingMap(false); }}
                    className="flex-1 py-4 bg-hst-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-hst-teal transition-all shadow-lg shadow-hst-dark/10"
                  >
                    Close Preview
                  </button>
                  {viewingFullReport && (
                    <button className="flex-1 py-4 border-2 border-hst-teal text-hst-teal rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-hst-teal hover:text-white transition-all">
                      Export PDF
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2">Website <span className="text-hst-teal">Analytics</span></h1>
          <p className="text-gray-500 font-medium">Monitoring digital reach and visitor engagement</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <button 
            onClick={() => handleTimeRangeChange('30d')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              timeRange === '30d' 
                ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/20' 
                : 'text-gray-400 hover:text-hst-teal'
            }`}
          >
            Last 30 Days
          </button>
          <button 
            onClick={() => handleTimeRangeChange('90d')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              timeRange === '90d' 
                ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/20' 
                : 'text-gray-400 hover:text-hst-teal'
            }`}
          >
            Last 90 Days
          </button>
          <button 
            onClick={() => handleTimeRangeChange('all')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              timeRange === 'all' 
                ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/20' 
                : 'text-gray-400 hover:text-hst-teal'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-hst-dark/5 relative overflow-hidden group"
          >
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-hst-teal/20 border-t-hst-teal rounded-full animate-spin" />
              </div>
            )}
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 rounded-bl-[60px] group-hover:scale-110 transition-transform`} />
            <div className="relative z-10 space-y-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h2 className="text-3xl font-black text-hst-dark">{stat.value}</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  stat.trendUp ? 'bg-hst-green/10 text-hst-green' : 'bg-red-50 text-red-400'
                }`}>
                  {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">vs last period</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Pages */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black flex items-center gap-3">
              <TrendingUp className="text-hst-teal" size={24} />
              Most Visited Pages
            </h3>
            <button 
              onClick={() => setViewingFullReport(true)}
              className="text-[10px] font-black text-hst-teal uppercase tracking-widest hover:text-hst-dark transition-colors flex items-center gap-2"
            >
              Full Report <ChevronRight size={14} />
            </button>
          </div>
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-hst-dark/5 overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-hst-teal/20 border-t-hst-teal rounded-full animate-spin" />
              </div>
            )}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-hst-light/30">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Page Path</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Page Views</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Trend</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.topPages.map((page, i) => (
                  <tr key={i} className="hover:bg-hst-light/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-hst-light text-hst-teal flex items-center justify-center">
                          <Globe size={16} />
                        </div>
                        <span className="font-bold text-hst-dark text-sm">{page.path}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-hst-dark text-sm">{page.views}</td>
                    <td className="px-8 py-5">
                      <span className={`text-xs font-bold ${page.change.startsWith('+') ? 'text-hst-green' : 'text-red-400'}`}>
                        {page.change}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <a 
                        href={page.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-300 hover:text-hst-teal transition-colors inline-block"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device & Location Breakdowns */}
        <div className="space-y-8">
          {/* Device Usage */}
          <div className="space-y-6">
            <h3 className="text-xl font-black flex items-center gap-3 px-4">
              <BarChart3 className="text-hst-dark" size={24} />
              Device Traffic
            </h3>
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-hst-dark/5 space-y-6 relative overflow-hidden">
              {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-hst-teal/20 border-t-hst-teal rounded-full animate-spin" />
                </div>
              )}
              {stats.devices.map((device, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <device.icon size={16} className="text-gray-400" />
                      <span className="text-xs font-black text-hst-dark uppercase tracking-wider">{device.type}</span>
                    </div>
                    <span className="text-xs font-black text-hst-teal">{device.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className={`h-full ${device.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographical Reach */}
          <div className="space-y-6">
            <h3 className="text-xl font-black flex items-center gap-3 px-4">
              <MapPin className="text-hst-green" size={24} />
              Geo Reach
            </h3>
            <div className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-xl shadow-hst-dark/5 relative overflow-hidden">
              {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-hst-teal/20 border-t-hst-teal rounded-full animate-spin" />
                </div>
              )}
              <div className="space-y-4">
                {stats.locations.map((loc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-hst-light/20 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className="text-xl group-hover:scale-125 transition-transform">{loc.flag}</span>
                      <span className="text-sm font-bold text-hst-dark">{loc.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-hst-teal">{loc.visits}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-hst-green" />
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setViewingMap(true)}
                className="w-full mt-6 py-4 border-2 border-dashed border-gray-100 text-gray-400 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:border-hst-teal hover:text-hst-teal transition-all"
              >
                View Detailed Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWebsiteDashboard;
