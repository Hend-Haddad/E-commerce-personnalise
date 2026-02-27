// src/components/client/FilterSidebar.jsx
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FilterSidebar = ({ categories, onFilterChange, selectedCategory }) => {
  const [openSections, setOpenSections] = useState({
    productType: true,
    price: true,
    categories: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Filter By</h2>

      {/* Product Type */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('productType')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-3"
        >
          Product Type
          {openSections.productType ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.productType && (
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="radio" name="productType" value="all" className="mr-2" />
              <span className="text-sm text-gray-600">All</span>
            </label>
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-3"
        >
          Price
          {openSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.price && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-3"
        >
          Categories
          {openSections.categories ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.categories && (
          <div className="space-y-2">
            {categoryList.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => onFilterChange('category', category)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-2">Active Filters</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            Men's Fashion
          </span>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            $10 - $50
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;