// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';

import HeroSection from '../components/home/HeroSection';
import FlashSales from '../components/home/FlashSales';
import BestSelling from '../components/home/BestSelling';
import CategoriesSection from '../components/home/CategoriesSection';
import FeaturesSection from '../components/home/FeaturesSection';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
        ]);
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('❌ Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <HeroSection categories={categories} />
        <FlashSales products={products} />
        <CategoriesSection categories={categories} />
        <BestSelling products={products} />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;