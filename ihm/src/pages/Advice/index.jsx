// src/pages/Advice/index.jsx
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';

export default function Advice() {
  const conseils = [
    {
      title: "Règle 50/30/20",
      description: "Allouez 50% de vos revenus aux besoins essentiels, 30% aux envies, et 20% à l'épargne et au remboursement des dettes."
    },
    {
      title: "Fonds d'Urgence",
      description: "Constituez un fonds d'urgence couvrant 3 à 6 mois de dépenses."
    },
    {
      title: "Suivez Chaque Dépense",
      description: "Surveillez toutes vos dépenses pour identifier les domaines où vous pouvez réduire."
    },
    {
      title: "Automatisez l'Épargne",
      description: "Mettez en place des virements automatiques vers votre compte d'épargne le jour de la paie."
    }
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Conseils Financiers</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conseils.map((conseil, index) => (
              <Card key={index}>
                <h3 className="text-[#703BF7] text-xl font-semibold mb-3">{conseil.title}</h3>
                <p className="text-gray-300">{conseil.description}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <h2 className="text-white text-2xl font-bold mb-4">Recommandations Personnalisées</h2>
            <p className="text-gray-300 mb-4">
              En fonction de vos habitudes de dépenses, voici quelques conseils personnalisés pour améliorer votre santé financière :
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Envisagez de réduire les dépenses de restauration</li>
              <li>Cherchez à minimiser les services par abonnement</li>
              <li>Augmentez votre épargne mensuelle de 5%</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}