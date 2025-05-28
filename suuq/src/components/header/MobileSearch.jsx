// src/components/header/MobileSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

const MobileSearch = () => {
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null); // To focus input when overlay opens

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    // Ensure this runs only on the client-side
    if (typeof window !== 'undefined') {
      const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
      setRecentSearches(savedSearches);
    }
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (isSearchOverlayOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOverlayOpen]);

  // Effect to handle body scroll lock
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isSearchOverlayOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isSearchOverlayOpen]);


  const openSearchOverlay = () => {
    setIsSearchOverlayOpen(true);
  };

  const closeSearchOverlay = () => {
    setIsSearchOverlayOpen(false);
    setSearchQuery(""); // Clear search query on close
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle submitting a search (e.g., pressing Enter)
  const handleSearchSubmit = (term) => {
    const searchTerm = (typeof term === 'string' ? term : searchQuery).trim(); // Use provided term or current query

    if (searchTerm !== "") {
      // Add to recent searches if not already present (client-side only)
      if (typeof window !== 'undefined') {
        const updatedSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5); // Add to front, remove duplicates, limit to 5
        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      }

      // --- TODO: Implement actual search logic here ---
      // For example, navigate to a search results page:
      // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      console.log("Searching for:", searchTerm);
      // --- End TODO ---

      closeSearchOverlay(); // Close overlay after search
    }
  };

  // Handle clicking on a recent search item
  const handleRecentSearchClick = (term) => {
    setSearchQuery(term); // Set the input value
    handleSearchSubmit(term); // Immediately submit the search
  };

  // Handle key down (specifically Enter key)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Remove a specific recent search
  const removeRecentSearch = (termToRemove, event) => {
    event.stopPropagation(); // Prevent triggering handleRecentSearchClick
    // Client-side only
    if (typeof window !== 'undefined') {
      const updatedSearches = recentSearches.filter(s => s !== termToRemove);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  };

  return (
    <>
      {/* Search Icon Button in the Nav Bar */}
      <button onClick={openSearchOverlay} aria-label="Open search">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-700 dark:text-white" aria-hidden="true" />
      </button>

      {/* Search Overlay */}
      {isSearchOverlayOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-900 flex flex-col animate-fade-in"> {/* Increased z-index, added animation */}
          {/* Overlay Header */}
          <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
            <input
              ref={inputRef}
              type="search" // Use type="search" for potential browser features like clear button
              placeholder="Search essentials, groceries and more..."
              className="flex-grow bg-transparent border-none focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Handle Enter key
            />
            <button onClick={closeSearchOverlay} aria-label="Close search" className="ml-2 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Recent Searches List */}
          <div className="flex-grow overflow-y-auto p-4">
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 px-2"> {/* Added padding */}
                  Recent Searches
                </h3>
                <ul className="space-y-1">
                  {recentSearches.map((term, index) => (
                    <li
                      key={index}
                      onClick={() => handleRecentSearchClick(term)}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
                    >
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-200 min-w-0"> {/* Added min-w-0 for potential text overflow */}
                        <ClockIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2.5 flex-shrink-0" />
                        <span className="truncate">{term}</span> {/* Added truncate */}
                      </div>
                      <button
                        onClick={(e) => removeRecentSearch(term, e)}
                        aria-label={`Remove search term: ${term}`}
                        className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" // Ensure button doesn't wrap
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {recentSearches.length === 0 && searchQuery === "" && (
                 <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">No recent searches.</p>
            )}
             {/* You could add search suggestions or results preview here later */}
          </div>
        </div>
      )}
    </>
  );
};

// Optional: Add a simple fade-in animation in your global CSS or Tailwind config
/* Example in global CSS:
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
*/

export default MobileSearch;
