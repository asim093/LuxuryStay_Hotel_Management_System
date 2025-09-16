import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Key, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  Clock, 
  Activity, 
  LogIn, 
  LogOut, 
  Smartphone,
  Globe,
  Lock,
  UserCheck,
  Building,
  Briefcase,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'react-toastify';

const UserProfilePage = () => {
  const token = useSelector((state) => state.user.token);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [profileData, setProfileData] = useState({
    // Basic Info
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@hotel.com',
    phone: '+92-300-1234567',
    address: 'House 123, Block A, Gulshan-e-Iqbal, Karachi',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    nationality: 'Pakistani',
    
    // Professional Info
    employeeId: 'EMP001',
    role: 'Hotel Manager',
    department: 'Management',
    joinDate: '2020-01-15',
    salary: 80000,
    emergencyContact: 'Sara Hassan',
    emergencyPhone: '+92-301-9876543',
    
    // Profile Image
    profileImage: null,
    
    // Account Settings
    language: 'English',
    timezone: 'Asia/Karachi',
    currency: 'PKR',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    
    // Security Settings
    twoFactorEnabled: false,
    passwordLastChanged: '2024-01-15',
    lastLogin: new Date().toISOString(),
    
    // Activity Stats
    totalLogins: 342,
    tasksCompleted: 156,
    bookingsHandled: 89,
    rating: 4.8
  });

  const [activityLog, setActivityLog] = useState([
    {
      id: 1,
      action: 'Login',
      description: 'Logged into the system',
      timestamp: new Date().toISOString(),
      ip: '192.168.1.100',
      device: 'Chrome on Windows'
    },
    {
      id: 2,
      action: 'Booking Created',
      description: 'Created booking BK001 for Ahmed Ali',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ip: '192.168.1.100',
      device: 'Chrome on Windows'
    },
    {
      id: 3,
      action: 'Profile Updated',
      description: 'Updated contact information',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      ip: '192.168.1.100',
      device: 'Chrome on Windows'
    }
  ]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
        toast.success('Profile image updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditing(prev => ({
        ...prev,
        [section]: false
      }));
      
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (section) => {
    setEditing(prev => ({
      ...prev,
      [section]: false
    }));
    // Reset form data logic here if needed
  };

  const toggleEdit = (section) => {
    setEditing(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      setProfileData(prev => ({
        ...prev,
        passwordLastChanged: new Date().toISOString()
      }));
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileData(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled
      }));
      toast.success(`Two-factor authentication ${profileData.twoFactorEnabled ? 'disabled' : 'enabled'}`);
    } catch (error) {
      toast.error('Failed to update two-factor authentication');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'profile-data.json';
    link.click();
    toast.success('Profile data exported successfully');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'account', name: 'Account', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'stats', name: 'Statistics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                    {profileData.profileImage ? (
                      <img 
                        src={profileData.profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profileData.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                    <Camera size={14} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                  <p className="text-lg text-gray-600">{profileData.role}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Building size={14} />
                    {profileData.department} • ID: {profileData.employeeId}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors gap-2"
              >
                <Download size={16} />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Logins</p>
                <p className="text-2xl font-bold text-indigo-600">{profileData.totalLogins}</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <LogIn className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Done</p>
                <p className="text-2xl font-bold text-green-600">{profileData.tasksCompleted}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{profileData.bookingsHandled}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{profileData.rating}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm rounded-t-lg flex items-center gap-2`}
                  >
                    <TabIcon size={16} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <button
                      onClick={() => toggleEdit('personal')}
                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <Edit size={16} />
                      {editing.personal ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {editing.personal ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      {editing.personal ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-gray-900 flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          {profileData.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      {editing.personal ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-gray-900 flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          {profileData.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      {editing.personal ? (
                        <input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-gray-900 flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {new Date(profileData.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      {editing.personal ? (
                        <textarea
                          value={profileData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          rows={3}
                          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-gray-900 flex items-start gap-2">
                          <MapPin size={16} className="text-gray-400 mt-0.5" />
                          {profileData.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {editing.personal && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleSave('personal')}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 gap-2"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save size={16} />
                        )}
                        Save Changes
                      </button>
                      <button
                        onClick={() => handleCancel('personal')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                    <button
                      onClick={() => toggleEdit('professional')}
                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <Edit size={16} />
                      {editing.professional ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                      <p className="text-gray-900 font-mono">{profileData.employeeId}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      {editing.professional ? (
                        <select
                          value={profileData.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="Hotel Manager">Hotel Manager</option>
                          <option value="Receptionist">Receptionist</option>
                          <option value="Housekeeping">Housekeeping</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 flex items-center gap-2">
                          <Briefcase size={16} className="text-gray-400" />
                          {profileData.role}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <p className="text-gray-900">{profileData.department}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                      <p className="text-gray-900">{new Date(profileData.joinDate).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                      {editing.professional ? (
                        <input
                          type="text"
                          value={profileData.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.emergencyContact}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                      {editing.professional ? (
                        <input
                          type="tel"
                          value={profileData.emergencyPhone}
                          onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.emergencyPhone}</p>
                      )}
                    </div>
                  </div>

                  {editing.professional && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleSave('professional')}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 gap-2"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save size={16} />
                        )}
                        Save Changes
                      </button>
                      <button
                        onClick={() => handleCancel('professional')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={profileData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="English">English</option>
                        <option value="Urdu">Urdu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Asia/Karachi">Pakistan (UTC+5)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        value={profileData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="PKR">Pakistani Rupee (PKR)</option>
                        <option value="USD">US Dollar (USD)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave('account')}
                    disabled={loading}
                    className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Password Change */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.current ? 'text' : 'password'}
                          className="block w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('current')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          className="block w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('new')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          className="block w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('confirm')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 gap-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Key size={16} />
                      )}
                      Change Password
                    </button>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p>Password last changed: {new Date(profileData.passwordLastChanged).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.twoFactorEnabled}
                        onChange={handleToggle2FA}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>

                {/* Login Sessions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Smartphone size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Chrome on Windows</p>
                          <p className="text-sm text-gray-600">192.168.1.100 • Current session</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.emailNotifications}
                          onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.smsNotifications}
                          onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-600">Receive browser push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.pushNotifications}
                          onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Marketing Emails</p>
                        <p className="text-sm text-gray-600">Receive promotional emails</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.marketingEmails}
                          onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave('notifications')}
                    disabled={loading}
                    className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  
                  <div className="space-y-4">
                    {activityLog.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Activity size={16} className="text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <span className="text-sm text-gray-500">
                              {new Date(activity.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Globe size={12} />
                              {activity.ip}
                            </span>
                            <span className="flex items-center gap-1">
                              <Smartphone size={12} />
                              {activity.device}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Performance Overview */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border text-center">
                      <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{profileData.totalLogins}</p>
                      <p className="text-sm text-gray-600">Total Logins</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border text-center">
                      <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">{profileData.tasksCompleted}</p>
                      <p className="text-sm text-gray-600">Tasks Completed</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border text-center">
                      <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{profileData.bookingsHandled}</p>
                      <p className="text-sm text-gray-600">Bookings Handled</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border text-center">
                      <div className="p-3 bg-yellow-100 rounded-full w-fit mx-auto mb-3">
                        <Star className="h-6 w-6 text-yellow-600" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">{profileData.rating}</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                  </div>
                </div>

                {/* Monthly Performance */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
                  
                  <div className="bg-white p-6 rounded-lg border">
                    <div className="text-center text-gray-500">
                      <PieChart className="h-12 w-12 mx-auto mb-2" />
                      <p>Performance charts would be displayed here</p>
                      <p className="text-sm">Integration with charting library required</p>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border flex items-center gap-4">
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Employee of the Month</p>
                        <p className="text-sm text-gray-600">January 2024</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Star className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">100 Tasks Completed</p>
                        <p className="text-sm text-gray-600">December 2023</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Perfect Attendance</p>
                        <p className="text-sm text-gray-600">2023</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <UserCheck className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Customer Satisfaction</p>
                        <p className="text-sm text-gray-600">4.8+ Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;