// src/pages/Home/index.jsx
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import accueilImage from '../../media/acc.jpg';

export default function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navbar />
      <main className="pt-20 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-8 md:w-1/2">
            <h2 className="text-white text-5xl font-bold leading-tight">
              Suivez vos Finances<br/>
              <span className="text-[#703BF7]">Facilement</span>
            </h2>
            <p className="text-gray-300 text-xl">
              Surveillez vos dépenses, définissez des budgets et atteignez vos objectifs financiers avec nos outils de suivi intuitifs.
            </p>
            <Button 
             variant="primary" 
             size="lg"
             onClick={handleLoginClick}
            >
                Se connecter
            </Button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 max-w-[500px]">
            <div className="bg-[#262626] h-96 rounded-lg flex items-center justify-center">
              <img 
              src={accueilImage} 
              alt="Finance Tracker" 
              className="rounded-lg w-full h-[400px] object-cover shadow-xl"
            />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

