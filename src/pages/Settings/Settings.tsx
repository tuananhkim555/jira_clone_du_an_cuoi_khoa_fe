import React, { useState } from 'react';
import { FaCog, FaUser, FaBell, FaLock, FaPalette, FaSave } from 'react-icons/fa';
import TextAnimation from '../../common/components/ui/TextAnimation';
import { motion } from 'framer-motion';
import TitleGradient from '../../common/components/ui/TitleGradient';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', icon: FaCog, label: 'General' },
    { id: 'account', icon: FaUser, label: 'Account' },
    { id: 'notifications', icon: FaBell, label: 'Notifications' },
    { id: 'security', icon: FaLock, label: 'Security' },
    { id: 'appearance', icon: FaPalette, label: 'Appearance' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-[50px] md:mt-0">
      <motion.div 
        className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar */}
          <div className="md:w-1/3 bg-gray-50 p-8">
            <TitleGradient>Settings</TitleGradient>
            <nav className="mt-8 space-y-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full py-3 px-4 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-950 text-white'
                      : 'text-gray-600 hover:bg-purple-90'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="mr-3 text-lg" />
                  <TextAnimation text={tab.label} />
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3 p-8 flex flex-col">
            <TextAnimation 
              text={tabs.find((tab) => tab.id === activeTab)?.label || ''}
              className="text-3xl font-semibold mb-8 text-gray-800"
            />
            
            {/* Content for demonstration */}
            <div className="flex-grow space-y-8">
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-lg text-gray-700">Theme</span>
                <select className="form-select bg-gray-100 border-gray-300 rounded-md px-4 py-2">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-lg text-gray-700">Language</span>
                <select className="form-select bg-gray-100 border-gray-300 rounded-md px-4 py-2">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-700">Notifications</span>
                <label className="switch relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-purple-900 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-900"></div>
                </label>
              </div>
            </div>

            <div className="mt-8">
              <button className="w-full md:w-auto px-4 py-3 flex items-center justify-center bg-gradient-to-r from-purple-900 to-orange-800 text-white rounded-lg hover:from-purple-800 hover:to-orange-700 text-md font-semibold transition-all duration-500 ease-in-out hover:scale-105">
                <FaSave className="mr-3" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
