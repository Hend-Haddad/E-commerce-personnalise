// src/utils/validators.js

/**
 * VALIDATEUR POUR LES CHAMPS DE FORMULAIRE
 * Ce fichier contient toutes les fonctions de validation réutilisables
 */

// Regex patterns
const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9+\-\s]{8,}$/,
  PASSWORD: {
    HAS_UPPERCASE: /[A-Z]/,
    HAS_NUMBER: /[0-9]/,
    HAS_LOWERCASE: /[a-z]/,
    HAS_SPECIAL: /[!@#$%^&*(),.?":{}|<>]/
  },
  NAME: /^[a-zA-ZÀ-ÿ\s-]{2,}$/,
  POSTAL_CODE: /^[0-9]{4,5}$/
}

/**
 * Validation d'email
 * @param {string} email - L'email à valider
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, message: "L'email est requis" }
  }
  if (!PATTERNS.EMAIL.test(email)) {
    return { isValid: false, message: "Format d'email invalide (exemple: nom@domaine.com)" }
  }
  return { isValid: true, message: '' }
}

/**
 * Validation de mot de passe
 * @param {string} password - Le mot de passe à valider
 * @param {object} options - Options de validation
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePassword = (password, options = { 
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecial: false
}) => {
  if (!password) {
    return { isValid: false, message: "Le mot de passe est requis" }
  }
  
  if (password.length < options.minLength) {
    return { 
      isValid: false, 
      message: `Le mot de passe doit contenir au moins ${options.minLength} caractères` 
    }
  }
  
  if (options.requireUppercase && !PATTERNS.PASSWORD.HAS_UPPERCASE.test(password)) {
    return { 
      isValid: false, 
      message: "Le mot de passe doit contenir au moins une majuscule" 
    }
  }
  
  if (options.requireNumber && !PATTERNS.PASSWORD.HAS_NUMBER.test(password)) {
    return { 
      isValid: false, 
      message: "Le mot de passe doit contenir au moins un chiffre" 
    }
  }
  
  if (options.requireSpecial && !PATTERNS.PASSWORD.HAS_SPECIAL.test(password)) {
    return { 
      isValid: false, 
      message: "Le mot de passe doit contenir au moins un caractère spécial" 
    }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validation de téléphone
 * @param {string} phone - Le numéro à valider
 * @param {number} minDigits - Nombre minimum de chiffres
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePhone = (phone, minDigits = 8) => {
  if (!phone || !phone.trim()) {
    return { isValid: false, message: "Le téléphone est requis" }
  }
  
  // Enlever les espaces, tirets, etc. pour ne compter que les chiffres
  const digitsOnly = phone.replace(/\D/g, '')
  
  if (digitsOnly.length < minDigits) {
    return { 
      isValid: false, 
      message: `Le téléphone doit contenir au moins ${minDigits} chiffres` 
    }
  }
  
  if (!PATTERNS.PHONE.test(phone)) {
    return { 
      isValid: false, 
      message: "Format de téléphone invalide (utilisez +216, 00, espaces)" 
    }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validation de nom/prénom
 * @param {string} name - Le nom à valider
 * @param {string} fieldName - Nom du champ pour le message
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateName = (name, fieldName = 'Nom') => {
  if (!name || !name.trim()) {
    return { isValid: false, message: `Le ${fieldName.toLowerCase()} est requis` }
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} trop court (minimum 2 caractères)` }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validation d'adresse
 * @param {string} address - L'adresse à valider
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return { isValid: false, message: "L'adresse est requise" }
  }
  
  if (address.trim().length < 5) {
    return { isValid: false, message: "L'adresse est trop courte" }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validation de code postal
 * @param {string} postalCode - Le code postal
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode || !postalCode.trim()) {
    return { isValid: false, message: "Le code postal est requis" }
  }
  
  if (!PATTERNS.POSTAL_CODE.test(postalCode)) {
    return { isValid: false, message: "Code postal invalide (4 ou 5 chiffres)" }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validation d'une date
 * @param {string} date - La date à valider (YYYY-MM-DD)
 * @param {object} options - Options (minAge, maxAge)
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateDate = (date, options = { minAge: 18 }) => {
  if (!date) {
    return { isValid: false, message: "La date est requise" }
  }
  
  const birthDate = new Date(date)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  if (age < options.minAge) {
    return { 
      isValid: false, 
      message: `Vous devez avoir au moins ${options.minAge} ans` 
    }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validation d'un formulaire complet
 * @param {object} formData - Les données du formulaire
 * @param {object} validationRules - Règles de validation
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateForm = (formData, validationRules) => {
  const errors = {}
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field]
    
    // Champ requis
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = rules.requiredMessage || `Le champ ${field} est requis`
      continue
    }
    
    // Validation spécifique
    if (rules.validator && value) {
      const result = rules.validator(value)
      if (!result.isValid) {
        errors[field] = result.message
      }
    }
    
    // Validation personnalisée
    if (rules.custom && value) {
      const customResult = rules.custom(value, formData)
      if (customResult) {
        errors[field] = customResult
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Export des patterns pour utilisation ailleurs
export { PATTERNS }