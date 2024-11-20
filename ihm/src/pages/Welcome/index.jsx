// src/pages/Welcome/index.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

export default function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name || 'Utilisateur';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/connexion');
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Bienvenue {name} !
        </h1>
        <p className="text-gray-400">
          Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion...
        </p>
      </Card>
    </div>
  );
}