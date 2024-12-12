// src/pages/Settings/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../utils/authService';

export default function Settings() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    monthlyIncome: '0',
    monthlyBudget: '0',
    savingsGoal: '0'
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/connexion');
      return;
    }

    setValues({
      monthlyIncome: user.USE_MONTHLY_INCOME?.toString() || '0',
      monthlyBudget: user.USE_MONTHLY_BUDGET?.toString() || '0',
      savingsGoal: user.USE_SAVINGS_GOAL?.toString() || '0'
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      const result = await authService.updateSettings({
        monthlyIncome: parseFloat(values.monthlyIncome),
        monthlyBudget: parseFloat(values.monthlyBudget),
        savingsGoal: parseFloat(values.savingsGoal)
      });

      if (result.user) {
        setStatus({
          type: 'success',
          message: 'Paramètres sauvegardés avec succès'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erreur lors de la sauvegarde'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Paramètres Financiers</h2>
            
            {status.message && (
              <div className={`mb-4 p-3 rounded ${
                status.type === 'error' 
                  ? 'bg-red-500/10 border border-red-500/50 text-red-500'
                  : 'bg-green-500/10 border border-green-500/50 text-green-500'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Revenu mensuel"
                type="number"
                min="0"
                step="0.01"
                value={values.monthlyIncome}
                onChange={(e) => setValues({...values, monthlyIncome: e.target.value})}
                required
              />
              
              <Input
                label="Budget mensuel"
                type="number"
                min="0"
                step="0.01"
                value={values.monthlyBudget}
                onChange={(e) => setValues({...values, monthlyBudget: e.target.value})}
                required
              />
              
              <Input
                label="Objectif d'épargne"
                type="number"
                min="0"
                step="0.01"
                value={values.savingsGoal}
                onChange={(e) => setValues({...values, savingsGoal: e.target.value})}
                required
              />

              <Button type="submit" className="w-full bg-[#703BF7] hover:bg-[#5f32d1]">
                Sauvegarder
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}