// src/components/common/Pagination.jsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage,
  onPageChange,
  showInfo = true,
  siblingCount = 2,
  className = ''
}) => {
  
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - siblingCount && i <= currentPage + siblingCount)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 ${className}`}>
      {showInfo && (
        <div className="text-sm text-gray-500">
          Affichage de{' '}
          <span className="font-medium">{startItem}</span>
          {' '}à{' '}
          <span className="font-medium">{endItem}</span>
          {' '}sur <span className="font-medium">{totalItems}</span> éléments
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition ${
            currentPage === 1
              ? 'cursor-not-allowed border-gray-200 text-gray-300'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiChevronLeft className="mr-1" size={16} />
          Précédent
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
            className={`min-w-[2.5rem] rounded-md border px-3 py-1.5 text-sm transition ${
              page === '...'
                ? 'cursor-default border-transparent'
                : page === currentPage
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition ${
            currentPage === totalPages
              ? 'cursor-not-allowed border-gray-200 text-gray-300'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Suivant
          <FiChevronRight className="ml-1" size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;