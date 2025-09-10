import React from 'react';

const priorityColors = {
  High: 'border-l-4 border-red-500',
  Medium: 'border-l-4 border-yellow-500',
  Low: 'border-l-4 border-green-500',
};

const TaskCard = ({ task, onDragStart, onEdit, onDelete }) => {
  return (
    <div
      className={`p-4 bg-white rounded-lg shadow-sm cursor-grab ${priorityColors[task.priority]} transition-transform duration-200 hover:scale-[1.02]`}
      draggable
      onDragStart={onDragStart}
      onClick={onEdit}
      title={task.description}
    >

      <div className="flex justify-between items-center mb-2">

        {task.architecture && <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">{task.architecture}</span>}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <h4 className="font-semibold text-sm text-gray-800">{task.title}</h4>

      {task.description && <p className="text-sm text-gray-600 break-words mb-4">{task.description}</p>} {/* New line for description */}

      <p className="text-xs text-gray-500 mb-4">
        {task.assignee ? `Assigned to: ${String(task.assignee)}` : 'Unassigned'}
      </p>


    </div>
  );
};

export default TaskCard;
