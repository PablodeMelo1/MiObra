import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import LoadingScreen from '../components/routing/LoadingScreen';
import { getProjectById, updateProject } from '../api/projects';
import {
  createTask,
  deleteTask,
  getTasksByProjectId,
  moveTaskToList,
  updateTask,
} from '../api/tasks';
import { getUsers } from '../api/user';
import { createProjectMember, getProjectMembers } from '../api/projectMembers';
import { useAuth } from '../context/auth-context';
import BoardHeader from '../components/projectBoard/BoardHeader';
import BoardColumn from '../components/projectBoard/BoardColumn';
import ProjectSettingsModal from '../components/projectBoard/ProjectSettingsModal';
import RenameColumnModal from '../components/projectBoard/RenameColumnModal';
import TaskModal from '../components/projectBoard/TaskModal';
import { groupTasksByList, toInputDate } from '../components/projectBoard/boardUtils';
import { DEFAULT_PROJECT_MEMBER_ROLE } from '../constants/projectBoard';

function ProjectBoard() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [boardMessage, setBoardMessage] = useState('');

  const [draggingTaskId, setDraggingTaskId] = useState('');
  const [draggingListName, setDraggingListName] = useState('');

  const [newListName, setNewListName] = useState('');

  const [projectSettingsOpen, setProjectSettingsOpen] = useState(false);
  const [newMember, setNewMember] = useState({ userId: '', role: DEFAULT_PROJECT_MEMBER_ROLE });
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
  });

  const [renameColumnModal, setRenameColumnModal] = useState({
    isOpen: false,
    currentName: '',
    nextName: '',
  });

  const [taskModal, setTaskModal] = useState({
    isOpen: false,
    mode: 'create',
    taskId: '',
    list: '',
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'PENDING',
    priority: 'MEDIUM',
    list: '',
    dueDate: '',
  });

  const lists = useMemo(() => {
    if (!project?.lists || project.lists.length === 0) return ['Tareas pendientes'];
    return project.lists;
  }, [project]);

  const tasksByList = useMemo(() => groupTasksByList(tasks, lists), [tasks, lists]);

  const selectedTask = useMemo(
    () => tasks.find((task) => (task._id || task.id) === taskModal.taskId) || null,
    [taskModal.taskId, tasks],
  );

  const userNameById = (userId) => {
    const normalized = typeof userId === 'string' ? userId : userId?._id;
    const user = users.find((candidate) => (candidate._id || candidate.id) === normalized);
    return user?.name || user?.email || normalized || 'Usuario';
  };

  const normalizedMemberUserIds = useMemo(
    () => new Set(projectMembers.map((member) => String(member.userId))),
    [projectMembers],
  );

  const availableUsersForMembers = useMemo(
    () => users.filter((user) => !normalizedMemberUserIds.has(String(user._id || user.id))),
    [users, normalizedMemberUserIds],
  );

  const membersWithUserData = useMemo(
    () =>
      projectMembers.map((member) => {
        const user = users.find(
          (candidate) => String(candidate._id || candidate.id) === String(member.userId),
        );
        return {
          memberId: member._id || member.id,
          userId: member.userId,
          role: member.role,
          name: user?.name || '',
          email: user?.email || '',
        };
      }),
    [projectMembers, users],
  );

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProjectBoard = async () => {
      try {
        setLoadingData(true);
        setErrorMessage('');

        const [projectResponse, tasksResponse, usersResponse, membersResponse] = await Promise.all([
          getProjectById(projectId),
          getTasksByProjectId(projectId),
          getUsers(),
          getProjectMembers(projectId),
        ]);

        setProject(projectResponse.data?.project || null);
        setTasks(tasksResponse.data?.tareas || []);
        setUsers(usersResponse.data || []);
        setProjectMembers(membersResponse.data?.members || []);
      } catch (error) {
        console.error('Error loading project board:', error);
        setErrorMessage('No se pudo cargar el tablero del proyecto');
      } finally {
        setLoadingData(false);
      }
    };

    fetchProjectBoard();
  }, [isAuthenticated, isLoading, navigate, projectId]);

  useEffect(() => {
    if (!project) return;
    setProjectForm({
      name: project.name || '',
      description: project.description || '',
      location: project.location || '',
      startDate: toInputDate(project.startDate),
      endDate: toInputDate(project.endDate),
    });
  }, [project]);

  useEffect(() => {
    if (!boardMessage) return undefined;

    const timeout = window.setTimeout(() => {
      setBoardMessage('');
    }, 4500);

    return () => window.clearTimeout(timeout);
  }, [boardMessage]);

  const clearBoardMessage = () => {
    setBoardMessage('');
  };

  const handleNewListNameChange = (value) => {
    clearBoardMessage();
    setNewListName(value);
  };

  const reorderColumns = async (sourceListName, targetListName) => {
    if (sourceListName === targetListName) return;

    const sourceIndex = lists.indexOf(sourceListName);
    const targetIndex = lists.indexOf(targetListName);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const previousLists = [...lists];
    const reordered = [...previousLists];
    const [movedList] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedList);

    setProject((prev) => (prev ? { ...prev, lists: reordered } : prev));

    try {
      await updateProject(projectId, { lists: reordered });
    } catch (error) {
      console.error('Error reordering lists:', error);
      setProject((prev) => (prev ? { ...prev, lists: previousLists } : prev));
    } finally {
      setDraggingListName('');
    }
  };

  const moveTaskBetweenColumns = async (taskId, targetList) => {
    const currentTask = tasks.find((task) => (task._id || task.id) === taskId);
    if (!currentTask || currentTask.list === targetList) {
      setDraggingTaskId('');
      return;
    }

    const previousList = currentTask.list;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        (task._id || task.id) === taskId ? { ...task, list: targetList } : task,
      ),
    );

    try {
      await moveTaskToList(projectId, taskId, targetList);
    } catch (error) {
      console.error('Error moving task:', error);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          (task._id || task.id) === taskId ? { ...task, list: previousList } : task,
        ),
      );
    } finally {
      setDraggingTaskId('');
    }
  };

  const handleColumnDrop = async (event, targetListName) => {
    event.preventDefault();

    const sourceListName = event.dataTransfer.getData('text/column-name');
    if (sourceListName) {
      await reorderColumns(sourceListName, targetListName);
      return;
    }

    const taskId = event.dataTransfer.getData('text/task-id');
    if (taskId) {
      await moveTaskBetweenColumns(taskId, targetListName);
    }
  };

  const handleTaskDragStart = (event, task) => {
    const taskId = task._id || task.id;
    setDraggingTaskId(taskId);
    event.dataTransfer.setData('text/task-id', taskId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDragStart = (event, listName) => {
    setDraggingListName(listName);
    event.dataTransfer.setData('text/column-name', listName);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddList = async (event) => {
    event.preventDefault();

    const cleanName = newListName.trim();
    if (!cleanName || !project) return;
    if (lists.some((listName) => listName.toLowerCase() === cleanName.toLowerCase())) {
      setBoardMessage('Ya existe una columna con ese nombre.');
      return;
    }

    const nextLists = [...lists, cleanName];

    try {
      setBoardMessage('');
      const response = await updateProject(projectId, { lists: nextLists });
      const updatedProject = response.data?.project || response.data;
      setProject(updatedProject);
      setNewListName('');
    } catch (error) {
      console.error('Error creating list:', error);
      setBoardMessage('No se pudo crear la columna.');
    }
  };

  const handleDeleteList = async (listName) => {
    const listTasksCount = tasksByList[listName]?.length || 0;
    if (listTasksCount > 0) {
      setBoardMessage('No se puede borrar una columna que tiene tareas.');
      return;
    }

    if (lists.length <= 1) {
      setBoardMessage('Debe quedar al menos una columna en el proyecto.');
      return;
    }

    const nextLists = lists.filter((name) => name !== listName);

    try {
      setBoardMessage('');
      const response = await updateProject(projectId, { lists: nextLists });
      const updatedProject = response.data?.project || response.data;
      setProject(updatedProject);
    } catch (error) {
      console.error('Error deleting list:', error);
      setBoardMessage('No se pudo borrar la columna.');
    }
  };

  const openRenameColumnModal = (listName) => {
    clearBoardMessage();
    setRenameColumnModal({
      isOpen: true,
      currentName: listName,
      nextName: listName,
    });
  };

  const closeRenameColumnModal = () => {
    clearBoardMessage();
    setRenameColumnModal({ isOpen: false, currentName: '', nextName: '' });
  };

  const handleRenameColumnSubmit = async (event) => {
    event.preventDefault();

    const oldName = renameColumnModal.currentName;
    const cleanNewName = renameColumnModal.nextName.trim();
    if (!oldName || !cleanNewName) return;

    if (cleanNewName.toLowerCase() === oldName.toLowerCase()) {
      closeRenameColumnModal();
      return;
    }

    if (lists.some((listName) => listName.toLowerCase() === cleanNewName.toLowerCase())) {
      setBoardMessage('Ya existe una columna con ese nombre.');
      return;
    }

    const nextLists = lists.map((listName) => (listName === oldName ? cleanNewName : listName));
    const tasksToMove = tasksByList[oldName] || [];

    try {
      setBoardMessage('');
      const response = await updateProject(projectId, { lists: nextLists });
      const updatedProject = response.data?.project || response.data;

      if (tasksToMove.length > 0) {
        await Promise.all(
          tasksToMove.map((task) => moveTaskToList(projectId, task._id || task.id, cleanNewName)),
        );
      }

      setProject(updatedProject);
      setTasks((prev) =>
        prev.map((task) => (task.list === oldName ? { ...task, list: cleanNewName } : task)),
      );
      closeRenameColumnModal();
    } catch (error) {
      console.error('Error renaming column:', error);
      setBoardMessage('No se pudo renombrar la columna.');
    }
  };

  const openProjectSettings = () => {
    clearBoardMessage();
    setProjectSettingsOpen(true);
  };

  const closeProjectSettings = () => {
    clearBoardMessage();
    setProjectSettingsOpen(false);
  };

  const handleNewMemberChange = (field, value) => {
    clearBoardMessage();
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProjectMember = async () => {
    const userId = newMember.userId;
    if (!userId) {
      setBoardMessage('Selecciona un usuario para agregar como miembro.');
      return;
    }

    if (normalizedMemberUserIds.has(String(userId))) {
      setBoardMessage('Ese usuario ya es miembro del proyecto.');
      return;
    }

    try {
      setBoardMessage('');
      const response = await createProjectMember({
        projectId,
        userId,
        role: newMember.role || 'READ',
      });
      setProjectMembers((prev) => [response.data, ...prev]);
      setNewMember({ userId: '', role: DEFAULT_PROJECT_MEMBER_ROLE });
    } catch (error) {
      console.error('Error adding project member:', error);
      setBoardMessage('No se pudo agregar el miembro al proyecto.');
    }
  };

  const handleProjectFormChange = (field, value) => {
    clearBoardMessage();
    setProjectForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectSettingsSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: projectForm.name.trim(),
      description: projectForm.description,
      location: projectForm.location,
      startDate: projectForm.startDate || null,
      endDate: projectForm.endDate || null,
      lists,
    };

    if (!payload.name) {
      setBoardMessage('El nombre del proyecto es obligatorio.');
      return;
    }

    try {
      setBoardMessage('');
      const response = await updateProject(projectId, payload);
      const updatedProject = response.data?.project || response.data;
      setProject(updatedProject);
      closeProjectSettings();
    } catch (error) {
      console.error('Error updating project settings:', error);
      setBoardMessage('No se pudo guardar la configuracion del proyecto.');
    }
  };

  const openCreateTaskModal = (listName) => {
    clearBoardMessage();
    setTaskForm({
      title: '',
      description: '',
      assignedTo: '',
      status: 'PENDING',
      priority: 'MEDIUM',
      list: listName,
      dueDate: '',
    });
    setTaskModal({ isOpen: true, mode: 'create', taskId: '', list: listName });
  };

  const openEditTaskModal = (task) => {
    clearBoardMessage();
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
      status: task.status || 'PENDING',
      priority: task.priority || 'MEDIUM',
      list: task.list || lists[0] || 'Tareas pendientes',
      dueDate: toInputDate(task.dueDate),
    });
    setTaskModal({ isOpen: true, mode: 'edit', taskId: task._id || task.id, list: task.list });
  };

  const openDeleteTaskModal = (task) => {
    clearBoardMessage();
    setTaskModal({ isOpen: true, mode: 'delete', taskId: task._id || task.id, list: task.list });
  };

  const closeTaskModal = () => {
    clearBoardMessage();
    setTaskModal({ isOpen: false, mode: 'create', taskId: '', list: '' });
  };

  const handleTaskFormChange = (field, value) => {
    clearBoardMessage();
    setTaskForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTaskSubmit = async (event) => {
    if (event) event.preventDefault();

    if (taskModal.mode === 'delete') {
      try {
        await deleteTask(projectId, taskModal.taskId);
        setTasks((prev) => prev.filter((task) => (task._id || task.id) !== taskModal.taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        closeTaskModal();
      }
      return;
    }

    const cleanTitle = taskForm.title.trim();
    const cleanDescription = taskForm.description.trim();
    if (!cleanTitle || !cleanDescription) return;

    const payload = {
      projectId,
      title: cleanTitle,
      description: cleanDescription,
      assignedTo: taskForm.assignedTo || null,
      status: taskForm.status,
      priority: taskForm.priority,
      list: taskForm.list,
      dueDate: taskForm.dueDate || null,
    };

    try {
      if (taskModal.mode === 'create') {
        const response = await createTask(projectId, payload);
        setTasks((prev) => [response.data, ...prev]);
      }

      if (taskModal.mode === 'edit') {
        const response = await updateTask(projectId, taskModal.taskId, payload);
        const updatedTask = response.data?.tarea || response.data;
        setTasks((prev) =>
          prev.map((task) => ((task._id || task.id) === taskModal.taskId ? updatedTask : task)),
        );
      }

      closeTaskModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (isLoading || loadingData) return <LoadingScreen message="Cargando tablero..." />;

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#0c0f14] text-white">
        <div className="flex min-h-screen flex-col items-stretch gap-4 px-3 py-3 sm:px-5 lg:flex-row lg:items-start lg:px-6 lg:py-5">
          <Sidebar />
          <p className="mt-5 text-white/70">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen flex-col items-stretch gap-4 px-3 py-3 sm:px-5 lg:flex-row lg:items-start lg:px-6 lg:py-5">
        <Sidebar />

        <section className="min-w-0 flex-1 p-0 sm:p-3">
          <div className="min-h-screen rounded-xl border border-white/10 bg-[#10141d] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <BoardHeader
              project={project}
              boardMessage={boardMessage}
              newListName={newListName}
              onOpenProjectSettings={openProjectSettings}
              onNewListNameChange={handleNewListNameChange}
              onAddList={handleAddList}
            />

            <div className="flex min-h-[70vh] items-start gap-2 overflow-x-auto overflow-y-visible pb-1">
              {lists.map((listName) => (
                <BoardColumn
                  key={listName}
                  listName={listName}
                  columnTasks={tasksByList[listName] || []}
                  draggingListName={draggingListName}
                  draggingTaskId={draggingTaskId}
                  onColumnDrop={handleColumnDrop}
                  onColumnDragStart={handleColumnDragStart}
                  onRenameColumn={openRenameColumnModal}
                  onCreateTask={openCreateTaskModal}
                  onDeleteColumn={handleDeleteList}
                  onTaskDragStart={handleTaskDragStart}
                  onEditTask={openEditTaskModal}
                  onDeleteTask={openDeleteTaskModal}
                  getAssignedLabel={userNameById}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <TaskModal
        isOpen={taskModal.isOpen}
        mode={taskModal.mode}
        form={taskForm}
        users={users}
        lists={lists}
        onClose={closeTaskModal}
        onChange={handleTaskFormChange}
        onSubmit={handleTaskSubmit}
        referenceTask={selectedTask}
      />

      <ProjectSettingsModal
        isOpen={projectSettingsOpen}
        form={projectForm}
        members={membersWithUserData}
        availableUsers={availableUsersForMembers}
        newMember={newMember}
        onClose={closeProjectSettings}
        onChange={handleProjectFormChange}
        onMemberChange={handleNewMemberChange}
        onAddMember={handleAddProjectMember}
        onSubmit={handleProjectSettingsSubmit}
      />

      <RenameColumnModal
        isOpen={renameColumnModal.isOpen}
        currentName={renameColumnModal.currentName}
        nextName={renameColumnModal.nextName}
        onClose={closeRenameColumnModal}
        onChange={(value) => {
          clearBoardMessage();
          setRenameColumnModal((prev) => ({ ...prev, nextName: value }));
        }}
        onSubmit={handleRenameColumnSubmit}
      />
    </div>
  );
}

export default ProjectBoard;
