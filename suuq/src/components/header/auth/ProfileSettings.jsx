import React, { useState, useEffect } from 'react';
import { TrashIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Alert from '../../other/Alert';

function ProfileSettings({
  
  currentUser,
  onLogout = async() => {
    console.log('Logouting ...');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Ensure cookies are sent with the request
    });
    if (response.ok) {
      console.log('Logout successful');
      location.reload();
    } else {
      console.error('Logout failed');
    }
  },

}) {
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || '',
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
    new_password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // State for Alert
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        full_name: currentUser.full_name || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    // If user wants to update password
    if (showPasswordFields && formData.new_password) {
      if (!formData.password) newErrors.password = 'Enter your current password';
      if (formData.new_password.length < 8) newErrors.new_password = 'At least 8 characters required';
      if (formData.new_password !== formData.confirm_password)
        newErrors.confirm_password = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    // Build our payload
    const updatePayload = {
      full_name: formData.full_name,
      username: formData.username,
      email: formData.email,
    };
    if (showPasswordFields && formData.new_password) {
      updatePayload.password = formData.password;
      updatePayload.new_password = formData.new_password;
    }
    try {
      // Send PUT request to Flask server
      const response = await fetch('/api/auth/profile/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update profile');
      }
      const data = await response.json();

      // Show success alert
      setAlert({ show: true, message: 'Profile updated successfully!', type: 'success' });
      
      
      
      // Reset password fields after update
      setFormData(prev => ({
        ...prev,
        password: '',
        new_password: '',
        confirm_password: '',
      }));
      setShowPasswordFields(false);
    } catch (error) {
      console.error('Error updating profile', error);
      setErrors(prev => ({ ...prev, submit: error.message || 'Failed to update profile' }));
      // Show error alert
      setAlert({ show: true, message: error.message || 'Profile update failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to delete account');
      }
      window.alert('Account deletion successful.');
      // Redirect or update state after deletion
      window.location.href = '/logout'; // Example redirect
    } catch (error) {
      console.error('Error deleting account:', error);
      window.alert(error.message || 'Failed to delete account');
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <>
      {/* Alert Component */}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.show}
        onClose={() => setAlert({ show: false, type: 'success', message: '' })}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Change */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Password
            </h3>
            {!showPasswordFields ? (
              <button
                type="button"
                onClick={() => setShowPasswordFields(true)}
                className="text-blue-600 hover:underline"
              >
                Change Password
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500"
                  />
                  {errors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500"
                  />
                  {errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.submit && (
            <p className="text-sm text-red-600">{errors.submit}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-3 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium text-red-700 bg-white border border-red-300 hover:bg-red-50 focus:outline-none"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete Account
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </form>
    </>
  );
}

export default ProfileSettings;
