// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';


import AdminDashboard from './pages/admin/AdminDashboard';
import DashboardHome from './pages/admin/DashboardHome';
import CategoriesPage from './pages/admin/CategoriesPage';

import ClientsPage from './pages/admin/ClientsPage';
import OrdersPage from './pages/admin/OrdersPage';
import AdminRoute from './components/admin/AdminRoute';
import ProductDetails from './pages/product/ProductDetails';
import ProductsPage from './pages/product/ProductsPage';
import AdminProductsPage from './pages/admin/ProductsPageAdmin';


import ProfilePage from './pages/client/ProfilePage';
import ClientHome from './pages/client/ClientHome';
import WishlistPage from './pages/client/WishlistPage';
import SettingsPage from './pages/client/SettingsPage';
import ClientRoute from './components/client/ClientRoute';
import NotificationsPage from './pages/client/NotificationsPage';
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<ProductsPage />} />

         <Route path="/client" element={
          <ClientRoute>
            <ClientHome />
          </ClientRoute>
        } />
        
        <Route path="/client/profile" element={
          <ClientRoute>
            <ProfilePage />
          </ClientRoute>
        } />
        
        <Route path="/client/orders" element={
          <ClientRoute>
            <OrdersPage />
          </ClientRoute>
        } />
        
        <Route path="/client/wishlist" element={
          <ClientRoute>
            <WishlistPage />
          </ClientRoute>
        } />
        
        <Route path="/client/notifications" element={
          <ClientRoute>
            <NotificationsPage />
          </ClientRoute>
        } />
        
        <Route path="/client/settings" element={
          <ClientRoute>
            <SettingsPage />
          </ClientRoute>
        } />
        
        <Route path="/client/settings" element={
          <ClientRoute>
            <SettingsPage />
          </ClientRoute>
        } />

        {/* Routes admin protégées */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;