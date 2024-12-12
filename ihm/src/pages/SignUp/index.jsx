// src/pages/SignUp/index.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../utils/authService';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await authService.signup(formData);
      if (result.user) {
        navigate('/welcome', { state: { userName: formData.name } });
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-white text-3xl font-bold mb-6 text-center">Inscription</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Nom"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input 
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <Input 
              label="Téléphone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            <Button type="submit" className="w-full">
              S'inscrire
            </Button>
            <div className="text-center mt-4">
              <p className="text-gray-400">
                Déjà un compte ?{' '}
                <Link to="/connexion" className="text-[#703BF7] hover:text-[#5f32d1]">
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}