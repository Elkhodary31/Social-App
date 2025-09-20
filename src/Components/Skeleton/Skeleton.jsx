import React from "react";

export default function PostSkeleton({ className = "", mx = "mx-auto max-w-2xl" }) {
  return (
    <div className={`py-3 px-2 ${className}`}>
      <div className={`bg-gray-200 p-8 rounded-lg shadow-md w-full ${mx} animate-pulse dark:bg-gray-800`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gray-400"></div>
            <div>
              <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
        </div>

        {/* Body */}
        <div className="mb-4">
          <div className="h-4 w-full bg-gray-400 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        </div>

        {/* Image */}
        <div className="mb-4">
          <div className="w-full h-64 bg-gray-400 rounded"></div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between text-gray-500">
          <div className="h-5 w-24 bg-gray-400 rounded"></div>
          <div className="h-5 w-16 bg-gray-400 rounded"></div>
        </div>

        <hr className="mt-2 mb-2" />

        {/* Comments */}
        <div className="mt-4 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-400"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-400 rounded mb-2"></div>
                <div className="h-3 w-48 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
          <div className="h-10 w-full bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  );
}
