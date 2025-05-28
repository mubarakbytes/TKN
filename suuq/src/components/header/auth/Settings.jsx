import React, { useState, useEffect, useCallback } from 'react';
import Popup from '../../other/Popup';
import Alert from '../../other/Alert';
import { CameraIcon, TrashIcon, ArrowRightOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { DEFAULT_PROFILE_IMAGE } from '../../../utils/constants';
import StoreSetting from './StoreSetting'; // Assuming this component exists
import ProfileSettings from './ProfileSettings'; // Assuming this component exists

// Centralized API endpoints for clarity and easy modification
const API_ENDPOINTS = {
  UPDATE_PROFILE: '/api/auth/profile/update-profile',
  UPDATE_PASSWORD: '/api/auth/profile/update-password',
  DELETE_ACCOUNT: '/api/auth/profile/delete-account',
  CREATE_STORE: '/api/auth/profile/create-store' // Assuming this is for creating a new store
};

/**
 * Settings component for managing user profile and store settings.
 * It handles form data, validation, API calls, and displays alerts.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls the visibility of the settings popup.
 * @param {function} props.onClose - Callback function to close the settings popup.
 * @param {object} props.currentUser - The current authenticated user object.
 * @param {function} props.onUpdateProfile - Callback function to update user data in the parent component.
 * @param {function} props.onCreateStore - Callback function for creating a new store.
 * @param {function} props.onLogout - Callback function to log out the user.
 */
const Settings = ({ isOpen, onClose, currentUser, onUpdateProfile, onCreateStore, onLogout }) => {
  // State to manage the currently active tab ('profile' or 'store')
  const [activeTab, setActiveTab] = useState('profile');

  // State to manage form input values
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '', // Current password for updating password
    new_password: '',
    confirm_password: '',
    profile_image: null, // File object for new profile image upload
  });

  // State for validation errors
  const [errors, setErrors] = useState({});
  // State to indicate loading status during API calls
  const [loading, setLoading] = useState(false);
  // State to control the visibility of the delete account confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // State for displaying alert messages (success/error)
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  // Effect to initialize or reset form data when the currentUser prop changes.
  // This ensures the form always reflects the latest user information.
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        full_name: currentUser.full_name || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        // Clear password fields on user change to prevent pre-filling
        password: '',
        new_password: '',
        confirm_password: '',
        profile_image: null, // Clear any pending image selection
      }));
    } else {
      // Clear all form data if currentUser becomes null (e.g., after logout)
      setFormData({
        full_name: '',
        username: '',
        email: '',
        password: '',
        new_password: '',
        confirm_password: '',
        profile_image: null,
      });
      // Also reset active tab if user logs out while on store settings
      setActiveTab('profile');
    }
  }, [currentUser]);

  /**
   * Handles changes for all text input fields in the form.
   * Updates the formData state and clears any related validation errors.
   * @param {object} e - The event object from the input change.
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the specific error message for the field being typed into
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]); // Dependency on errors ensures it uses the latest errors state

  /**
   * Handles changes for the profile image file input.
   * Validates file size and updates the formData state with the selected file.
   * @param {object} e - The event object from the file input change.
   */
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, profile_image: 'Image must be less than 5MB.' }));
        setFormData(prev => ({ ...prev, profile_image: null })); // Clear selected file
        return;
      }
      setFormData(prev => ({ ...prev, profile_image: file }));
      setErrors(prev => ({ ...prev, profile_image: '' })); // Clear any previous image errors
    } else {
      setFormData(prev => ({ ...prev, profile_image: null })); // Clear image if no file selected
    }
  }, []);

  /**
   * Validates the profile settings form fields.
   * Sets specific error messages in the `errors` state if validation fails.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateProfileForm = useCallback(() => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required.';
    if (!formData.username.trim()) newErrors.username = 'Username is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format.';

    // Password validation is conditional: only if new_password is being set
    if (formData.new_password) {
      if (!formData.password) newErrors.password = 'Current password is required to set a new password.';
      if (formData.new_password.length < 8) newErrors.new_password = 'New password must be at least 8 characters long.';
      if (formData.new_password !== formData.confirm_password) newErrors.confirm_password = 'New passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors were found
  }, [formData]); // Dependencies ensure validation uses the latest formData

  /**
   * Placeholder for store form validation.
   * This function would be implemented if `storeData` was managed directly
   * within this `Settings` component. If `StoreSetting` manages its own state
   * and validation, this function might not be needed here, or it would
   * trigger validation within `StoreSetting` via a ref or prop.
   * @returns {boolean} Always true for now as it's a placeholder.
   */
  const validateStoreForm = useCallback(() => {
    const newErrors = {};
    // Example: if storeData were part of this component's state:
    // if (!storeData.name.trim()) newErrors.store_name = 'Store name is required';
    // ... more store-specific validation ...
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []); // No dependencies as it's a placeholder

  /**
   * Displays an alert message to the user.
   * @param {string} type - The type of alert ('success' or 'error').
   * @param {string} message - The message content for the alert.
   */
  const showAlert = useCallback((type, message) => {
    setAlert({ show: true, type, message });
    // Auto-hide the alert after 3 seconds
    const timer = setTimeout(() => {
      setAlert({ show: false, type: 'success', message: '' });
    }, 3000);
    return () => clearTimeout(timer); // Cleanup timeout on unmount or re-render
  }, []);

  /**
   * Submits profile updates to the backend API.
   * @param {object} profileData - The data to send for profile update.
   * @param {Array<string>} updatedFields - List of fields that were actually changed.
   * @returns {Promise<void>} A promise that resolves on successful update.
   */
  const submitProfileUpdate = useCallback(async (profileData, updatedFields) => {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies/session
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!response.ok) {
        // If response is not OK, throw an error with the backend's message
        throw new Error(data.error || 'Failed to update profile.');
      }

      // Call the parent's onUpdateProfile to update the global user state
      if (onUpdateProfile) {
        onUpdateProfile(data.user);
      }

      setErrors({}); // Clear all form errors on successful submission
      showAlert('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error submitting profile update:', error);
      setErrors(prev => ({ ...prev, submit: error.message }));
      showAlert('error', error.message || 'Failed to update profile.');
      throw error; // Re-throw the error to be caught by the main handleSubmit try/catch
    }
  }, [onUpdateProfile, showAlert]); // Dependencies for useCallback

  /**
   * Handles the submission of the entire settings form (profile and potentially password).
   * @param {object} e - The event object from the form submission.
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate the profile form first
    if (!validateProfileForm()) {
      showAlert('error', 'Please correct the errors in the profile form before submitting.');
      return;
    }

    setLoading(true); // Set loading state to true during submission
    try {
      const profileDataToUpdate = {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email
      };

      // Determine which fields have changed to send minimal data to the backend
      const updatedFields = [];
      if (currentUser) { // Ensure currentUser exists before comparing
        if (formData.full_name !== currentUser.full_name) updatedFields.push('name');
        if (formData.username !== currentUser.username) updatedFields.push('username');
        if (formData.email !== currentUser.email) updatedFields.push('email');
      }

      // Handle profile image update if a new file has been selected
      if (formData.profile_image) {
        updatedFields.push('profile image');
        const reader = new FileReader();
        reader.readAsDataURL(formData.profile_image);
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            profileDataToUpdate.profile_image = reader.result;
            resolve();
          };
          reader.onerror = reject;
        });
      }

      // Execute profile data update
      await submitProfileUpdate(profileDataToUpdate, updatedFields);

      // If new password fields are filled, attempt to update the password
      if (formData.new_password) {
        await handlePasswordUpdate(); // Call the password update function
      }
    } catch (error) {
      // Error caught from submitProfileUpdate or handlePasswordUpdate
      console.error('An error occurred during settings submission:', error);
      // Specific error messages are handled by submitProfileUpdate/handlePasswordUpdate's showAlert
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [formData, currentUser, validateProfileForm, submitProfileUpdate, showAlert]); // Dependencies for useCallback

  /**
   * Handles the password update API call.
   * Clears password fields on success.
   */
  const handlePasswordUpdate = useCallback(async () => {
    setLoading(true); // Set loading state
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          current_password: formData.password,
          new_password: formData.new_password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }
      showAlert('success', 'Password updated successfully!');
      // Clear password fields after successful update for security
      setFormData(prev => ({ ...prev, password: '', new_password: '', confirm_password: '' }));
    } catch (error) {
      console.error('Error updating password:', error);
      setErrors(prev => ({ ...prev, password_update: error.message }));
      showAlert('error', error.message || 'Failed to update password.');
      throw error; // Re-throw to be caught by the main handleSubmit try/catch
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [formData.password, formData.new_password, showAlert]); // Dependencies for useCallback

  /**
   * Handles the account deletion process.
   * Displays a confirmation, then calls the delete API and logs out the user.
   */
  const handleDeleteAccount = useCallback(async () => {
    setShowDeleteConfirm(false); // Close confirmation dialog immediately
    setLoading(true); // Set loading state
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_ACCOUNT, {
        method: 'POST',
        credentials: 'include', // Important for authentication
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account.');
      }
      showAlert('success', 'Account deleted successfully!');
      if (onLogout) {
        onLogout(); // Call parent's logout function
      }
      onClose(); // Close the settings popup after deletion and logout
    } catch (error) {
      console.error('Error deleting account:', error);
      showAlert('error', error.message || 'Failed to delete account.');
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [onLogout, onClose, showAlert]); // Dependencies for useCallback

  /**
   * Helper function to determine the correct profile image URL.
   * Handles cases for new file uploads (Blob URL), base64 strings, and default image.
   * @param {object} user - The user object containing profile_image.
   * @returns {string} The URL for the profile image.
   */
  const getProfileImageUrl = useCallback((user) => {
    if (!user) return DEFAULT_PROFILE_IMAGE;

    try {
      if (user.profile_image) {
        // Check if the image data is already a data URL (e.g., from a previous upload)
        if (user.profile_image.startsWith('data:image')) {
          return user.profile_image;
        }
        // Assume it's a base64 string and prepend the data URL prefix
        return `data:image/jpeg;base64,${user.profile_image}`;
      }
      return DEFAULT_PROFILE_IMAGE; // Fallback if no profile_image is set
    } catch (error) {
      console.error('Error processing profile image:', error);
      return DEFAULT_PROFILE_IMAGE; // Fallback on error
    }
  }, []); // No dependencies needed as it only depends on the `user` parameter

  // Debugging log: Safely checks if currentUser exists before accessing is_seller
  console.log("is seller: ", currentUser ? currentUser.is_seller : "currentUser is null");

  return (
    <>
      {/* Alert component for displaying success/error messages */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          isOpen={alert.show} // Alert component needs to know its own visibility
          onClose={() => setAlert({ show: false, type: 'success', message: '' })}
          autoClose={true} // Automatically close the alert after a delay
        />
      )}

      {/* Main Popup container for settings */}
      <Popup isOpen={isOpen} onClose={onClose} title="Account Settings">
        <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
          {/* Profile Header Section: Displays user's image and basic info */}
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                <img
                  src={formData.profile_image
                    ? URL.createObjectURL(formData.profile_image) // Preview newly selected image
                    : getProfileImageUrl(currentUser)} // Display current user's image
                  alt="Profile"
                  className="w-full h-full object-cover"
                  // Fallback for image loading errors: sets to a default image
                  onError={(e) => {
                    e.target.onerror = null; // Prevents infinite loop if DEFAULT_PROFILE_IMAGE also fails
                    e.target.src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
              </div>
              {/* Label for file input to change profile image, styled as a camera icon button */}
              <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md">
                <CameraIcon className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*" // Only accept image files
                  onChange={handleImageChange}
                  className="hidden" // Hide the default browser file input
                />
              </label>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              {/* Display user's full name or username, with 'User Profile' as fallback */}
              {currentUser?.full_name || currentUser?.username || 'User Profile'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {/* Display user's email, with 'No email provided' as fallback */}
              {currentUser?.email || 'No email provided'}
            </p>
          </div>

          {/* Tab Navigation: Allows switching between Profile Settings and Store Settings */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('profile')}
              disabled={loading} // Disable tab switching while loading
            >
              Profile Settings
            </button>
            {
              // Conditionally render the "Store Settings" tab.
              // It only appears if `currentUser` exists and `is_seller` is true.
              currentUser && currentUser.is_seller ? (
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    activeTab === 'store'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                  onClick={() => setActiveTab('store')}
                  disabled={loading} // Disable tab switching while loading
                >
                  Store Settings
                </button>
              ) : (
                // If currentUser is null or not a seller, this tab is not rendered.
                // A `null` or `undefined` render nothing in React.
                null
              )
            }
          </div>

          {/* Tab Content Area: Renders the active settings component */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Render ProfileSettings component if 'profile' tab is active */}
            {activeTab === 'profile' && (
              <ProfileSettings
                currentUser={currentUser}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                loading={loading}
                handleSubmit={handleSubmit} // Pass the main submit handler
                // Pass functions for password update and account deletion to ProfileSettings
                handlePasswordUpdate={handlePasswordUpdate}
                showDeleteConfirm={showDeleteConfirm}
                setShowDeleteConfirm={setShowDeleteConfirm}
                handleDeleteAccount={handleDeleteAccount}
              />
            )}

            {/* Render StoreSetting component if 'store' tab is active */}
            {activeTab === 'store' && (
              <StoreSetting
                currentUser={currentUser}
                onCreateStore={onCreateStore} // Pass the onCreateStore callback
                // You might need to pass store-specific state and handlers here
                // e.g., storeData, handleStoreInputChange, validateStoreForm, handleStoreSubmit
              />
            )}
          </div>

          {/* Delete Account Confirmation Dialog - displayed as a modal overlay */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Confirm Account Deletion
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                    disabled={loading} // Disable during loading
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount} // Triggers the account deletion process
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors"
                    disabled={loading} // Disable during loading
                  >
                    {loading ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Display general submission errors (e.g., from API calls) */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md mt-4">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}
        </div>
      </Popup>
    </>
  );
};

export default Settings;