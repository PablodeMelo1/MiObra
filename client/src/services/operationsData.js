import { getItems } from '../api/items';
import { getMaterialRequests } from '../api/materialRequests';
import { getProjects } from '../api/projects';
import { getSuppliers } from '../api/suppliers';
import { getTasksByProjectId } from '../api/tasks';
import { compareDatesAsc, isPastDate, isWithinDays } from '../utils/dates';

const getId = (entity) => entity?._id || entity?.id || '';

const unwrapProjects = (response) => response.data?.projects || response.data || [];
const unwrapTasks = (response) => response.data?.tareas || response.data?.tasks || [];
const unwrapRequests = (response) => response.data?.materialRequests || [];
const unwrapSuppliers = (response) => response.data?.suppliers || [];
const unwrapItems = (response) => response.data || [];

export const normalizeProjectId = (value) => getId(value) || value || '';

export const loadOperationsSnapshot = async () => {
  const [projectsResponse, requestsResponse, itemsResponse, suppliersResponse] = await Promise.all([
    getProjects(),
    getMaterialRequests(),
    getItems(),
    getSuppliers(),
  ]);

  const projects = unwrapProjects(projectsResponse);
  const materialRequests = unwrapRequests(requestsResponse);
  const items = unwrapItems(itemsResponse);
  const suppliers = unwrapSuppliers(suppliersResponse);

  const taskGroups = await Promise.all(
    projects.map(async (project) => {
      try {
        const response = await getTasksByProjectId(getId(project));
        return unwrapTasks(response).map((task) => ({
          ...task,
          projectId: task.projectId || getId(project),
          projectName: project.name,
        }));
      } catch (error) {
        console.error('Error loading project tasks:', error);
        return [];
      }
    }),
  );

  const tasks = taskGroups.flat();

  return {
    projects,
    tasks,
    materialRequests,
    items,
    suppliers,
  };
};

export const getLowStockItems = (items) =>
  items
    .filter((item) => Number(item.availableQuantity ?? 0) <= Math.max(1, Math.ceil(Number(item.totalQuantity ?? 0) * 0.2)))
    .sort((a, b) => Number(a.availableQuantity ?? 0) - Number(b.availableQuantity ?? 0));

export const getOpenMaterialRequests = (requests) =>
  requests.filter((request) => request.status !== 'RECIBIDO');

export const getOverdueTasks = (tasks) =>
  tasks.filter((task) => task.status !== 'DONE' && isPastDate(task.dueDate));

export const getUpcomingTasks = (tasks, days = 7) =>
  tasks
    .filter((task) => task.status !== 'DONE' && isWithinDays(task.dueDate, days))
    .sort((a, b) => compareDatesAsc(a.dueDate, b.dueDate));

export const getUpcomingMaterialArrivals = (requests, days = 14) =>
  requests
    .filter((request) => request.status !== 'RECIBIDO' && isWithinDays(request.arrivalDate, days))
    .sort((a, b) => compareDatesAsc(a.arrivalDate, b.arrivalDate));

export const getProjectRequests = (requests, projectId) =>
  requests.filter((request) => String(normalizeProjectId(request.projectId)) === String(projectId));

export const getProjectTasks = (tasks, projectId) =>
  tasks.filter((task) => String(normalizeProjectId(task.projectId)) === String(projectId));

export const buildCalendarEvents = ({ projects, tasks, materialRequests }) => {
  const events = [];

  projects.forEach((project) => {
    const projectId = getId(project);
    if (project.startDate) {
      events.push({
        id: `project-start-${projectId}`,
        type: 'project',
        date: project.startDate,
        title: `Inicio: ${project.name}`,
        subtitle: project.location || 'Proyecto',
        projectId,
      });
    }
    if (project.endDate) {
      events.push({
        id: `project-end-${projectId}`,
        type: 'project',
        date: project.endDate,
        title: `Fin previsto: ${project.name}`,
        subtitle: project.location || 'Proyecto',
        projectId,
      });
    }
  });

  tasks.forEach((task) => {
    if (!task.dueDate) return;
    events.push({
      id: `task-${getId(task)}`,
      type: 'task',
      date: task.dueDate,
      title: task.title || 'Tarea',
      subtitle: task.projectName || 'Tarea de obra',
      projectId: normalizeProjectId(task.projectId),
      status: task.status,
    });
  });

  materialRequests.forEach((request) => {
    const projectId = normalizeProjectId(request.projectId);
    if (request.orderDate) {
      events.push({
        id: `request-order-${getId(request)}`,
        type: 'material',
        date: request.orderDate,
        title: `Pedido: ${request.materialName}`,
        subtitle: request.projectId?.name || 'Materiales',
        projectId,
        status: request.status,
      });
    }
    if (request.arrivalDate) {
      events.push({
        id: `request-arrival-${getId(request)}`,
        type: 'delivery',
        date: request.arrivalDate,
        title: `Entrega: ${request.materialName}`,
        subtitle: request.supplierId?.name || request.projectId?.name || 'Entrega',
        projectId,
        status: request.status,
      });
    }
  });

  return events.sort((a, b) => compareDatesAsc(a.date, b.date));
};
