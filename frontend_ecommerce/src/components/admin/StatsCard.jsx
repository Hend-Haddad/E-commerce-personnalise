// src/components/admin/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'indigo', bgColor = 'indigo' }) => {
  const colorClasses = {
    indigo: 'text-indigo-600 bg-indigo-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    gray: 'text-gray-600 bg-gray-100'
  };

  const iconColor = colorClasses[color] || colorClasses.indigo;
  const bgIconColor = colorClasses[bgColor] || colorClasses.indigo;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgIconColor.split(' ')[1]}`}>
          <Icon className={iconColor.split(' ')[0]} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;