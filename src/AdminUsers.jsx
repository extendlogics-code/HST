import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  Shield, 
  Mail, 
  Calendar, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Edit2, 
  Loader2,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import api from './api/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF',
    is_active: true
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedUser) {
        await api.patch(`/auth/users/${selectedUser.id}`, formData);
      } else {
        await api.post('/auth/users', formData);
      }
      setShowModal(false);
      setSelectedUser(null);
      setFormData({ name: '', email: '', password: '', role: 'STAFF', is_active: true });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.confirmPassword) {
      return alert('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.patch(`/auth/users/${selectedUser.id}/password`, { password: passwordData.password });
      setShowPasswordModal(false);
      setSelectedUser(null);
      setPasswordData({ password: '', confirmPassword: '' });
      alert('Password updated successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: !!user.is_active
    });
    setShowModal(true);
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  if (loading && users.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  return (
    <div className="font-sans text-hst-dark">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black mb-2">User <span className="text-hst-teal">Management</span></h1>
          <p className="text-gray-500 font-medium">Manage administrative and staff access</p>
        </div>
        <button 
          onClick={() => {
            setSelectedUser(null);
            setFormData({ name: '', email: '', password: '', role: 'STAFF', is_active: true });
            setShowModal(true);
          }}
          className="hst-gradient text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-hst-teal/20 hover:scale-105 transition-all"
        >
          <UserPlus size={20} />
          Create New User
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <motion.div 
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-hst-dark/5 group relative overflow-hidden"
          >
            {/* Role Badge */}
            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
              user.role === 'ADMIN' ? 'bg-hst-dark text-white' : 'bg-hst-teal text-white'
            }`}>
              {user.role === 'ADMIN' ? <ShieldAlert size={12} /> : <UserIcon size={12} />}
              {user.role}
            </div>

            <div className="flex items-start gap-5 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${
                user.is_active ? 'hst-gradient shadow-hst-teal/20' : 'bg-gray-300 shadow-gray-200'
              }`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black">{user.name}</h3>
                <p className="text-gray-400 font-medium text-sm flex items-center gap-2">
                  <Mail size={14} /> {user.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <div className={`flex items-center gap-2 font-bold text-sm ${user.is_active ? 'text-hst-green' : 'text-red-400'}`}>
                  {user.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {user.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Login</p>
                <div className="flex items-center gap-2 text-hst-dark font-bold text-sm">
                  <Calendar size={14} className="text-hst-teal" />
                  {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => openEditModal(user)}
                className="flex-1 py-3 bg-hst-light/50 text-hst-dark rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-hst-teal hover:text-white transition-all"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button 
                onClick={() => openPasswordModal(user)}
                className="flex-1 py-3 bg-hst-light/50 text-hst-dark rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-hst-dark hover:text-white transition-all"
              >
                <Key size={16} /> Password
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] w-full max-w-xl p-10 relative z-10 shadow-2xl"
          >
            <h2 className="text-3xl font-black mb-2">
              {selectedUser ? 'Edit' : 'Create'} <span className="text-hst-teal">User</span>
            </h2>
            <p className="text-gray-500 font-medium mb-8">Set permissions and account details</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    required
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {!selectedUser && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      required
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select 
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-bold appearance-none"
                    >
                      <option value="STAFF">STAFF</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Status</label>
                  <div className="flex items-center gap-4 py-4 px-6 bg-hst-light/30 rounded-2xl border-2 border-gray-100">
                    <input 
                      type="checkbox" 
                      name="is_active"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-6 h-6 rounded-lg accent-hst-teal"
                    />
                    <label htmlFor="is_active" className="font-bold text-hst-dark cursor-pointer">Account Active</label>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] hst-gradient text-white py-4 rounded-2xl font-black shadow-xl shadow-hst-teal/20 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (selectedUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-hst-dark/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] w-full max-w-md p-10 relative z-10 shadow-2xl"
          >
            <h2 className="text-3xl font-black mb-2">Change <span className="text-hst-teal">Password</span></h2>
            <p className="text-gray-500 font-medium mb-8">Update password for {selectedUser?.name}</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    required
                    type="password" 
                    value={passwordData.password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    required
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-hst-light/30 border-2 border-gray-100 focus:border-hst-teal/30 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-hst-dark text-white py-4 rounded-2xl font-black shadow-xl shadow-hst-dark/20 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;