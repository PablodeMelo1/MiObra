import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/routing/LoadingScreen';
import PageShell from '../components/common/PageShell';
import OperationsCalendar from '../components/calendar/OperationsCalendar';
import { useAuth } from '../context/auth-context';
import { buildCalendarEvents, loadOperationsSnapshot } from '../services/operationsData';

function Calendar() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [snapshot, setSnapshot] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setErrorMessage('');
        setSnapshot(await loadOperationsSnapshot());
      } catch (error) {
        console.error('Error loading calendar:', error);
        setErrorMessage('No se pudo cargar el calendario operativo.');
      }
    };

    loadData();
  }, [isAuthenticated, isLoading, navigate]);

  const events = useMemo(() => (snapshot ? buildCalendarEvents(snapshot) : []), [snapshot]);

  if (isLoading || !snapshot) return <LoadingScreen message="Cargando calendario..." />;

  return (
    <PageShell>
      {errorMessage ? <p className="mb-3 text-xs text-rose-200">{errorMessage}</p> : null}
      <OperationsCalendar events={events} projects={snapshot.projects} />
    </PageShell>
  );
}

export default Calendar;
