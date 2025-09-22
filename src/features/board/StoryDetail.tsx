import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoryById, bugsByStory } from "./features/storage";

const StoryDetail: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const story = storyId ? getStoryById(storyId) : null;
  const bugs = storyId ? bugsByStory(storyId) : [];

  if (!story) return <div className="p-6">Story not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-3 rounded-md border px-3 py-1 hover:bg-gray-50"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold">{story.title}</h1>
      <p className="text-sm text-gray-600 mt-1">{story.status}</p>

      <div className="mt-6 rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-2">Bugs</h2>
        {bugs.length === 0 ? (
          <p className="text-gray-600">No bugs filed yet.</p>
        ) : (
          <ul className="space-y-2">
            {bugs.map((b) => (
              <li key={b.id} className="rounded border px-3 py-2">
                <div className="font-medium">{b.title}</div>
                <div className="text-xs text-gray-500">
                  {b.severity} • {b.priority} • {b.status}
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* Hook your existing "Add Bug" UI here */}
        <button className="mt-3 rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
          + Add Bug
        </button>
      </div>
    </div>
  );
};

export default StoryDetail;
