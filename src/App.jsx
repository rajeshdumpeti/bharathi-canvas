import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';
import AddColumnModal from './components/AddColumnModal';
import Column from './components/Column';
import './index.css';

// Main App component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [columnToDeleteId, setColumnToDeleteId] = useState(null);
  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);



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
    setEditingTask({ status: columnId, title: '', description: '', assignee: '', priority: 'Low', architecture: 'FE' });
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

  const handleDeleteTask = async () => {
    const updatedTasks = tasks.filter(task => task.id !== taskToDeleteId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setIsDeleteTaskModalOpen(false);
    setTaskToDeleteId(null);
  };

  const handleSaveTask = async (taskData) => {
    const now = new Date();
    const dataToSave = {
      ...taskData,
      createdAt: now.toISOString(),
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
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-800 overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <svg className="h-8 w-8 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          Bharathi's Canvas
        </h1>
        <div className="flex items-center space-x-2">
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
      </div>


      {isLoading ? (
        <div className="flex justify-center items-center h-full text-xl text-gray-600">
          Loading board...
        </div>
      ) : (
        <div className="flex flex-1 overflow-x-auto space-x-4 pb-4">
          {columns.map(column => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks}
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

      {/* Task Creation/Editing Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask && editingTask.id ? 'Edit Task' : 'New Task'}>
        <TaskForm
          task={editingTask || { title: '', description: '', assignee: '', priority: 'Low', architecture: 'FE' }}
          onSave={handleSaveTask}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>

      {/* Add Column Modal */}
      <Modal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} title="Add Column">
        <AddColumnModal onSave={handleAddColumn} onCancel={() => setIsColumnModalOpen(false)} />
      </Modal>

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


    </div>
  );
};

export default App;
