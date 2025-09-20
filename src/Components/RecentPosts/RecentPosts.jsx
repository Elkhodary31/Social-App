import React, { useContext } from "react";
import { PostContext } from "../../Context/PostContext";
import { Link } from "react-router-dom";

export default function RecentPosts() {
  const { recentPosts, setRecentPosts } = useContext(PostContext);

  if (recentPosts.length === 0) {
    return null;
  }

  function handleClear() {
    setRecentPosts([]);
  }

  return (
        <div className="">
    <aside className="w-80  max-h-[80vh] p-4 border border-gray-300 bg-gray-50 rounded-lg shadow-lg overflow-y-auto dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Recent Posts</h2>
        <button
          onClick={handleClear}
          className="text-sm text-red-500 hover:underline cursor-pointer transition-all duration-200"
        >
          Clear
        </button>
      </div>

      <ul className="space-y-4">
        {recentPosts.map((post) => (
          <li
            key={post._id}
            className="p-3 rounded-2xl shadow-2xl border border-gray-200 bg-white hover:bg-gray-100 transition-all duration-300 dark:bg-gray-400 dark:hover:bg-gray-100"
          >
            <Link
              to={`/post/${post._id}`}
              className="block text-sm font-medium text-blue-600"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-gray-700">
                  {post.user?.name || "Unknown"}
                </p>
                <span className="text-[10px] text-gray-500">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 text-gray-800 text-sm">
                  {post.body ? post.body.slice(0, 50) : "No content"}
                </div>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
      </div>
  );
}
