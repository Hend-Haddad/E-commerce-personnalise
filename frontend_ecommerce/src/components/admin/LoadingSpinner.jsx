// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ fullScreen = false, text = "Chargement..." }) => {
  const containerClass = fullScreen
    ? "flex items-center justify-center min-h-screen"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        {text && <p className="mt-4 text-gray-500">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;