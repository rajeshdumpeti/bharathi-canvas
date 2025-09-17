import React, { useState } from "react";

type Props = {
  onSave: (title: string) => void;
  onCancel: () => void;
};

const AddColumnModal: React.FC<Props> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState<string>("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSave(title);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Column</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Column Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Backlog"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
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
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Add Column
        </button>
      </div>
    </form>
  );
};

export default AddColumnModal;
