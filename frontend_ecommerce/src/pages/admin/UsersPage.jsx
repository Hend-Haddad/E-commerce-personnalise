// src/pages/admin/UsersPage.jsx
import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';

const UsersPage = () => {
  const [users] = useState([
    { id: 1, nom: 'Admin', prenom: 'Super', email: 'admin@site.com', role: 'admin', actif: true },
    { id: 2, nom: 'Dupont', prenom: 'Jean', email: 'jean@email.com', role: 'client', actif: true },
    { id: 3, nom: 'Martin', prenom: 'Sophie', email: 'sophie@email.com', role: 'client', actif: false },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.prenom} {user.nom}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center ${
                    user.actif ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.actif ? <FiUserCheck className="mr-1" /> : <FiUserX className="mr-1" />}
                    {user.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <FiEdit2 size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;