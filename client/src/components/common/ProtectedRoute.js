import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
    const role = user.role;
    const userEmail = (user.email || '').toLowerCase();
    const isAllowed = allowedRoles.includes(role) ||
      (allowedRoles.includes('payment_manager') && userEmail === 'payment@larvofashion.com') ||
      (allowedRoles.includes('delivery_manager') && userEmail === 'delivery@larvofashion.com') ||
      (allowedRoles.includes('admin') && userEmail === 'admin@stylehub.com');

    if (!isAllowed) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
