import React, { useState } from 'react';

const TaskForm = ({ task, onSave, onCancel }) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');

    const [formData, setFormData] = useState({
        title: task.title || '',
        description: task.description || '',
        assignee: task.assignee || '',
        priority: task.priority || 'Low',
        architecture: task.architecture || 'FE',
        acceptanceCriteria: task.acceptanceCriteria || task.story || '',
        createdAt: task.createdAt || new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        dueDate: task.dueDate || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Preserve any existing task.storyId if present; ID auto-assignment happens in BoardView next step
        onSave({ ...task, ...formData, storyId: task.storyId });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
                {/* Header row: show Story ID if present */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                    <div className="text-sm">
                        <span className="mr-2 text-gray-500">User Story #:</span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                            {task.storyId ? task.storyId : 'Assigned on save'}
                        </span>
                    </div>
                </div>

                {/* Row 1: Title + Technology */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Task Title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Technology</label>
                        <select
                            name="architecture"
                            value={formData.architecture}
                            onChange={handleChange}
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

                {/* NEW Row: User Story paragraph */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Acceptance Criteria</label>
                    <textarea
                        name="acceptanceCriteria"
                        value={formData.acceptanceCriteria}
                        onChange={handleChange}
                        placeholder="Given [context], when [action], then [outcome]..."
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                {/* Row: Description (full width) */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description..."
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                {/* Row: Assignee + Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Assignee</label>
                        <input
                            type="text"
                            name="assignee"
                            value={formData.assignee}
                            onChange={handleChange}
                            placeholder="Assignee Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>

                {/* Row: Created on + Complete by */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Created on</label>
                        <p className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 transition-all">
                            {formattedDate}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Complete by</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
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
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    Save Task
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
