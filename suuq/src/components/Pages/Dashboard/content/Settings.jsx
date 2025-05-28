import React, { useState } from 'react';
import { Pencil } from 'lucide-react'; // optional edit icon

export default function ProfileContent() {
  const [profile, setProfile] = useState({
    profilePicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s',
    name: 'Ayaan Ahmed',
    email: 'ayaan@example.com',
    password: '',
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log('Saving profile...', profile);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Update your profile preferences below.</p>
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center mb-6 relative">
        <div className="relative group">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-700 shadow-md object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Pencil className="text-white w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Settings Form in Cards */}
      <div className="space-y-6">
        {/* Name */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Email */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Password */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            placeholder="Leave blank to keep current"
          />
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Enable Notifications</span>
          <input
            type="checkbox"
            name="notifications"
            checked={profile.notifications}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600 dark:bg-gray-700"
          />
        </div>
{/* 
        Dark Mode
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
          <input
            type="checkbox"
            name="darkMode"
            checked={profile.darkMode}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600 dark:bg-gray-700"
          />
        </div> */}

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSave}
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
