import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryHistoryHeader from '../components/inventory/InventoryHistoryHeader';
import InventoryHistoryTable from '../components/inventory/InventoryHistoryTable';
import Sidebar from '../components/sidebar';
import LoadingScreen from '../components/routing/LoadingScreen';
import { useAuth } from '../context/auth-context';
import { getInventoryActivities } from '../api/items';

function InventoryHistory() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const [activities, setActivities] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadHistory = async () => {
      try {
        setLoadingData(true);
        setErrorMessage('');
        const response = await getInventoryActivities({ limit: 500 });
        setActivities(response.data || []);
      } catch (error) {
        console.error('Error loading inventory history:', error);
        setErrorMessage('No se pudo cargar el historial global.');
      } finally {
        setLoadingData(false);
      }
    };

    loadHistory();
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || loadingData) return <LoadingScreen message="Cargando historial..." />;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen items-start gap-4 px-6 py-5">
        <Sidebar />

        <section className="flex-1 p-3">
          <InventoryHistoryHeader onBack={() => navigate('/inventory')} errorMessage={errorMessage} />
          <InventoryHistoryTable activities={activities} />
        </section>
      </div>
    </div>
  );
}

export default InventoryHistory;
