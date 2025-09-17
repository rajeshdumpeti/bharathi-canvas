import React from "react";
import type { Task } from "../../../types/board";

const priorityColors: Record<NonNullable<Task["priority"]>, string> = {
  High: "border-l-4 border-red-500",
  Medium: "border-l-4 border-yellow-500",
  Low: "border-l-4 border-green-500",
};

export interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onEdit: () => void;
  onDelete?: (taskId: string) => void; // not used in UI right now, kept for parity
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onEdit }) => {
  return (
    <div
      className={`p-4 bg-white rounded-lg shadow-sm cursor-grab ${priorityColors[task.priority]} transition-transform duration-200 hover:scale-[1.02]`}
      draggable
      onDragStart={onDragStart}
      onClick={onEdit}
    >
      <div className="flex justify-between items-center mb-2">
        {task.storyId && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
            {task.storyId}
          </span>
        )}

        {task.architecture && (
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
            {task.architecture}
          </span>
        )}
      </div>

      <h4 className="font-semibold text-gray-900">{task.title}</h4>

      {task.description && (
        <p className="text-sm text-gray-600 break-words whitespace-pre-line mb-3">
          {task.description}
        </p>
      )}

      <div className="space-y-1 text-xs text-gray-500 mb-2">
        <p>
          {task.assignee
            ? `Assigned to: ${String(task.assignee)}`
            : "Unassigned"}
        </p>
        {task.createdAt && <p>Created on: {task.createdAt}</p>}
        {task.dueDate && <p>Complete by: {task.dueDate}</p>}
      </div>
    </div>
  );
};

export default TaskCard;
