// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Exclusive */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Exclusive</h3>
            <p className="text-gray-400 mb-4">Subscribe</p>
            <p className="text-sm text-gray-400 mb-4">Get 10% off your first order</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-indigo-500"
              />
              <button className="px-4 py-2 bg-indigo-600 rounded-r-lg hover:bg-indigo-700 transition">
                →
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p className="flex items-start">
                <FiMapPin className="mr-2 mt-1 flex-shrink-0" />
                111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
              </p>
              <p className="flex items-center">
                <FiMail className="mr-2" />
                exclusive@gmail.com
              </p>
              <p className="flex items-center">
                <FiPhone className="mr-2" />
                +88015-88888-9999
              </p>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/profile" className="hover:text-indigo-400">My Account</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400">Login / Register</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-400">Wishlist</Link></li>
              <li><Link to="/shop" className="hover:text-indigo-400">Shop</Link></li>
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h4 className="font-semibold mb-4">Quick Link</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/privacy" className="hover:text-indigo-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400">Terms Of Use</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-400">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400">Contact</Link></li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h4 className="font-semibold mb-4">Download App</h4>
            <p className="text-sm text-gray-400 mb-4">Save $3 with App New User Only</p>
            <div className="flex space-x-4 mb-4">
              <img src="/app-store.png" alt="App Store" className="h-10" />
              <img src="/google-play.png" alt="Google Play" className="h-10" />
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400"><FiFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400"><FiTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400"><FiInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400"><FiLinkedin size={20} /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500">
            © Copyright Exclusive {new Date().getFullYear()}. All right reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;