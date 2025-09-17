// src/features/board/components/TaskForm.tsx
import React from "react";
import { useForm } from "react-hook-form";

export type Priority = "High" | "Medium" | "Low";
export type Tech =
  | "FE" // Frontend
  | "BE" // Backend
  | "DB" // Database
  | "ARCH" // Architecture
  | "MISC"; // Miscellaneous

export interface TaskDraft {
  id?: string;
  project?: string;
  status?: string;

  title: string;
  description?: string;
  acceptanceCriteria?: string;

  assignee?: string;
  priority: Priority;
  architecture: Tech;

  storyId?: string; // e.g. "US234567" (may be undefined for new task until save)
  createdAt?: string; // ISO date "YYYY-MM-DD"
  dueDate?: string; // ISO date "YYYY-MM-DD"
}

export interface TaskFormProps {
  task: Partial<TaskDraft>; // you pass a prefilled object in BoardView
  onSave: (task: TaskDraft) => void;
  onCancel: () => void;
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function fmtHuman(d?: string) {
  if (!d) return new Date().toLocaleDateString("en-GB");
  try {
    return new Date(d).toLocaleDateString("en-GB");
  } catch {
    return d;
  }
}

export default function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskDraft>({
    defaultValues: {
      title: task.title ?? "",
      description: task.description ?? "",
      acceptanceCriteria: task.acceptanceCriteria ?? "",
      assignee: task.assignee ?? "",
      priority: (task.priority as Priority) ?? "Low",
      architecture: (task.architecture as Tech) ?? "FE",
      createdAt: task.createdAt ?? toISODate(new Date()),
      dueDate: task.dueDate ?? "",
      // keep any metadata you passed
      id: task.id,
      project: task.project,
      status: task.status,
      storyId: task.storyId,
    },
  });

  const onSubmit = (data: TaskDraft) => {
    // Preserve any immutable fields from the incoming task object
    onSave({
      ...data,
      id: task.id ?? data.id,
      project: task.project ?? data.project,
      status: task.status ?? data.status,
      storyId: task.storyId ?? data.storyId, // BoardView may assign on save if missing
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      {/* User Story banner */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 text-sm font-medium">
          <span>User Story</span>
          <span className="font-semibold">
            {task.storyId ? task.storyId : "Will be assigned on save"}
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Row 1: Title + Technology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              placeholder="Task Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Technology
            </label>
            <select
              {...register("architecture")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="FE">Frontend</option>
              <option value="BE">Backend</option>
              <option value="DB">Database</option>
              <option value="ARCH">Architecture</option>
              <option value="MISC">Miscellaneous</option>
            </select>
          </div>
        </div>

        {/* Row 2: Acceptance Criteria */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Acceptance Criteria
          </label>
          <textarea
            {...register("acceptanceCriteria")}
            placeholder="As a user, I want..., so that..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Row 3: Description */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Detailed description..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Row 4: Assignee + Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Assignee
            </label>
            <input
              {...register("assignee")}
              type="text"
              placeholder="Assignee Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Row 5: Created on + Complete by */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Created on
            </label>
            <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              {fmtHuman(task.createdAt)}
            </p>
            {/* keep createdAt in payload (hidden input) */}
            <input type="hidden" {...register("createdAt")} />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Complete by
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
        >
          Save Task
        </button>
      </div>
    </form>
  );
}
