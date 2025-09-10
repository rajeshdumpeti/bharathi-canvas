import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';
import AddColumnModal from './components/AddColumnModal';
import Column from './components/Column';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage'
import Header from './components/Header'

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
        const initialTasks = [

        ];
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
      console.error("Error loading from localStorage:", error);
    }
    setIsLoading(false);
  }, []);
  // Use onSnapshot to listen for real-time changes to the data
  useEffect(() => {
    setIsLoading(true);
    try {
      const savedTasks = localStorage.getItem('tasks');
      const savedColumns = localStorage.getItem('columns');

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]);
      }

      if (savedColumns) {
        setColumns(JSON.parse(savedColumns));
      } else {
        setColumns([{ id: 'todo', title: 'To Do' }, { id: 'in-progress', title: 'In Progress' }, { id: 'done', title: 'Done' }]);
      }
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


  // Handle drag-and-drop functionality
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');

    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: newColumnId };
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Task actions
  const handleAddTask = (columnId) => {
    if (!selectedProject) {
      // You can add a more sophisticated error message here if needed
      console.error("Please select a project before adding a task.");
      return;
    }
    setEditingTask({ status: columnId, title: '', description: '', assignee: '', priority: 'Low', architecture: 'FE', project: selectedProject.id });
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
    const updatedProjects = projects.filter(p => p.id !== projectToDelete.id);
    const updatedTasks = tasks.filter(task => task.project !== projectToDelete.id);

    setProjects(updatedProjects);
    setTasks(updatedTasks);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Set the selected project to the first one in the new list, or null if none exist
    setSelectedProject(updatedProjects[0] || null);
    setIsProjectDeleteModalOpen(false);
    setProjectToDelete(null);
  };
  const handleDeleteTask = async () => {
    const updatedTasks = tasks.filter(task => task.id !== taskToDeleteId);
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
      updatedTasks = tasks.map(t => t.id === editingTask.id ? { ...dataToSave, id: t.id } : t);
    } else {
      updatedTasks = [...tasks, { ...dataToSave, id: Date.now().toString() }];
    }
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };
  // Column management actions
  const confirmDeleteColumn = (columnId) => {
    setColumnToDeleteId(columnId);
    setIsDeleteColumnModalOpen(true);
  };

  const handleDeleteColumn = async () => {
    const updatedColumns = columns.filter(col => col.id !== columnToDeleteId);
    const updatedTasks = tasks.filter(task => task.status !== columnToDeleteId);

    setColumns(updatedColumns);
    setTasks(updatedTasks);

    localStorage.setItem('columns', JSON.stringify(updatedColumns));
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setIsDeleteColumnModalOpen(false);
    setColumnToDeleteId(null);
  };
  const handleAddColumn = async (newTitle) => {
    if (newTitle) {
      const newColumns = [...columns, { id: newTitle.toLowerCase().replace(/\s+/g, '-'), title: newTitle }];
      setColumns(newColumns);
      localStorage.setItem('columns', JSON.stringify(newColumns));
      setIsColumnModalOpen(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showHamburger={currentView === 'board'}
        showTitle={true}
      />

      {currentView === 'landing' && <LandingPage onStart={() => setCurrentView('board')} />}

      {currentView === 'board' && (
        <div className="flex flex-1">
          <Sidebar
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={handleSelectProject}
            onAddProject={handleAddProject}
            onConfirmDeleteProject={confirmDeleteProject}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            tasks={tasks}
          />

          <div className="flex flex-1 flex-col p-8 transition-all duration-300">
            <div className='flex justify-between'> <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="h-8 w-8 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
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
              </button></div>

            {isLoading ? (
              <div className="flex justify-center items-center h-full text-xl text-gray-600">
                Loading board...
              </div>
            ) : (
              <div className="flex flex-col md:flex-row flex-1 overflow-x-auto md:space-x-4 pb-4">
                {columns.map(column => (
                  <Column
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    tasks={tasks.filter(task => selectedProject && task.project === selectedProject.id)}
                    onAddTask={handleAddTask}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                    onEditTask={handleEditTask}
                    onConfirmDeleteTask={confirmDeleteTask}
                    onConfirmDeleteColumn={confirmDeleteColumn}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Creation/Editing Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask && editingTask.id ? 'Edit Task' : 'New Task'}>
        <TaskForm
          task={editingTask || { title: '', description: '', assignee: '', priority: 'Low', architecture: 'FE', project: selectedProject?.id }}
          onSave={handleSaveTask}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>
      {/* <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask && editingTask.id ? 'Edit Task' : 'New Task'}>
              <TaskForm
                task={editingTask || { title: '', description: '', assignee: '', priority: 'Low', architecture: 'FE' }}
                onSave={handleSaveTask}
                onCancel={() => setIsTaskModalOpen(false)}
              />
            </Modal> */}

      {/* Add Column Modal */}
      <Modal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} title="Add Column">
        <AddColumnModal onSave={handleAddColumn} onCancel={() => setIsColumnModalOpen(false)} />
      </Modal>
      {/* <Modal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} title="Add Column">
              <AddColumnModal onSave={handleAddColumn} onCancel={() => setIsColumnModalOpen(false)} />
            </Modal> */}

      {/* Task Delete Confirmation Modal */}
      <Modal isOpen={isDeleteTaskModalOpen} onClose={() => setIsDeleteTaskModalOpen(false)} title="Confirm Delete">
        <p>Are you sure you want to delete this task?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setIsDeleteTaskModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteTask}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Delete
          </button>
        </div>
      </Modal>
      {/* <Modal isOpen={isDeleteTaskModalOpen} onClose={() => setIsDeleteTaskModalOpen(false)} title="Confirm Delete">
              <p>Are you sure you want to delete this task?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsDeleteTaskModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Delete
                </button>
              </div>
            </Modal> */}

      {/* Column Delete Confirmation Modal */}
      <Modal isOpen={isDeleteColumnModalOpen} onClose={() => setIsDeleteColumnModalOpen(false)} title="Confirm Delete">
        <p>Are you sure you want to delete this column and all its tasks? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setIsDeleteColumnModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteColumn}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* <Modal isOpen={isDeleteColumnModalOpen} onClose={() => setIsDeleteColumnModalOpen(false)} title="Confirm Delete">
              <p>Are you sure you want to delete this column and all its tasks? This action cannot be undone.</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsDeleteColumnModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteColumn}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Delete
                </button>
              </div>
            </Modal> */}

      {/* Project Delete Confirmation Modal */}
      <Modal isOpen={isProjectDeleteModalOpen} onClose={() => setIsProjectDeleteModalOpen(false)} title="Confirm Delete Project">
        <p>Are you sure you want to delete the project "{projectToDelete?.name}"? This will permanently delete all associated tasks. This action cannot be undone.</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setIsProjectDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteProject}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
