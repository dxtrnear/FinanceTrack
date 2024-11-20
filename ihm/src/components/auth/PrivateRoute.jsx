// src/components/auth/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/connexion" />;
};
