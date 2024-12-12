// src/pages/Dashboard/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { authService } from '../../utils/authService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          navigate('/connexion');
          return;
        }

        const monthlyIncome = parseFloat(user.USE_MONTHLY_INCOME) || 0;
        const monthlyBudget = parseFloat(user.USE_MONTHLY_BUDGET) || 0;
        const savingsGoal = parseFloat(user.USE_SAVINGS_GOAL) || 0;
        
        const possibleMonthlySavings = monthlyIncome - monthlyBudget;
        const monthsToGoal = savingsGoal > 0 ? Math.ceil(savingsGoal / possibleMonthlySavings) : 0;
        
        setUserData({
          ...user,
          possibleMonthlySavings,
          monthsToGoal
        });

      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 px-4">
        <p className="text-white text-center">Chargement...</p>
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 px-4">
        <p className="text-red-500 text-center">{error}</p>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Overview Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Bonjour, {userData?.USE_NAME}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-400">Revenu Mensuel</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(userData?.USE_MONTHLY_INCOME || 0)}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-400">Budget Mensuel</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(userData?.USE_MONTHLY_BUDGET || 0)}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-400">Épargne Possible</p>
                <p className="text-2xl font-bold text-green-500">
                  {formatCurrency(userData?.possibleMonthlySavings || 0)}
                </p>
              </div>
            </div>
          </Card>

          {/* Savings Goal Progress */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Objectif d'épargne</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Progression</span>
                <span className="text-white">
                  {formatCurrency(userData?.possibleMonthlySavings || 0)} / {formatCurrency(userData?.USE_SAVINGS_GOAL || 0)}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4">
                <div
                  className="bg-[#703BF7] h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${calculateProgress(userData?.possibleMonthlySavings || 0, userData?.USE_SAVINGS_GOAL || 0)}%`
                  }}
                />
              </div>
              {userData?.USE_SAVINGS_GOAL > 0 && (
                <p className="text-gray-400">
                  Estimation : {userData?.monthsToGoal} mois pour atteindre votre objectif
                </p>
              )}
            </div>
          </Card>

          {/* Savings Projection Chart */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Projection d'épargne</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[...Array(12)].map((_, i) => ({
                    month: i + 1,
                    savings: (userData?.possibleMonthlySavings || 0) * (i + 1)
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#ffffff77"
                    label={{ value: 'Mois', position: 'insideBottom', offset: -10, fill: '#ffffff77' }}
                  />
                  <YAxis 
                    stroke="#ffffff77"
                    label={{ value: 'Épargne (€)', angle: -90, position: 'insideLeft', fill: '#ffffff77' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff33' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#703BF7" 
                    strokeWidth={2}
                    dot={{ fill: '#703BF7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}