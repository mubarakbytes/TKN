// src/components/header/auth/AuthForm.jsx
import React, { useState } from 'react';

// API endpoints (using relative paths for Vite proxy)
const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup'
};

// Validation rules
const PASSWORD_MIN_LENGTH = 8;
const USERNAME_MIN_LENGTH = 3;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForm = ({ onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    identifierOrEmail: '',
    password: '',
    confirm_password: ''
  });
  // --- New State for Image File ---
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // For showing a preview
  // --- End New State ---

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validatePassword = (password) => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const validateEmail = (email) => {
    return EMAIL_REGEX.test(email) ? null : 'Please enter a valid email address';
  };

  const validateUsername = (username) => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return 'Username must be at least 3 characters long';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // --- New Handler for File Input ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfileImageFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result); // Use reader.result which is a base64 string
      };
      reader.readAsDataURL(file);
      setError(''); // Clear previous file errors
    } else {
      setProfileImageFile(null);
      setImagePreviewUrl(null);
      if (file) {
        // Optional: Show an error if the selected file is not an image
        setError('Please select a valid image file (jpg, png, gif, etc.).');
      }
    }
  };
  // --- End New Handler ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Input validation
      if (!isLoginMode) {
        // Signup validation
        const emailError = validateEmail(formData.identifierOrEmail);
        if (emailError) {
          throw new Error(emailError);
        }

        const usernameError = validateUsername(formData.username);
        if (usernameError) {
          throw new Error(usernameError);
        }

        if (!formData.full_name.trim()) {
          throw new Error('Full name is required');
        }

        if (formData.password !== formData.confirm_password) {
          throw new Error('Passwords do not match');
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          throw new Error(passwordError);
        }
      }

      const url = isLoginMode ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.SIGNUP;
      let requestBody;

      if (isLoginMode) {
        requestBody = JSON.stringify({
          identifier: formData.identifierOrEmail.trim(),
          password: formData.password
        });
      } else {
        // For signup, prepare the data including profile image if present
        const signupData = {
          full_name: formData.full_name.trim(),
          username: formData.username.trim(),
          email: formData.identifierOrEmail.trim(),
          password: formData.password
        };

        if (profileImageFile) {
          const reader = new FileReader();
          reader.readAsDataURL(profileImageFile);
          await new Promise((resolve, reject) => {
            reader.onload = () => {
              signupData.profile_image = reader.result;
              resolve();
            };
            reader.onerror = reject;
          });
        }

        requestBody = JSON.stringify(signupData);
      }

      // Set up request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(document.querySelector('meta[name="csrf-token"]')?.content && {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          })
        },
        body: requestBody,
        credentials: 'include',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (response.status === 429) {
        const retryAfter = result.retry_after || 300;
        throw new Error(`Too many attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`);
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || `Request failed with status ${response.status}`);
      }

      // Clear sensitive data
      setFormData(prev => ({
        ...prev,
        password: '',
        confirm_password: '',
        identifierOrEmail: isLoginMode ? prev.identifierOrEmail : ''
      }));

      if (result.user && onAuthSuccess) {
        onAuthSuccess(result.user);
      } else if (!isLoginMode) {
        setIsLoginMode(true);
      }

    } catch (err) {
      console.error('Auth error:', err);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      // } else if (!navigator.onLine) {
      //   setError('No internet connection. Please check your network.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    // Reset form fields including file input and preview
    setFormData({ full_name: '', username: '', identifierOrEmail: '', password: '', confirm_password: '' });
    setProfileImageFile(null);
    setImagePreviewUrl(null);
    // Clear the file input visually if possible (requires a ref or key change usually)
    const fileInput = document.getElementById('profileImage');
    if (fileInput) {
        fileInput.value = ''; // Reset file input
    }
  };


  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-5 sm:mb-6 dark:text-white">
          {isLoginMode ? 'Login to Your Account' : 'Create Your Account'}
        </h2>

        {/* Fields only for Signup */}
        {!isLoginMode && (
          <>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} required={!isLoginMode}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required={!isLoginMode}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                placeholder="Choose a username"
              />
            </div>

            {/* --- Profile Image Input --- */}
            <div>
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Picture (Optional)
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage" // Name attribute for the input itself
                accept="image/*" // Hint to browser to accept only images
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-indigo-50 file:text-indigo-700
                           hover:file:bg-indigo-100
                           dark:file:bg-gray-600 dark:file:text-indigo-300 dark:hover:file:bg-gray-500"
              />
              {/* Image Preview */}
              {imagePreviewUrl && (
                <div className="mt-3">
                  <img
                    src={imagePreviewUrl}
                    alt="Profile Preview"
                    className="h-16 w-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
            </div>
            {/* --- End Profile Image Input --- */}

          </>
        )}

        {/* --- Identifier / Email Field (Common) --- */}
        <div>
          <label htmlFor="identifierOrEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isLoginMode ? 'Email or Username' : 'Email Address'}
          </label>
          <input
            type={isLoginMode ? 'text' : 'email'}
            id="identifierOrEmail"
            name="identifierOrEmail"
            value={formData.identifierOrEmail}
            onChange={handleInputChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
            placeholder={isLoginMode ? 'Enter your email or username' : 'you@example.com'}
          />
        </div>

        {/* Password (Common) */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
            placeholder="Enter your password"
          />
        </div>

        {/* Confirm Password (Only for Signup) */}
        {!isLoginMode && (
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password" id="confirm_password" name="confirm_password" value={formData.confirm_password} onChange={handleInputChange} required={!isLoginMode}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Enter your password again"
            />
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center py-1">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
        >
          {/* ... loading spinner ... */}
           {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (isLoginMode ? 'Login' : 'Create Account')}
        </button>

        {/* Toggle Mode Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
          {/* ... toggle text ... */}
           {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
          <button type="button" onClick={toggleMode} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none focus:underline">
            {isLoginMode ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
