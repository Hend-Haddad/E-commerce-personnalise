// src/components/admin/SearchFilter.jsx
import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const SearchFilter = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  filters = [],
  showFilters = false,
  onToggleFilters,
  placeholder = "Rechercher...",
  resultCount = 0,
  resultLabel = "résultat(s)"
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <form onSubmit={onSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </form>

        <div className="flex items-center space-x-4">
          {filters.length > 0 && (
            <>
              <button
                onClick={onToggleFilters}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FiFilter className="mr-2" />
                Filtres
              </button>

              <div className="flex space-x-2">
                {filters.map((filter, index) => (
                  <select
                    key={index}
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {resultCount > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          {resultCount} {resultLabel}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;