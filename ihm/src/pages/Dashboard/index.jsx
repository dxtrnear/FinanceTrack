// src/pages/Dashboard/index.jsx
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';

export default function Dashboard() {
  const sampleData = {
    totalBalance: 5840.23,
    monthlyExpenses: 2150.45,
    monthlySavings: 1200.00,
    recentTransactions: [
      { id: 1, title: 'Courses', amount: -120.50, date: '2024-03-18' },
      { id: 2, title: 'Salaire', amount: 3000.00, date: '2024-03-15' },
      { id: 3, title: 'Factures', amount: -85.20, date: '2024-03-14' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Tableau de bord</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <h3 className="text-gray-400 mb-2">Solde Total</h3>
              <p className="text-2xl font-bold text-white">{sampleData.totalBalance.toLocaleString()}€</p>
            </Card>
            <Card>
              <h3 className="text-gray-400 mb-2">Dépenses Mensuelles</h3>
              <p className="text-2xl font-bold text-[#ff4d4d]">-{sampleData.monthlyExpenses.toLocaleString()}€</p>
            </Card>
            <Card>
              <h3 className="text-gray-400 mb-2">Épargne Mensuelle</h3>
              <p className="text-2xl font-bold text-[#4CAF50]">{sampleData.monthlySavings.toLocaleString()}€</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-white text-xl font-semibold mb-4">Transactions Récentes</h3>
              <div className="space-y-4">
                {sampleData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-[#1A1A1A] rounded-lg">
                    <div>
                      <p className="text-white">{transaction.title}</p>
                      <p className="text-sm text-gray-400">{transaction.date}</p>
                    </div>
                    <p className={`font-semibold ${transaction.amount >= 0 ? 'text-[#4CAF50]' : 'text-[#ff4d4d]'}`}>
                      {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString()}€
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card>
              <h3 className="text-white text-xl font-semibold mb-4">Catégories de Dépenses</h3>
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-400">Graphique à venir</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
