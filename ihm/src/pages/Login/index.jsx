// src/pages/Login/index.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../utils/authService';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await authService.login(credentials);
      if (result.user) {
        navigate('/tableau-de-bord');
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  }; 

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-white text-3xl font-bold mb-6 text-center">Connexion</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Email" 
              type="email" 
              placeholder="jean@exemple.fr"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
            <Input 
              label="Mot de passe" 
              type="password" 
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
            <Button variant="primary" type="submit" className="w-full">
              Se connecter
            </Button>
            <div className="text-center mt-4">
              <p className="text-gray-400">
                Pas encore de compte ?{' '}
                <Link to="/signup" className="text-[#703BF7] hover:text-[#5f32d1]">
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}