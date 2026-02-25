// frontend_ecommerce/src/components/ui/Loader.jsx
import React from 'react';

const Loader = ({ size = 'md', color = 'indigo', fullScreen = false }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colors = {
    indigo: 'border-indigo-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  const loaderContent = (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizes[size] || sizes.md}
          ${colors[color] || colors.indigo}
          border-4
          border-t-transparent
          rounded-full
          animate-spin
        `}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;