// src/components/home/BestSelling.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../ui/ProductCard';


const BestSelling = ({ products }) => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    // Simuler les meilleures ventes
    const best = products.slice(4, 8).map(p => ({
      ...p,
      oldPrice: p.prix * 1.2,
      rating: 5,
      reviews: Math.floor(Math.random() * 200)
    }));
    setBestSellers(best);
  }, [products]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-indigo-600 font-semibold mb-2">This Month</p>
            <h2 className="text-3xl font-bold text-gray-800">Best Selling Products</h2>
          </div>
          <Link
            to="/products?best-selling=true"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            View All
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSelling;