import { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Tooltip from './components/Tooltip';
import { useAuth } from './features/auth/AuthContext';
import Login from './features/auth/Login';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function App() {
  const { state: authState } = useAuth();

  if (!authState.user) {
    return <Login />;
  }

  return <Dashboard />;
}

function Dashboard() {
  const { state: authState, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectResponse, columnResponse] = await Promise.all([
          fetch('http://localhost:4000/projects'),
          fetch('http://localhost:4000/columns'),
        ]);
        setProjects(await projectResponse.json());
        setColumns(await columnResponse.json());
      } catch (error) {
        console.error('Erreur lors du chargement des donnees:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Chargement...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      {/* Bonus cours: observer la difference useEffect vs useLayoutEffect */}
      <Tooltip />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />
        <MainContent columns={columns} />
      </div>
    </div>
  );
}