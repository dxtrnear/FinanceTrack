// src/pages/Settings/index.jsx
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Settings() {
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Paramètres</h1>
          
          <Card className="mb-6">
            <h2 className="text-white text-xl font-semibold mb-4">Revenus Mensuels</h2>
            <div className="space-y-4">
              <Input 
                label="Salaire Mensuel" 
                type="number" 
                placeholder="3000"
              />
              <Input 
                label="Revenus Additionnels" 
                type="number" 
                placeholder="0"
              />
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="text-white text-xl font-semibold mb-4">Dépenses Fixes</h2>
            <div className="space-y-4">
              <Input 
                label="Loyer/Crédit" 
                type="number" 
                placeholder="1000"
              />
              <Input 
                label="Charges" 
                type="number" 
                placeholder="200"
              />
              <Input 
                label="Assurances" 
                type="number" 
                placeholder="100"
              />
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="text-white text-xl font-semibold mb-4">Objectifs d'Épargne</h2>
            <div className="space-y-4">
              <Input 
                label="Objectif Mensuel d'Épargne" 
                type="number" 
                placeholder="500"
              />
              <Input 
                label="Objectif Fond d'Urgence" 
                type="number" 
                placeholder="10000"
              />
            </div>
          </Card>

          <Button variant="primary" className="w-full">
            Enregistrer les Paramètres
          </Button>
        </div>
      </main>
    </div>
  );
}