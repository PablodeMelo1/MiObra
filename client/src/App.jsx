import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectBoard from './pages/ProjectBoard';
import Profile from './pages/Profile';
import Suppliers from './pages/Suppliers';
import MaterialRequests from './pages/MaterialRequests';
import Pendings from './pages/Pendings';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectBoard />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/material-requests" element={<MaterialRequests />} />
          <Route path="/pendings" element={<Pendings />} />
          <Route path="/pendings/create" element={<Pendings />} />
          <Route path="/pendings/:id" element={<Pendings />} />
          <Route path="/pendings/:id/edit" element={<Pendings />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App