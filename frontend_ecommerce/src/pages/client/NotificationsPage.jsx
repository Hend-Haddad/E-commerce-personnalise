// src/pages/client/NotificationsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiCheck, FiX, FiClock, FiPackage, FiHeart, FiDollarSign } from 'react-icons/fi';
import ClientNavbar from '../../components/client/ClientNavbar';

import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Commande #CMD001 livrée',
      message: 'Votre commande a été livrée avec succès',
      time: 'Il y a 2 heures',
      read: false,
      icon: FiPackage,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      id: 2,
      type: 'wishlist',
      title: 'Produit en promotion',
      message: 'Le Smartphone XYZ que vous avez dans vos favoris est en promotion',
      time: 'Il y a 1 jour',
      read: false,
      icon: FiHeart,
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    {
      id: 3,
      type: 'price',
      title: 'Baisse de prix',
      message: 'Le prix du Casque Audio a baissé de 20%',
      time: 'Il y a 2 jours',
      read: true,
      icon: FiDollarSign,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100'
    },
    {
      id: 4,
      type: 'order',
      title: 'Commande #CMD002 expédiée',
      message: 'Votre commande a été expédiée et est en route',
      time: 'Il y a 3 jours',
      read: true,
      icon: FiPackage,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    toast.success('Notification marquée comme lue');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast.success('Toutes les notifications ont été marquées comme lues');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast.success('Notification supprimée');
  };

  const clearAll = () => {
    if (notifications.length === 0) {
      toast.error('Aucune notification à supprimer');
      return;
    }
    setNotifications([]);
    toast.success('Toutes les notifications ont été supprimées');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      
        
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mes Notifications</h1>
              <p className="text-gray-600 mt-2">
                {unreadCount} notification(s) non lue(s)
              </p>
            </div>
            
            <div className="flex space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-4 py-2 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                >
                  <FiCheck className="mr-2" />
                  Tout marquer comme lu
                </button>
              )}
              
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <FiX className="mr-2" />
                  Tout effacer
                </button>
              )}
            </div>
          </div>

          {/* Liste des notifications */}
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="flex justify-center mb-4">
                <FiBell className="text-gray-300 text-6xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Aucune notification
              </h2>
              <p className="text-gray-500">
                Vous n'avez pas encore de notifications
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                
                return (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg shadow-md p-4 transition ${
                      !notification.read ? 'border-l-4 border-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      {/* Icon */}
                      <div className={`${notification.bgColor} p-3 rounded-lg mr-4`}>
                        <Icon className={notification.color} size={20} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800">
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                Nouveau
                              </span>
                            )}
                            <span className="text-xs text-gray-400 flex items-center">
                              <FiClock className="mr-1" size={12} />
                              {notification.time}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex space-x-3">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                              <FiCheck className="mr-1" size={14} />
                              Marquer comme lu
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800 flex items-center"
                          >
                            <FiX className="mr-1" size={14} />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    
  );
};

export default NotificationsPage; // ← TRÈS IMPORTANT