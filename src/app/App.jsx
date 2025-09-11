import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';
import TaskForm from '../features/board/components/TaskForm';
import AddColumnModal from '../features/board/components/AddColumnModal';
import Column from '../features/board/components/Column';
import Sidebar from '../features/board/components/Sidebar';
import LandingPage from '../features/landing/LandingPage';
import Header from '../layout/Header';

import '../index';

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
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

  // Refs for the columns rail & per-column anchors (for tab scrolling)
  const columnsRef = useRef(null);
  const columnRefs = useRef({});

  const scrollColumnsBy = (delta) => {
    if (!columnsRef.current) return;
    columnsRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };
  const scrollToColumn = (colId) => {
    const el = columnRefs.current[colId];
    if (!el || !columnsRef.current) return;
    const parent = columnsRef.current;
    const left = el.offsetLeft - 16; // small padding offset
    parent.scrollTo({ left, behavior: 'smooth' });
  };

  // --- First loader (kept from your code) ---
  useEffect(() => {
    setIsLoading(true);
    try {
      // Load projects and tasks from localStorage (no default project)
      const savedProjects = localStorage.getItem('projects');
      const savedTasks = localStorage.getItem('tasks');

      const parsedProjects = savedProjects ? JSON.parse(savedProjects) : [];
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

      setProjects(parsedProjects);
      setTasks(parsedTasks);

      // Do not auto-select; second effect will try to restore a stored selection
      setSelectedProject(null);
      setColumns([]); // columns are derived from selected project later
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    setIsLoading(false);
  }, []);


  // --- Second loader with persisted selection / columns sync (enhanced) ---
  useEffect(() => {
    setIsLoading(true);
    try {
      const savedProjects = localStorage.getItem('projects');
      const savedTasks = localStorage.getItem('tasks');
      const storedSelectedId = localStorage.getItem('selectedProjectId');

      const parsedProjects = savedProjects ? JSON.parse(savedProjects) : [];
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

      setProjects(parsedProjects);
      setTasks(parsedTasks);

      if (parsedProjects.length > 0) {
        const selected =
          parsedProjects.find((p) => p.id === storedSelectedId) || null;
        setSelectedProject(selected);
        setColumns(selected?.columns || []);
      } else {
        setSelectedProject(null);
        setColumns([]);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    setIsLoading(false);
  }, []);


  const handleAddProject = (projectName) => {
    if (!projectName) return;
    const defaultCols = [
      { id: 'to-do', title: 'To Do' },
      { id: 'in-progress', title: 'In Progress' },
      { id: 'done', title: 'Done' },
    ];
    const newProject = {
      id: `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: projectName,
      // Always start with an independent copy of defaults
      columns: [...defaultCols],
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    setSelectedProject(newProject);
    setColumns([...defaultCols]);
    localStorage.setItem('selectedProjectId', newProject.id);
  };


  const handleSelectProject = (project) => {
    const defaultCols = [
      { id: 'to-do', title: 'To Do' },
      { id: 'in-progress', title: 'In Progress' },
      { id: 'done', title: 'Done' },
    ];
    setSelectedProject(project);
    // If a project has no columns yet, show a *fresh* default set—not the current board's columns
    setColumns(project?.columns ?? defaultCols);
    localStorage.setItem('selectedProjectId', project?.id || '');
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

    const nextSelected = updatedProjects[0] || null;
    setSelectedProject(nextSelected);
    setColumns(
      nextSelected?.columns || [
        { id: 'to-do', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
      ]
    );

    if (nextSelected) {
      localStorage.setItem('selectedProjectId', nextSelected.id);
    } else {
      localStorage.removeItem('selectedProjectId');
    }

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
    const newColumns = [
      ...columns,
      { id: newTitle.toLowerCase().replace(/\s+/g, '-'), title: newTitle },
    ];

    setColumns(newColumns);

    const updatedProjects = projects.map((p) =>
      p.id === selectedProject.id ? { ...p, columns: newColumns } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    setSelectedProject((prev) =>
      prev && prev.id === selectedProject.id ? { ...prev, columns: newColumns } : prev
    );

    setIsColumnModalOpen(false);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 font-sans text-gray-800">
      {currentView === 'landing' && <LandingPage onStart={() => setCurrentView('board')} />}

      {currentView === 'board' && (
        <>
          {/* Header row (fixed height, not moving) */}
          <div className="w-full bg-gray-900">
            <Header
              onToggleSidebar={() => setIsSidebarOpen((s) => !s)}
              showHamburger={true}
              showTitle={true}
            />
          </div>

          {/* Middle row: the only scroll container that holds Sidebar + Content */}
          <div className="flex-1 min-h-0 w-full">
            <div className="relative h-full w-full flex overflow-hidden">
              {/* Backdrop for mobile/tablet */}
              <div
                onClick={() => setIsSidebarOpen(false)}
                className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300
                  ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              ></div>

              {/* Sidebar (scrollable on its own) */}
              <aside
                aria-label="Project sidebar"
                className={`
                  fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white
                  transform transition-transform duration-300 ease-in-out
                  border-r border-gray-800 overflow-y-auto shrink-0
                  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                  lg:translate-x-0 lg:transform-none
                `}
              >
                <div className="h-full p-4">
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
                </div>
              </aside>

              {/* Right content area (independently scrollable) */}
              <main className="flex-1 min-w-0 h-full overflow-auto">
                <div className="h-full flex flex-col">
                  {/* Title bar (inside centered container) */}
                  <div className="bg-white border-b">
                    <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {selectedProject ? selectedProject.name : 'Welcome'}
                      </h1>
                      <button
                        onClick={() => selectedProject && setIsColumnModalOpen(true)}
                        disabled={!selectedProject}
                        className={`px-4 py-2 rounded-lg shadow-md font-semibold flex items-center
      ${selectedProject
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Column
                      </button>
                    </div>


                  </div>

                  {/* Content body (tabs sticky within this scroll area + columns rail) */}
                  {isLoading ? (
                    <div className="flex-1 flex items-center justify-center text-xl text-gray-600">
                      Loading board...
                    </div>
                  ) : !selectedProject ? (
                    <div className="flex-1 overflow-auto">
                      <div className="mx-auto max-w-3xl px-6 py-12">
                        <div className="rounded-xl border bg-white p-8 shadow-sm">
                          <h2 className="text-2xl font-semibold mb-3">Create your first project</h2>
                          <p className="text-gray-600">
                            Use the <span className="font-medium">“New project name”</span> field in the left sidebar to add a project.
                            Once created, we’ll auto-add the columns <em>To Do</em>, <em>In Progress</em>, and <em>Done</em>.
                          </p>
                          <ul className="mt-6 space-y-2 text-gray-700 list-disc pl-5">
                            <li>Your projects appear in the left panel.</li>
                            <li>Click a project to open its board here.</li>
                            <li>Use “Add Column” to customize the workflow.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 min-h-0 flex flex-col">
                      {/* Top tabs bar sticky within main scroll */}
                      <div className="bg-white border-b sticky top-0 z-10">
                        <div className="mx-auto w-full max-w-7xl flex items-center gap-3 px-4 py-3">
                          <button
                            aria-label="Scroll left"
                            onClick={() => scrollColumnsBy(-320)}
                            className={`${columns.length > 1 ? 'flex' : 'hidden'} h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white hover:bg-gray-50`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 15.707a1 1 0 010-1.414L8.414 10l3.879-4.293a1 1 0 10-1.586-1.414l-5 5a1 1 0 000 1.414l5 5a1 1 0 001.586-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>

                          <div className="relative flex-1 overflow-hidden">
                            <div className="flex gap-2 overflow-x-auto tabs-scrollbar">
                              {columns.map((c) => (
                                <button
                                  key={`tab-${c.id}`}
                                  onClick={() => scrollToColumn(c.id)}
                                  className="px-3 py-1.5 rounded-full text-sm border bg-gray-50 hover:bg-white hover:shadow-sm whitespace-nowrap"
                                >
                                  {c.title}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            aria-label="Scroll right"
                            onClick={() => scrollColumnsBy(320)}
                            className={`${columns.length > 1 ? 'flex' : 'hidden'} h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white hover:bg-gray-50`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.707 4.293a1 1 0 010 1.414L11.586 10l-3.879 4.293a1 1 0 101.586 1.414l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.586 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Columns rail (horizontal scroll only; vertical scroll handled by main) */}
                      <div className="flex-1 min-h-0">
                        <div
                          ref={columnsRef}
                          className="mx-auto w-full max-w-7xl h-full px-4 py-6 overflow-x-auto overflow-y-visible board-scrollbar"
                        >
                          <div className="flex flex-row gap-4 pb-6">
                            {columns.map((column) => (
                              <div
                                key={`wrap-${column.id}`}
                                ref={(el) => (columnRefs.current[column.id] = el)}
                                className="min-w-[320px] max-w-[360px]"
                              >
                                <Column
                                  id={column.id}
                                  title={column.title}
                                  tasks={tasks.filter(
                                    (task) => selectedProject && task.project === selectedProject.id
                                  )}
                                  onAddTask={handleAddTask}
                                  onDrop={handleDrop}
                                  onDragOver={handleDragOver}
                                  onDragStart={handleDragStart}
                                  onEditTask={handleEditTask}
                                  onConfirmDeleteTask={confirmDeleteTask}
                                  onConfirmDeleteColumn={confirmDeleteColumn}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>

          {/* Footer row (fixed height, not moving) */}
          <footer className="h-10 flex items-center justify-center text-xs text-gray-500 bg-white border-t">
            © {new Date().getFullYear()} Bharathi’s Canvas
          </footer>
        </>
      )}

      {/* Modals */}
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
      {/* Document Modal */}
      <Modal
        isOpen={isDocumentsOpen}
        onClose={() => setIsDocumentsOpen(false)}
        title="Documents"
        className="bg-white rounded-xl shadow-lg p-6 max-w-5xl w-full"
      >
      </Modal>

    </div>
  );
};

export default App;
