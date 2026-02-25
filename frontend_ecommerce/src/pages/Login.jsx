// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth';           // ← IMPORTANT
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

const loginImage = "/images/image.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();        // ← On récupère la fonction login du contexte

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(Object.values(newErrors)[0]);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await login(formData);

      // ────────────────────────────────────────
      //  LIGNES LES PLUS IMPORTANTES ICI
      contextLogin(response.user, response.token);
      // ────────────────────────────────────────

      localStorage.setItem('token', response.token);     // optionnel si tu le fais déjà dans context
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.success('Connexion réussie !');

      // Redirection immédiate (timeout réduit ou supprimé)
      if (response.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (error) {
      console.error('Erreur login:', error);

      const status = error.response?.status;
      let errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Email ou mot de passe incorrect';

      toast.error(errorMessage);

      if (status === 404 || errorMessage.toLowerCase().includes('non trouvé')) {
        setErrors(prev => ({ ...prev, email: 'Cet email n\'est pas enregistré' }));
        setApiError('Aucun compte trouvé avec cet email');
      } else if (status === 401 || errorMessage.toLowerCase().includes('incorrect')) {
        setErrors(prev => ({ ...prev, password: 'Mot de passe incorrect' }));
        setApiError('Email ou mot de passe incorrect');
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">SmartShop</h1>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 transition">Home</Link>
              <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition">Contact</Link>
              <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition">About</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen pt-20">
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10"></div>
          <img 
            src={loginImage}
            alt="Shopping" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            
            <p className="text-gray-600 mb-6">Connectez-vous pour accéder à votre compte et poursuivre vos achats</p>

            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span> {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou continuer avec</span>
                </div>
              </div>

              <button className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <FcGoogle className="h-5 w-5 mr-2" />
                Google
              </button>
            </div>

            <p className="mt-8 text-center text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;