import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryHistoryHeader from '../components/inventory/InventoryHistoryHeader';
import InventoryHistoryTable from '../components/inventory/InventoryHistoryTable';
import PageShell from '../components/common/PageShell';
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
    <PageShell>
      <div className="min-w-0">
          <InventoryHistoryHeader onBack={() => navigate('/inventory')} errorMessage={errorMessage} />
          <InventoryHistoryTable activities={activities} />
      </div>
    </PageShell>
  );
}

export default InventoryHistory;
