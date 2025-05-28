import React from 'react';

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      {/* Mobile Popup */}
      <div className="w-full lg:h-4/4 h-5/6 bg-white dark:bg-gray-800 rounded-t-lg shadow-lg md:hidden fixed bottom-0 overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>



      {/* Desktop Popup */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full h-16/17 overflow-y-auto fixed bottom-0">
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
          
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Popup;