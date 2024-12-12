// src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../utils/authService';

export function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/connexion');
  };

  return (
    <nav className="fixed w-full bg-[#1A1A1A] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white text-xl font-bold">
            FinanceTrack
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/tableau-de-bord" className="text-gray-300 hover:text-white">
                  Tableau de bord
                </Link>
                <Link to="/conseils" className="text-gray-300 hover:text-white">
                  Conseils
                </Link>
                <Link to="/parametres" className="text-gray-300 hover:text-white">
                  Paramètres
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="text-gray-300 hover:text-white">
                  Connexion
                </Link>
                <Link to="/inscription" className="text-[#703BF7] hover:text-[#5f32d1]">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}