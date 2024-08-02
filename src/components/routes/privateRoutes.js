import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/authContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/" />;
};

export default PrivateRoute;
