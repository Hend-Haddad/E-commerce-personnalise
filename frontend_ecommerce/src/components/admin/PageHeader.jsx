// src/components/admin/PageHeader.jsx
import React from 'react';
import { FiRefreshCw, FiPlus } from 'react-icons/fi';

const PageHeader = ({
  title,
  subtitle,
  onRefresh,
  onAdd,
  addLabel = "Nouveau",
  loading = false,
  resultCount
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        {resultCount !== undefined && (
          <p className="text-sm text-gray-500 mt-1">{resultCount} élément(s)</p>
        )}
      </div>
      <div className="flex space-x-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            title="Rafraîchir"
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        )}
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FiPlus className="mr-2" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;