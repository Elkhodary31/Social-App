import React, { useState, useRef, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import EditPostModal from "../EditPost/EditPost";

export default function PostOptions({ post, onDelete, onUpdate }) {
  const { userToken } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const menuRef = useRef(null);

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      await axios.delete(`https://linked-posts.routemisr.com/posts/${post._id}`, {
        headers: { token: userToken },
      });
      toast.success("Post Deleted!");
      onDelete?.(post._id);
      setDeleteModalOpen(false);
      setOpenMenu(false);
    } catch (err) {
      toast.error("Error deleting post");
      console.error(err);
    } finally {
      setLoadingDelete(false);
    }
  };

  const closeMenu = () => setOpenMenu(false);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    const handleScroll = () => {
      closeMenu();
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="p-3 rounded-full hover:bg-gray-300 transition duration-300 cursor-pointer"
        aria-label="Open options menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {openMenu && (
        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-40 text-lg">
          <button
            onClick={() => {
              setEditModalOpen(true);
              setOpenMenu(false);
            }}
            className="flex items-center gap-3 w-full px-5 py-3 hover:bg-blue-100 hover:text-blue-700 transition duration-300 cursor-pointer"
          >
            <FaEdit /> Edit
          </button>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-3 w-full px-5 py-3 hover:bg-red-200 hover:text-red-700 transition duration-300 cursor-pointer"
          >
            <FaTrash /> Delete
          </button>
        </div>
      )}

      {editModalOpen && (
        <EditPostModal
          post={post}
          onClose={() => setEditModalOpen(false)}
          onUpdate={onUpdate}
        />
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The post will be permanently deleted.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loadingDelete}
                className="cursor-pointer px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
              >
                {loadingDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
