import React, { useContext, useState } from "react";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AddComment from "../AddComment/AddComment";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";

dayjs.extend(relativeTime);

export default function CommentsSection({ comments, post, setComments, isPost }) {
  const [commentsCount, setCommentsCount] = useState(2);
  const { userToken } = useContext(AuthContext);

  const handleUpdate = async (id, newContent) => {
    try {
      await axios.put(
        `https://linked-posts.routemisr.com/comments/${id}`,
        { content: newContent },
        { headers: { token: userToken } }
      );

      toast.success("Comment updated successfully ✅");

      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, content: newContent } : c))
      );
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://linked-posts.routemisr.com/comments/${id}`,
        { headers: { token: userToken } }
      );

      toast.success("Comment deleted successfully 🗑️");

      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment ❌");
    }
  };

  return (
    <div className="mt-4">
      <div className="max-h-64 pr-2 space-y-4 ">
        {comments?.slice(0, commentsCount)?.map((comment) => (
          <CommentItem
            key={comment?._id || comment?.id}
            comment={comment}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {comments?.length > commentsCount && isPost && (
        <p
          className="text-blue-600 mt-2 text-sm cursor-pointer hover:underline"
          onClick={() => setCommentsCount((prev) => prev + 5)}
        >
          Load more comments
        </p>
      )}

      <div className="mt-4">
        <AddComment postId={post?._id} setComments={setComments} />
      </div>
    </div>
  );
}

function CommentItem({ comment, onUpdate, onDelete }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="py-2 border-b-2 border-gray-100 group relative">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-8 h-8 rounded-full border border-gray-500 flex justify-center items-center hover:bg-black/50 transition-all duration-300 group-hover:bg-black/50">
            <FaUser className="text-xl" />
          </span>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="px-3 py-1 rounded border border-gray-400 focus:outline-none "
              />
              <button
                onClick={() => {
                  onUpdate(comment._id, editedContent);
                  setIsEditing(false);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment?.content);
                }}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="bg-gray-300 px-4 py-1 rounded-full max-w-full overflow-hidden dark:bg-gray-500">
              <p className="text-gray-800 font-semibold truncate group-hover:underline cursor-default dark:text-black">
                {comment?.commentCreator?.name}
              </p>
              <p className="text-gray-500 text-sm break-words px-1 dark:text-gray-900">
                {comment?.content}
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="p-2">
          <button onClick={() => setOpenMenu((prev) => !prev)}>
            <HiDotsVertical className="text-xl text-gray-600 cursor-pointer hover:bg-gray-300 rounded-full p-1" />
          </button>
          </div>

          {openMenu && !isEditing && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-50 text-lg">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setOpenMenu(false);
                }}
                className="flex items-center gap-3 w-full px-5 py-3 hover:bg-blue-100 hover:text-blue-700 transition duration-300 cursor-pointer"
              >
                <FaEdit /> Edit
              </button>

              <button
                onClick={() => {
                  setDeleteModalOpen(true);
                  setOpenMenu(false);
                }}
                className="flex items-center gap-3 w-full px-5 py-3 hover:bg-red-200 hover:text-red-700 transition duration-300 cursor-pointer"
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-800 text-xs ps-14 py-2">
        {dayjs(comment?.createdAt).fromNow()}
      </p>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The comment will be permanently
              deleted.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(comment._id);
                  setDeleteModalOpen(false);
                }}
                className="cursor-pointer px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
