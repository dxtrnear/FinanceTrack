// src/components/auth/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { authService } from '../../utils/authService';

export const PrivateRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  console.log("Current user in PrivateRoute:", user); // Debug log
  
  if (!user) {
    return <Navigate to="/connexion" />;
  }
  
  return children;
};