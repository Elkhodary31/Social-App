import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { PostContext } from "../../Context/PostContext";

export default function Search() {
  const { users } = useContext(PostContext);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query)
  );

  return (
    <div className="p-6 max-w-3xl mx-auto pt-32">
      <h2 className="text-2xl font-bold mb-4">Search results for "{query}"</h2>

      {filteredUsers.length > 0 ? (
        <ul className="space-y-3">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center gap-4 p-3 border rounded-lg shadow-sm hover:bg-gray-50"
            >
              <img
                src={user.photo}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
