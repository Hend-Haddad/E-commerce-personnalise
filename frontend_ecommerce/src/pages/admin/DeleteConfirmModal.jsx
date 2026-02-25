// src/components/admin/DeleteConfirmModal.jsx
import React, { useState } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, itemType }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FiAlertTriangle className="text-red-500 mr-2" size={24} />
            Confirmation
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir désactiver la {itemType}{' '}
            <span className="font-semibold text-indigo-600">"{itemName}"</span> ?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Cette action est réversible. Vous pourrez réactiver cette {itemType} plus tard.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center"
          >
            {loading && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            )}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;