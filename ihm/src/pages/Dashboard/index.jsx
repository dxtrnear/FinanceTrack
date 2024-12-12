// src/pages/Dashboard/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#703BF7', '#48BB78', '#F6AD55', '#F56565', '#4299E1', '#9F7AEA'];

const BUDGET_CATEGORIES = [
  { name: 'Logement', icon: '🏠' },
  { name: 'Alimentation', icon: '🍎' },
  { name: 'Transport', icon: '🚗' },
  { name: 'Loisirs', icon: '🎮' },
  { name: 'Santé', icon: '⚕️' },
  { name: 'Autres', icon: '📦' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/connexion');
      return;
    }
    setUserData(user);
  }, [navigate]);

  const generateProjectionData = () => {
    const monthlyIncome = Number(userData?.USE_MONTHLY_INCOME) || 0;
    const monthlyBudget = Number(userData?.USE_MONTHLY_BUDGET) || 0;
    const monthlySavings = monthlyIncome - monthlyBudget;
    const savingsGoal = Number(userData?.USE_SAVINGS_GOAL) || 0;

    return Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      savings: monthlySavings * (i + 1),
      goal: savingsGoal,
      income: monthlyIncome * (i + 1),
      expenses: monthlyBudget * (i + 1)
    }));
  };

  const generateBudgetData = () => {
    const monthlyBudget = Number(userData?.USE_MONTHLY_BUDGET) || 0;
    return BUDGET_CATEGORIES.map((category, index) => ({
      name: category.name,
      value: (monthlyBudget / BUDGET_CATEGORIES.length).toFixed(2),
      icon: category.icon
    }));
  };

  const calculateProgress = () => {
    const monthlyIncome = Number(userData?.USE_MONTHLY_INCOME) || 0;
    const monthlyBudget = Number(userData?.USE_MONTHLY_BUDGET) || 0;
    const savingsGoal = Number(userData?.USE_SAVINGS_GOAL) || 0;
    const monthlySavings = monthlyIncome - monthlyBudget;

    return {
      savings: monthlySavings,
      monthsToGoal: savingsGoal > 0 ? Math.ceil(savingsGoal / monthlySavings) : 0,
      savingsRate: monthlyIncome > 0 ? ((monthlySavings / monthlyIncome) * 100).toFixed(1) : 0
    };
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">💰</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400">Revenu Mensuel</h3>
                  <p className="text-2xl font-bold text-white">{Number(userData?.USE_MONTHLY_INCOME || 0).toFixed(2)}€</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📊</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400">Budget Mensuel</h3>
                  <p className="text-2xl font-bold text-white">{Number(userData?.USE_MONTHLY_BUDGET || 0).toFixed(2)}€</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400">Objectif d'Épargne</h3>
                  <p className="text-2xl font-bold text-white">{Number(userData?.USE_SAVINGS_GOAL || 0).toFixed(2)}€</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">💸</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400">Épargne Mensuelle</h3>
                  <p className="text-2xl font-bold text-green-500">{progress.savings.toFixed(2)}€</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Savings Projection */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Projection d'Épargne</h2>
                <div className="flex space-x-2">
                  {['month', 'quarter', 'year'].map((period) => (
                    <Button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 text-sm ${
                        selectedPeriod === period 
                          ? 'bg-[#703BF7]' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {period === 'month' ? '1M' : period === 'quarter' ? '3M' : '1Y'}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateProjectionData()}>
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#703BF7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#703BF7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #333',
                        borderRadius: '4px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="savings"
                      stroke="#703BF7"
                      fillOpacity={1}
                      fill="url(#colorSavings)"
                    />
                    <Line
                      type="monotone"
                      dataKey="goal"
                      stroke="#48BB78"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Budget Distribution */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Distribution du Budget</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateBudgetData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {generateBudgetData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #333',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Financial Insights */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Analyses Financières</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Taux d'Épargne</h3>
                <p className="text-3xl font-bold text-green-500">{progress.savingsRate}%</p>
                <p className="text-gray-400 mt-2">de votre revenu mensuel</p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Objectif d'Épargne</h3>
                <p className="text-3xl font-bold text-white">{progress.monthsToGoal} mois</p>
                <p className="text-gray-400 mt-2">pour atteindre votre objectif</p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Règle 50/30/20</h3>
                <p className="text-gray-400">Besoins: {(Number(userData?.USE_MONTHLY_INCOME || 0) * 0.5).toFixed(2)}€</p>
                <p className="text-gray-400">Désirs: {(Number(userData?.USE_MONTHLY_INCOME || 0) * 0.3).toFixed(2)}€</p>
                <p className="text-gray-400">Épargne: {(Number(userData?.USE_MONTHLY_INCOME || 0) * 0.2).toFixed(2)}€</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}