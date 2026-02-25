// src/pages/admin/ClientsPage.jsx
import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ClientsPage = () => {
  const [clients, setClients] = useState([
    { 
      id: 1, 
      nom: 'Dupont', 
      prenom: 'Jean', 
      email: 'jean.dupont@email.com', 
      telephone: '+33 6 12 34 56 78',
      adresse: '15 Rue de Paris, 75001 Paris',
      date_inscription: '2026-01-15',
      commandes: 12,
      total_achete: 1250.50,
      statut: 'actif',
      kyc: 'vérifié'
    },
    { 
      id: 2, 
      nom: 'Martin', 
      prenom: 'Sophie', 
      email: 'sophie.martin@email.com', 
      telephone: '+33 6 23 45 67 89',
      adresse: '8 Avenue des Champs, 69002 Lyon',
      date_inscription: '2026-02-01',
      commandes: 5,
      total_achete: 450.75,
      statut: 'actif',
      kyc: 'en_cours'
    },
    { 
      id: 3, 
      nom: 'Bernard', 
      prenom: 'Pierre', 
      email: 'pierre.bernard@email.com', 
      telephone: '+33 7 34 56 78 90',
      adresse: '23 Rue de la République, 13001 Marseille',
      date_inscription: '2026-01-20',
      commandes: 8,
      total_achete: 890.30,
      statut: 'inactif',
      kyc: 'non_vérifié'
    },
    { 
      id: 4, 
      nom: 'Petit', 
      prenom: 'Marie', 
      email: 'marie.petit@email.com', 
      telephone: '+33 6 45 67 89 01',
      adresse: '5 Place du Capitole, 31000 Toulouse',
      date_inscription: '2026-02-10',
      commandes: 3,
      total_achete: 210.90,
      statut: 'actif',
      kyc: 'vérifié'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterKyc, setFilterKyc] = useState('tous');

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'tous' || client.statut === filterStatus;
    const matchesKyc = filterKyc === 'tous' || client.kyc === filterKyc;

    return matchesSearch && matchesStatus && matchesKyc;
  });

  const getStatusBadge = (statut) => {
    switch(statut) {
      case 'actif':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
          <FiUserCheck className="mr-1" size={12} /> Actif
        </span>;
      case 'inactif':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
          <FiUserX className="mr-1" size={12} /> Inactif
        </span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{statut}</span>;
    }
  };

  const getKycBadge = (kyc) => {
    switch(kyc) {
      case 'vérifié':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Vérifié</span>;
      case 'en_cours':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">En cours</span>;
      case 'non_vérifié':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Non vérifié</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{kyc}</span>;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des clients</h1>
          <p className="text-gray-600 mt-1">Gérez tous vos clients et leurs informations</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
            <FiMail className="mr-2" />
            Envoyer une notification
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nom, prénom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Filtre par statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="tous">Tous les statuts</option>
              <option value="actif">Actifs</option>
              <option value="inactif">Inactifs</option>
            </select>
          </div>

          {/* Filtre par KYC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vérification KYC</label>
            <select
              value={filterKyc}
              onChange={(e) => setFilterKyc(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="tous">Tous</option>
              <option value="vérifié">Vérifiés</option>
              <option value="en_cours">En cours</option>
              <option value="non_vérifié">Non vérifiés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total clients</p>
          <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Clients actifs</p>
          <p className="text-2xl font-bold text-green-600">{clients.filter(c => c.statut === 'actif').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Clients inactifs</p>
          <p className="text-2xl font-bold text-red-600">{clients.filter(c => c.statut === 'inactif').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">KYC vérifiés</p>
          <p className="text-2xl font-bold text-indigo-600">{clients.filter(c => c.kyc === 'vérifié').length}</p>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistiques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KYC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {client.prenom.charAt(0)}{client.nom.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {client.prenom} {client.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {client.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <FiPhone size={12} className="mr-1" />
                      {client.telephone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <FiMapPin size={12} className="mr-1" />
                      {client.adresse.substring(0, 20)}...
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.commandes} commandes</div>
                    <div className="text-sm font-semibold text-indigo-600">{client.total_achete} DT</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(client.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getKycBadge(client.kyc)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(client.date_inscription).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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

        {/* Pagination */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredClients.length}</span> sur <span className="font-medium">{clients.length}</span> clients
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Précédent
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;