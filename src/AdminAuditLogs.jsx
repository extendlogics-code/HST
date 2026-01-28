import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Activity, 
  Info, 
  Monitor, 
  Globe,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import api from './api/api';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, filterAction]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/audit-logs', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          action: filterAction,
          search: searchTerm
        }
      });
      if (data.success) {
        setLogs(data.data);
        setPagination(prev => ({ ...prev, total: data.total }));
      }
    } catch (err) {
      console.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('CREATE')) return 'text-hst-green bg-hst-green/10';
    if (action.includes('UPDATE')) return 'text-hst-teal bg-hst-teal/10';
    if (action.includes('DELETE') || action.includes('VOID')) return 'text-red-500 bg-red-50';
    if (action.includes('LOGIN')) return 'text-hst-dark bg-hst-dark/5';
    return 'text-gray-500 bg-gray-100';
  };

  const formatMeta = (meta) => {
    if (!meta) return null;
    try {
      const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return String(meta);
    }
  };

  return (
    <div className="font-sans text-hst-dark">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black mb-2">Audit <span className="text-hst-teal">Logs</span></h1>
          <p className="text-gray-500 font-medium">Trace all administrative actions for compliance</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search actor or entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchLogs()}
              className="pl-10 pr-4 py-3 bg-hst-light/30 rounded-xl outline-none focus:bg-white border-2 border-transparent focus:border-hst-teal/30 transition-all font-medium text-sm w-64"
            />
          </div>
          <select 
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-3 bg-hst-light/30 rounded-xl outline-none border-2 border-transparent focus:border-hst-teal/30 font-bold text-sm appearance-none cursor-pointer"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Logins</option>
            <option value="CREATE_DONOR">New Donors</option>
            <option value="CREATE_DONATION">New Donations</option>
            <option value="GENERATE_CERTIFICATE">Certificates</option>
            <option value="VOID_CERTIFICATE">Voided Certs</option>
            <option value="UPDATE_SETTINGS">Settings Changes</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-hst-dark/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Actor</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Entity</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin text-hst-teal mx-auto" size={40} />
                    <p className="text-gray-400 font-bold mt-4">Loading logs...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <History className="text-gray-200 mx-auto mb-4" size={60} />
                    <p className="text-gray-400 font-black text-xl">No logs found</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-hst-light/20 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-hst-dark">{new Date(log.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-hst-dark text-white flex items-center justify-center text-xs font-black">
                          {log.actor_name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-hst-dark text-sm">{log.actor_name || 'System'}</p>
                          <p className="text-[10px] font-medium text-gray-400">{log.ip_address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Database size={14} className="text-hst-teal" />
                        <span className="font-bold text-hst-dark text-sm">{log.entity_type}</span>
                        <span className="text-[10px] font-black text-gray-300">#{log.entity_id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-2 bg-hst-light/50 text-hst-dark rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-hst-teal hover:text-white"
                      >
                        <Info size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-400">
            Showing <span className="text-hst-dark">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="text-hst-dark">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-hst-dark">{pagination.total}</span> logs
          </p>
          <div className="flex gap-2">
            <button 
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              className="p-2 rounded-xl border border-gray-100 hover:bg-hst-light transition-all disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={pagination.page * pagination.limit >= pagination.total}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              className="p-2 rounded-xl border border-gray-100 hover:bg-hst-light transition-all disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl"
          >
            <div className="p-10 border-b border-gray-50 flex justify-between items-start">
              <div className="space-y-1">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block ${getActionColor(selectedLog.action)}`}>
                  {selectedLog.action.replace(/_/g, ' ')}
                </span>
                <h2 className="text-3xl font-black">Action <span className="text-hst-teal">Details</span></h2>
                <p className="text-gray-500 font-medium">Full trace metadata for this event</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Timestamp</p>
                <p className="font-black text-hst-dark">{new Date(selectedLog.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <User size={12} /> Actor Information
                  </div>
                  <div className="p-4 bg-hst-light/30 rounded-2xl border border-gray-100">
                    <p className="font-black text-hst-dark">{selectedLog.actor_name || 'System'}</p>
                    <p className="text-xs font-bold text-gray-500 mt-1">ID: {selectedLog.actor_user_id || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Monitor size={12} /> Environment
                  </div>
                  <div className="p-4 bg-hst-light/30 rounded-2xl border border-gray-100">
                    <p className="font-black text-hst-dark">{selectedLog.ip_address}</p>
                    <p className="text-[10px] font-medium text-gray-500 mt-1 truncate max-w-full" title={selectedLog.user_agent}>
                      {selectedLog.user_agent}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Activity size={12} /> Metadata Changes
                </div>
                <div className="p-6 bg-hst-dark rounded-3xl border border-gray-800 shadow-inner max-h-60 overflow-y-auto custom-scrollbar">
                  <pre className="text-hst-teal font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    {formatMeta(selectedLog.meta) || '// No additional metadata recorded'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-10 bg-hst-light/20 flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-10 py-4 bg-hst-dark text-white rounded-2xl font-black shadow-xl shadow-hst-dark/20 hover:scale-105 transition-all"
              >
                Close Trace
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;