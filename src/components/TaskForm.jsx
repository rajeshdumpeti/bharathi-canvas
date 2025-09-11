import React, { useState } from 'react';

const TaskForm = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        priority: task.priority,
        architecture: task.architecture,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...task, ...formData });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
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
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description..."
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    ></textarea>
                </div>
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
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Architecture</label>
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
            <div className="flex justify-end space-x-4 mt-6">
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