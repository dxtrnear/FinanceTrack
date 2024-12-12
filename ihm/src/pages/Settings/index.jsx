// src/pages/Settings/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const EXPENSE_CATEGORIES = [
  { id: 'logement', label: 'Logement', icon: '🏠' },
  { id: 'alimentation', label: 'Alimentation', icon: '🍎' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'loisirs', label: 'Loisirs', icon: '🎮' },
  { id: 'sante', label: 'Santé', icon: '⚕️' },
  { id: 'autres', label: 'Autres', icon: '📦' }
];

export default function Settings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthlyIncome: '0',
    monthlyBudget: '0',
    savingsGoal: '0'
  });
  const [expenses, setExpenses] = useState(
    EXPENSE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: '0' }), {})
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/connexion');
      return;
    }

    setFormData({
      monthlyIncome: user.USE_MONTHLY_INCOME?.toString() || '0',
      monthlyBudget: user.USE_MONTHLY_BUDGET?.toString() || '0',
      savingsGoal: user.USE_SAVINGS_GOAL?.toString() || '0'
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/connexion');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/auth/settings/${user.USE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyIncome: Number(formData.monthlyIncome),
          monthlyBudget: Number(formData.monthlyBudget),
          savingsGoal: Number(formData.savingsGoal)
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Paramètres sauvegardés avec succès');
      } else {
        throw new Error(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Settings save error:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Settings Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Paramètres Financiers</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-500 text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Revenu mensuel"
                type="number"
                min="0"
                step="0.01"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                required
              />
              
              <Input
                label="Budget mensuel"
                type="number"
                min="0"
                step="0.01"
                value={formData.monthlyBudget}
                onChange={(e) => setFormData({...formData, monthlyBudget: e.target.value})}
                required
              />
              
              <Input
                label="Objectif d'épargne"
                type="number"
                min="0"
                step="0.01"
                value={formData.savingsGoal}
                onChange={(e) => setFormData({...formData, savingsGoal: e.target.value})}
                required
              />

              <Button type="submit" className="w-full bg-[#703BF7] hover:bg-[#5f32d1]">
                Sauvegarder
              </Button>
            </form>
          </Card>

          {/* Budget Calculator */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Calculateur de Budget</h2>
            <div className="space-y-6">
              {EXPENSE_CATEGORIES.map(category => (
                <div key={category.id} className="flex items-center space-x-4">
                  <span className="text-2xl">{category.icon}</span>
                  <Input
                    label={category.label}
                    type="number"
                    min="0"
                    value={expenses[category.id]}
                    onChange={(e) => setExpenses({
                      ...expenses,
                      [category.id]: e.target.value
                    })}
                  />
                </div>
              ))}
              
              <div className="bg-white/5 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-white">
                  <span>Total des dépenses:</span>
                  <span>{Object.values(expenses).reduce((sum, val) => sum + Number(val), 0)}€</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Revenu mensuel:</span>
                  <span>{formData.monthlyIncome}€</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-white">Épargne potentielle:</span>
                  <span className={`${Number(formData.monthlyIncome) - Object.values(expenses).reduce((sum, val) => sum + Number(val), 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(Number(formData.monthlyIncome) - Object.values(expenses).reduce((sum, val) => sum + Number(val), 0)).toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Financial Tips */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Conseils Financiers</h2>
            <div className="space-y-3">
              <p className="text-gray-300">
                💡 La règle 50/30/20 : 50% pour les besoins essentiels, 30% pour les envies, 20% pour l'épargne
              </p>
              <p className="text-gray-300">
                💰 Objectif d'épargne recommandé : {(Number(formData.monthlyIncome) * 0.2).toFixed(2)}€
              </p>
              <p className="text-gray-300">
                📊 Budget logement recommandé : {(Number(formData.monthlyIncome) * 0.33).toFixed(2)}€
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}