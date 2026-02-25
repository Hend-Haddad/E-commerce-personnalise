// src/components/home/FlashSales.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../ui/ProductCard';
import CountdownTimer from '../../ui/CountdownTimer'; 


const FlashSales = ({ products }) => {
  const [flashProducts, setFlashProducts] = useState([]);

  useEffect(() => {
    // Simuler des produits en flash sale (avec réduction)
    const flash = products.slice(0, 4).map(p => ({
      ...p,
      oldPrice: p.prix * 1.4,
      rating: 4,
      reviews: Math.floor(Math.random() * 100)
    }));
    setFlashProducts(flash);
  }, [products]);

  // Date cible pour le compte à rebours (3 jours à partir de maintenant)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-indigo-600 font-semibold mb-2">Today's</p>
            <div className="flex items-center space-x-8">
              <h2 className="text-3xl font-bold text-gray-800">Flash Sales</h2>
              <CountdownTimer targetDate={targetDate} />
            </div>
          </div>
         
<Link
  to="/products"
  className="text-indigo-600 hover:text-indigo-800 font-medium"
>
  View All Products →
</Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSales;