// src/components/common/StatusBadge.jsx
import React from 'react';
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiPackage,
  FiUserCheck,
  FiUserX
} from 'react-icons/fi';

const StatusBadge = ({ status, type = 'order' }) => {
  const orderStatuses = {
    'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock, label: 'En attente' },
    'confirmée': { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiCheckCircle, label: 'Confirmée' },
    'en_préparation': { bg: 'bg-purple-100', text: 'text-purple-800', icon: FiPackage, label: 'En préparation' },
    'expédiée': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: FiTruck, label: 'Expédiée' },
    'livrée': { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'Livrée' },
    'annulée': { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle, label: 'Annulée' }
  };

  const userStatuses = {
    true: { bg: 'bg-green-100', text: 'text-green-800', icon: FiUserCheck, label: 'Actif' },
    false: { bg: 'bg-red-100', text: 'text-red-800', icon: FiUserX, label: 'Inactif' }
  };

  const config = type === 'order' ? orderStatuses[status] : userStatuses[status];
  
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="mr-1" size={12} />
      {config.label}
    </span>
  );
};

export default StatusBadge;