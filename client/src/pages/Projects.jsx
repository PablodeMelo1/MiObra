import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import LoadingScreen from '../components/routing/LoadingScreen';
import { useAuth } from '../context/auth-context';
import { createProject, getProjects } from '../api/projects';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import ProjectsHeader from '../components/projects/ProjectsHeader';
import ProjectsList from '../components/projects/ProjectsList';

function Projects() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [createError, setCreateError] = useState('');
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    listsText: '',
  });

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await getProjects();
        setProjects(response.data?.projects || response.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || loadingProjects) return <LoadingScreen message="Cargando proyectos..." />;

  const handleProjectFormChange = (field, value) => {
    setProjectForm((prev) => ({ ...prev, [field]: value }));
  };

  const closeProjectModal = () => {
    setProjectModalOpen(false);
    setCreateError('');
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();

    const name = projectForm.name.trim();
    if (!name) {
      setCreateError('El nombre del proyecto es obligatorio.');
      return;
    }

    const lists = projectForm.listsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      name,
      description: projectForm.description,
      location: projectForm.location,
      startDate: projectForm.startDate || undefined,
      endDate: projectForm.endDate || undefined,
      lists: lists.length > 0 ? lists : undefined,
    };

    try {
      setCreateError('');
      const response = await createProject(payload);
      const createdProject = response.data;
      setProjects((prev) => [createdProject, ...prev]);
      setProjectForm({
        name: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        listsText: '',
      });
      setProjectModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      setCreateError('No se pudo crear el proyecto.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen items-start gap-4 px-6 py-5">
        <Sidebar />

        <section className="flex-1 p-3">
          <ProjectsHeader onOpenCreate={() => setProjectModalOpen(true)} />
          <ProjectsList projects={projects} />
        </section>
      </div>

      <CreateProjectModal
        isOpen={projectModalOpen}
        form={projectForm}
        error={createError}
        onClose={closeProjectModal}
        onChange={handleProjectFormChange}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}

export default Projects;
