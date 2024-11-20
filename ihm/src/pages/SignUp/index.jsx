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
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await authService.signup(formData);
      if (result.message === 'User created successfully') {
        navigate('/welcome', { state: { name: formData.name } });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-white text-3xl font-bold mb-6 text-center">Inscription</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Nom"
              type="text"
              placeholder="Jean Dupont"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              error={errors.name}
              required
            />
            <Input 
              label="Email"
              type="email"
              placeholder="jean@exemple.fr"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              error={errors.email}
              required
            />
            <Input 
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              error={errors.password}
              required
            />
            <Input 
              label="Téléphone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              error={errors.phone}
              required
            />
            <Button variant="primary" type="submit" className="w-full">
              S'inscrire
            </Button>
            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-center">
                {errors.submit}
              </div>
            )}
            <div className="text-center mt-4">
              <p className="text-gray-400">
                Déjà un compte ?{' '}
                <Link to="/login" className="text-[#703BF7] hover:text-[#5f32d1]">
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