// src/pages/Register.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import { register as registerUser } from '../services/authService'
import { 
  validateEmail, 
  validatePassword, 
  validatePhone, 
  validateName, 
  validateAddress,
  validateForm 
} from '../utils/validators'

const registerImage = "/images/image.jpg"

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    adresse: ''
  })
  const [errors, setErrors] = useState({})

  // Règles de validation
  const validationRules = {
    nom: {
      required: true,
      requiredMessage: 'Le nom est requis',
      validator: (value) => validateName(value, 'Nom')
    },
    prenom: {
      required: true,
      requiredMessage: 'Le prénom est requis',
      validator: (value) => validateName(value, 'Prénom')
    },
    email: {
      required: true,
      validator: validateEmail
    },
    password: {
      required: true,
      validator: (value) => validatePassword(value, {
        minLength: 8,
        requireUppercase: true,
        requireNumber: true
      })
    },
    telephone: {
      required: true,
      validator: (value) => validatePhone(value, 8)
    },
    adresse: {
      required: true,
      validator: validateAddress
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur pour ce champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation du formulaire
    const { isValid, errors: validationErrors } = validateForm(formData, validationRules)
    
    if (!isValid) {
      setErrors(validationErrors)
      // Afficher la première erreur dans un toast
      const firstError = Object.values(validationErrors)[0]
      toast.error(firstError)
      return
    }

    setLoading(true)
    try {
      const response = await registerUser(formData)
      toast.success('🎉 Compte créé avec succès !', {
        duration: 3000,
        icon: '👏',
        style: {
          background: '#10b981',
          color: 'white',
        }
      })
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Erreur lors de l\'inscription'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

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
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content avec image à gauche */}
      <div className="flex min-h-screen pt-20">
        {/* Left side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10"></div>
          <img 
            src={registerImage}
            alt="Shopping" 
            className="w-full h-full object-cover"
            
          />
          
        </div>

        {/* Right side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h2>
            <p className="text-gray-600 mb-6">Saisissez vos informations ci-dessous</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Nom"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                        errors.nom ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.nom && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <span className="mr-1">⚠️</span> {errors.nom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                        errors.prenom ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.prenom && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <span className="mr-1">⚠️</span> {errors.prenom}
                    </p>
                  )}
                </div>
              </div>

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

              {/* Mot de passe */}
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
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 8 caractères, une majuscule et un chiffre
                </p>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+216 00 000 000"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                      errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.telephone && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span> {errors.telephone}
                  </p>
                )}
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Votre adresse"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                      errors.adresse ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.adresse && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span> {errors.adresse}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed font-medium mt-6"
              >
                {loading ? 'Création en cours...' : 'Créer un compte'}
              </button>
            </form>

            {/* Google Button */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou s'inscrire avec</span>
                </div>
              </div>

              <button className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition group">
                <FcGoogle className="h-5 w-5 mr-2" />
                <span className="group-hover:text-indigo-600 transition">Google</span>
              </button>
            </div>

            <p className="mt-8 text-center text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register