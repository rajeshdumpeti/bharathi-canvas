import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';
import AddColumnModal from './components/AddColumnModal';
import Column from './components/Column';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Header from './components/Header';

import './index.css';

// Main App component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [columnToDeleteId, setColumnToDeleteId] = useState(null);
  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  const [isProjectDeleteModalOpen, setIsProjectDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [currentView, setCurrentView] = useState('landing');

  useEffect(() => {
    setIsLoading(true);
    try {
      // Load projects and tasks from localStorage
      const savedProjects = localStorage.getItem('projects');
      const savedTasks = localStorage.getItem('tasks');
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      const parsedProjects = savedProjects ? JSON.parse(savedProjects) : [];

      if (parsedProjects.length === 0) {
        // Initialize with a default project if none exist
        const defaultProject = { id: 'upa-pool-league', name: 'UPA Pool League' };
        parsedProjects.push(defaultProject);
        // Pre-populate tasks for the default project
        const initialTasks = [];
        setTasks(initialTasks);
        localStorage.setItem('tasks', JSON.stringify(initialTasks));
      } else {
        setTasks(parsedTasks);
      }
      setProjects(parsedProjects);
      setSelectedProject(parsedProjects[0]);

      const savedColumns = localStorage.getItem('columns');
      if (savedColumns) {
        setColumns(JSON.parse(savedColumns));
      } else {
        setColumns([{ id: 'to-do', title: 'To Do' }, { id: 'in-progress', title: 'In Progress' }, { id: 'done', title: 'Done' }]);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    try {
      const savedProjects = localStorage.getItem('projects');
      const savedTasks = localStorage.getItem('tasks');
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      let parsedProjects = savedProjects ? JSON.parse(savedProjects) : [];

      if (parsedProjects.length === 0) {
        const defaultProject = { id: 'upa-pool-league', name: 'UPA Pool League', columns: [{ id: 'to-do', title: 'To Do' }, { id: 'in-progress', title: 'In Progress' }, { id: 'done', title: 'Done' }] };
        parsedProjects = [defaultProject];
        const initialTasks = [
          { id: 'task-1', title: 'Design Match Scoring Feature', description: 'Create wireframes and mockups for the new scoring system.', assignee: 'Sarah', priority: 'High', architecture: 'FE', status: 'to-do', project: 'upa-pool-league' },
          { id: 'task-2', title: 'Set up Firebase Backend', description: 'Configure Firebase Authentication and Firestore rules.', assignee: 'Mark', priority: 'Medium', architecture: 'BE', status: 'in-progress', project: 'upa-pool-league' },
          { id: 'task-3', title: 'Develop User Profile Page', description: 'Build the profile page with user stats and history.', assignee: 'Laura', priority: 'Low', architecture: 'FE', status: 'done', project: 'upa-pool-league' },
        ];
        setTasks(initialTasks);
        localStorage.setItem('tasks', JSON.stringify(initialTasks));
        localStorage.setItem('projects', JSON.stringify(parsedProjects));
      } else {
        setTasks(parsedTasks);
      }
      setProjects(parsedProjects);
      const selected = parsedProjects[0];
      setSelectedProject(selected);
      setColumns(selected.columns || [{ id: 'to-do', title: 'To Do' }, { id: 'in-progress', title: 'In Progress' }, { id: 'done', title: 'Done' }]);
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  const handleAddProject = (projectName) => {
    if (!projectName) return;
    const newProject = {
      id: `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: projectName,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setSelectedProject(newProject);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newColumnId } : task
    );

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleAddTask = (columnId) => {
    if (!selectedProject) {
      console.error('Please select a project before adding a task.');
      return;
    }
    setEditingTask({
      status: columnId,
      title: '',
      description: '',
      assignee: '',
      priority: 'Low',
      architecture: 'FE',
      project: selectedProject.id,
    });
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const confirmDeleteTask = (taskId) => {
    setTaskToDeleteId(taskId);
    setIsDeleteTaskModalOpen(true);
  };

  const confirmDeleteProject = (project) => {
    setProjectToDelete(project);
    setIsProjectDeleteModalOpen(true);
  };

  const handleDeleteProject = () => {
    const updatedProjects = projects.filter((p) => p.id !== projectToDelete.id);
    const updatedTasks = tasks.filter((task) => task.project !== projectToDelete.id);

    setProjects(updatedProjects);
    setTasks(updatedTasks);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setSelectedProject(updatedProjects[0] || null);
    setIsProjectDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleDeleteTask = async () => {
    const updatedTasks = tasks.filter((task) => task.id !== taskToDeleteId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setIsDeleteTaskModalOpen(false);
    setTaskToDeleteId(null);
  };

  const handleSaveTask = (taskData) => {
    const dataToSave = {
      ...taskData,
      id: taskData.id || `task-${Date.now()}`,
      project: selectedProject?.id,
    };

    let updatedTasks;
    if (editingTask && editingTask.id) {
      updatedTasks = tasks.map((t) =>
        t.id === editingTask.id ? { ...dataToSave, id: t.id } : t
      );
    } else {
      updatedTasks = [...tasks, { ...dataToSave, id: Date.now().toString() }];
    }
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const confirmDeleteColumn = (columnId) => {
    setColumnToDeleteId(columnId);
    setIsDeleteColumnModalOpen(true);
  };

  const handleDeleteColumn = () => {
    if (!selectedProject) return;
    const updatedColumns = columns.filter(col => col.id !== columnToDeleteId);
    const updatedTasks = tasks.filter(task => task.status !== columnToDeleteId);

    setColumns(updatedColumns);
    setTasks(updatedTasks);

    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id ? { ...p, columns: updatedColumns } : p
    );
    setProjects(updatedProjects);

    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setIsDeleteColumnModalOpen(false);
    setColumnToDeleteId(null);
  };

  const handleAddColumn = (newTitle) => {
    if (!newTitle || !selectedProject) return;
    const newColumns = [...columns, { id: newTitle.toLowerCase().replace(/\s+/g, '-'), title: newTitle }];
    setColumns(newColumns);
    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id ? { ...p, columns: newColumns } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setIsColumnModalOpen(false);
  };
  return (
    <div className="relative flex min-h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">


      {currentView === 'landing' && <LandingPage onStart={() => setCurrentView('board')} />}

      {currentView === 'board' && (
        <div className="flex md:flex-row flex-col flex-1">
          <Sidebar
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={handleSelectProject}
            onAddProject={handleAddProject}
            onConfirmDeleteProject={confirmDeleteProject}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            tasks={tasks}
            className="w-1/5 min-h-full bg-gray-900 text-white transition-all duration-300 ease-in-out"
          />

          <div className="flex-1 flex-col ml-2 bg-white rounded-lg shadow-md p-6 transition-all duration-300">

            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                {selectedProject ? selectedProject.name : 'Select a Project'}
              </h1>
              <button
                onClick={() => setIsColumnModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors font-semibold flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Column
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-full text-xl text-gray-600">
                Loading board...
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto p-4 pt-16">
                <div className="flex flex-row space-x-4 pb-4">
                  {columns.map((column) => (
                    <Column
                      key={column.id}
                      id={column.id}
                      title={column.title}
                      tasks={tasks.filter((task) => selectedProject && task.project === selectedProject.id)}
                      onAddTask={handleAddTask}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragStart={handleDragStart}
                      onEditTask={handleEditTask}
                      onConfirmDeleteTask={confirmDeleteTask}
                      onConfirmDeleteColumn={confirmDeleteColumn}
                      className="bg-white rounded-lg shadow-md p-4 min-w-[250px] hover:shadow-lg transition-shadow duration-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={editingTask && editingTask.id ? 'Edit Task' : 'New Task'}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <TaskForm
          task={editingTask || { title: '', description: '', assignee: '', priority: 'Low', architecture: 'FE', project: selectedProject?.id }}
          onSave={handleSaveTask}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        title="Add Column"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <AddColumnModal onSave={handleAddColumn} onCancel={() => setIsColumnModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isDeleteTaskModalOpen}
        onClose={() => setIsDeleteTaskModalOpen(false)}
        title="Confirm Delete"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <p className="text-gray-700">Are you sure you want to delete this task?</p>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setIsDeleteTaskModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteTask}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteColumnModalOpen}
        onClose={() => setIsDeleteColumnModalOpen(false)}
        title="Confirm Delete"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <p className="text-gray-700">Are you sure you want to delete this column and all its tasks? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setIsDeleteColumnModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteColumn}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isProjectDeleteModalOpen}
        onClose={() => setIsProjectDeleteModalOpen(false)}
        title="Confirm Delete Project"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <p className="text-gray-700">
          Are you sure you want to delete the project "{projectToDelete?.name}"? This will permanently delete all associated tasks. This action
          cannot be undone.
        </p>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setIsProjectDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteProject}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;