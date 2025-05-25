import React, { useState } from 'react';
import { 
  User, Shield, Bell, Moon, 
  Save, Upload, Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  
  // Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'admin',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    expiryReminders: true,
    newMembers: true,
    paymentAlerts: true,
  });
  
  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };
  
  // Handle notification changes
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button className="btn-primary btn-sm">
          <Save size={16} className="mr-1" />
          Save Changes
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              <button
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md w-full ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} className="mr-3" />
                Profile
              </button>
              
              <button
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md w-full ${
                  activeTab === 'security'
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Shield size={18} className="mr-3" />
                Security
              </button>
              
              <button
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md w-full ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} className="mr-3" />
                Notifications
              </button>
              
              <button
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md w-full ${
                  activeTab === 'appearance'
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                }`}
                onClick={() => setActiveTab('appearance')}
              >
                <Moon size={18} className="mr-3" />
                Appearance
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Profile Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-4">
                      {profileForm.name.charAt(0)}
                    </div>
                    <div>
                      <button className="btn-outline btn-sm">
                        <Upload size={16} className="mr-1" />
                        Upload Photo
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        className="input"
                        value={profileForm.role}
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Role cannot be changed. Contact system administrator for role changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="input"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="input"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="input"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <button className="btn-primary btn-sm">
                      Update Password
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-medium mb-3">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <button className="btn-outline btn-sm">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Alerts</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Receive system alerts via email
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailAlerts"
                        name="emailAlerts"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={notificationSettings.emailAlerts}
                        onChange={handleNotificationChange}
                      />
                      <label htmlFor="emailAlerts" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {notificationSettings.emailAlerts ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Membership Expiry Reminders</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Get notified when memberships are about to expire
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="expiryReminders"
                        name="expiryReminders"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={notificationSettings.expiryReminders}
                        onChange={handleNotificationChange}
                      />
                      <label htmlFor="expiryReminders" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {notificationSettings.expiryReminders ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">New Member Notifications</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Receive alerts when new members join
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newMembers"
                        name="newMembers"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={notificationSettings.newMembers}
                        onChange={handleNotificationChange}
                      />
                      <label htmlFor="newMembers" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {notificationSettings.newMembers ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Payment Alerts</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Get notified about payment issues or overdue payments
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="paymentAlerts"
                        name="paymentAlerts"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={notificationSettings.paymentAlerts}
                        onChange={handleNotificationChange}
                      />
                      <label htmlFor="paymentAlerts" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {notificationSettings.paymentAlerts ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                          darkMode ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className="sr-only">Toggle dark mode</span>
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            darkMode ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        ></span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-medium mb-3">Data Export</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Export your system data for backup or analysis
                    </p>
                    <div className="flex space-x-3">
                      <button className="btn-outline btn-sm flex items-center">
                        <Download size={16} className="mr-1" />
                        Export Members
                      </button>
                      <button className="btn-outline btn-sm flex items-center">
                        <Download size={16} className="mr-1" />
                        Export All Data
                      </button>
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

export default Settings;