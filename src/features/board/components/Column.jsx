import React from 'react';
import TaskCard from './TaskCard';

const Column = ({ title, id, tasks, onAddTask, onDrop, onDragOver, onDragStart, onEditTask, onConfirmDeleteTask, onConfirmDeleteColumn }) => {
    const columnTasks = tasks.filter(task => task.status === id);

    return (
        <div
            className="flex-1 min-w-[280px] max-w-xs bg-gray-100 rounded-xl p-4 m-2 shadow-md transition-all duration-300 transform hover:shadow-xl md:flex-grow-0 md:min-w-[300px]"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, id)}
        >
            <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold text-gray-800">{title} ({columnTasks.length})</h2>

                <div className="flex space-x-2">
                    <button
                        onClick={() => onAddTask(id)}
                        aria-label={`Add task to ${title}`}
                        className="p-1.5 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onConfirmDeleteColumn(id)}
                        aria-label={`Delete ${title} column`}
                        className="p-1.5 rounded-full bg-red-200 text-red-600 hover:bg-red-300 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className={`flex flex-col space-y-3 overflow-y-auto `}
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#E2E8F0 #F7FAFC' }}
            >
                {columnTasks.length === 0 ? (
                    <div className="text-sm text-gray-500 italic py-6 text-center select-none">
                        No tasks here yet — click the ➕ to add one.
                    </div>
                ) : (
                    columnTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDragStart={(e) => onDragStart(e, task.id)}
                            onEdit={() => onEditTask(task)}
                            onDelete={onConfirmDeleteTask}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Column;
