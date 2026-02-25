// src/components/home/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import CategorySidebar from './CategorySidebar';

const HeroSection = ({ categories }) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="md:w-1/4">
            <CategorySidebar categories={categories} />
          </div>

          {/* Hero Banner */}
          
                
           <div className="md:w-3/4">
  <div className="bg-black text-white rounded-lg overflow-hidden">
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 flex items-center justify-center p-4">
        <img
          src="/images/image.jpg"
          alt="iPhone 14"
          className="max-h-64 object-contain"
        />
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;