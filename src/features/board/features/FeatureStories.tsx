import { useQuery } from "@tanstack/react-query";
import { fetchStoriesByFeature } from "api/stories";

const STATUS_COLORS: Record<string, string> = {
  to_do: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  validation: "bg-amber-100 text-amber-700",
  done: "bg-green-100 text-green-700",
};

const FeatureStories = ({ featureId }: { featureId: string }) => {
  const {
    data: stories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stories", featureId],
    queryFn: () => fetchStoriesByFeature(featureId),
    enabled: !!featureId,
  });

  if (isLoading)
    return <p className="text-sm text-gray-500 italic">Loading stories…</p>;

  if (error)
    return (
      <p className="text-sm text-rose-500 italic">
        Failed to load stories — check logs.
      </p>
    );

  if (stories.length === 0)
    return (
      <p className="text-sm text-gray-500 italic">
        No user stories found for this feature.
      </p>
    );

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-800">User Stories:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stories.map((story: any) => (
          <div
            key={story.id}
            className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 hover:bg-indigo-100 transition cursor-pointer"
            onClick={() => (window.location.href = `/board/story/${story.id}`)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-700">
                {story.story_code || story.storyId || "U-?"}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  STATUS_COLORS[story.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {story.status?.replace("_", " ") || "Unknown"}
              </span>
            </div>
            <p className="text-sm text-gray-800 truncate mt-1">
              {story.title || "Untitled Story"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureStories;
