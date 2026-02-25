// src/components/home/CategoriesSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiMonitor, FiSmartphone, FiHeadphones, FiCamera, FiWatch, FiGift } from 'react-icons/fi';

// Mapping des icônes par nom de catégorie (vous pouvez personnaliser)
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('electronique') || name.includes('electro')) return FiMonitor;
  if (name.includes('phone') || name.includes('smartphone')) return FiSmartphone;
  if (name.includes('audio') || name.includes('headphone')) return FiHeadphones;
  if (name.includes('camera') || name.includes('photo')) return FiCamera;
  if (name.includes('watch') || name.includes('montre')) return FiWatch;
  return FiGift; // Icône par défaut
};

const CategoriesSection = ({ categories }) => {
  // Prendre les 6 premières catégories ou moins
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-indigo-600 font-semibold mb-2">Categories</p>
          <h2 className="text-3xl font-bold text-gray-800">Browse By Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((category) => {
            const Icon = getCategoryIcon(category.nom);
            return (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="group border border-gray-200 rounded-lg p-6 text-center hover:bg-indigo-600 hover:text-white transition"
              >
                <Icon className="mx-auto text-3xl mb-2 text-gray-600 group-hover:text-white" />
                <span className="text-sm font-medium">{category.nom}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;