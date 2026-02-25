// src/components/home/CategorySidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const CategorySidebar = ({ categories }) => {
  return (
    <div className="border-r border-gray-200 pr-4">
      <ul className="space-y-3">
        {categories.map((category) => (
          <li key={category._id}>
            <Link
              to={`/products?category=${category._id}`}
              className="flex items-center justify-between text-gray-700 hover:text-indigo-600 transition"
            >
              <span>{category.nom}</span>
              <FiChevronRight size={16} className="text-gray-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;