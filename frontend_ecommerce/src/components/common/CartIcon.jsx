import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';

const CartIcon = () => {
  const { cart } = useCart();
  
  return (
    <Link to="/cart" className="text-gray-600 hover:text-indigo-600 relative">
      <FiShoppingCart size={20} />
      {cart.itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {cart.itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;