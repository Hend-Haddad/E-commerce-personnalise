// src/components/home/FeaturesSection.jsx
import React from 'react';
import { FiTruck, FiHeadphones, FiShield } from 'react-icons/fi';

const FeaturesSection = () => {
  const features = [
    {
      icon: FiTruck,
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140'
    },
    {
      icon: FiHeadphones,
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support'
    },
    {
      icon: FiShield,
      title: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-2xl text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;