import React, { useState } from 'react';
import { CameraIcon, XMarkIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

function StoreSetting({ currentUser }) {
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    image: null,
  });
  const [errors, setErrors] = useState({});

  const showAlert = (type, message) => {
    console.log(`${type}: ${message}`);
  };

  const validateStoreForm = () => {
    const newErrors = {};
    if (!storeData.name.trim()) newErrors.name = 'Store name is required';
    if (!storeData.description.trim()) newErrors.description = 'Store description is required';
    if (!storeData.location.trim()) newErrors.location = 'Store location is required';
    if (!storeData.category.trim()) newErrors.category = 'Store category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStoreInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStoreImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image must be less than 5MB' }));
        return;
      }
      setStoreData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const submitStoreCreation = async (storeFormData) => {
    // Dummy implementation to simulate an API call
    console.log('Submitting store creation', storeFormData);
    await new Promise((resolve) => setTimeout(resolve, 500));
    showAlert('success', 'Store created successfully! You are now a seller.');
    setStoreData({
      name: '',
      description: '',
      location: '',
      category: '',
      image: null,
    });
    setErrors({});
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!validateStoreForm()) return;

    setLoading(true);
    try {
      const storeFormData = {
        store_name: storeData.name,
        store_description: storeData.description,
        store_location: storeData.location,
        store_category: storeData.category,
      };

      if (storeData.image) {
        const reader = new FileReader();
        reader.readAsDataURL(storeData.image);
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            storeFormData.store_image = reader.result;
            resolve();
          };
          reader.onerror = reject;
        });
      }

      await submitStoreCreation(storeFormData);
    } catch (error) {
      setErrors((prev) => ({ ...prev, submit: error.message }));
      showAlert('error', error.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {currentUser?.is_seller ? (
        <div className="text-center py-8">
          <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            Store Management
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You already have a store. Use the dashboard to manage your store settings.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => window.location.href = '/dashboard'}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Store Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreateStore} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Create Your Store
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={storeData.name}
                  onChange={handleStoreInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Enter your store name"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Description
                </label>
                <textarea
                  name="description"
                  value={storeData.description}
                  onChange={handleStoreInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Describe your store"
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={storeData.location}
                  onChange={handleStoreInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Enter store location"
                />
                {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Category
                </label>
                <select
                  name="category"
                  value={storeData.category}
                  onChange={handleStoreInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food">Food</option>
                  <option value="Home">Home & Garden</option>
                  <option value="Beauty">Beauty & Health</option>
                  <option value="Sports">Sports & Outdoors</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Logo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {storeData.image ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(storeData.image)}
                          alt="Store preview"
                          className="mx-auto h-32 w-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setStoreData((prev) => ({ ...prev, image: null }))}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              name="image"
                              onChange={handleStoreImageChange}
                              className="sr-only"
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating Store...' : 'Create Store'}
              </button>
              {errors.submit && <p className="mt-2 text-sm text-red-600">{errors.submit}</p>}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default StoreSetting;

