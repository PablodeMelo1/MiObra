import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectBoard from './pages/ProjectBoard';
import Profile from './pages/Profile';
import Suppliers from './pages/Suppliers';
import MaterialRequests from './pages/MaterialRequests';
import Pendings from './pages/Pendings';
import Inventory from './pages/Inventory';
import InventoryItemDetails from './pages/InventoryItemDetails';
import InventoryHistory from './pages/InventoryHistory';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectBoard />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/material-requests" element={<MaterialRequests />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/history" element={<InventoryHistory />} />
            <Route path="/inventory/:id" element={<InventoryItemDetails />} />
            <Route path="/pendings" element={<Pendings />} />
            <Route path="/pendings/create" element={<Pendings />} />
            <Route path="/pendings/:id" element={<Pendings />} />
            <Route path="/pendings/:id/edit" element={<Pendings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
