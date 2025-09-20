import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import { MdDelete } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { BiImageAdd } from "react-icons/bi";

export default function EditPostModal({ post, onClose, onUpdate }) {
  const { userToken } = useContext(AuthContext);

  const [body, setBody] = useState(post?.body || "");
  const [existingImg, setExistingImg] = useState(post?.image || "");
  const [newImg, setNewImg] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImg(e.target.files[0]);
      setExistingImg("");
      setErrorMessage("");
    }
  };

  const handleRemoveImage = () => {
    setNewImg(null);
    setExistingImg("");
  };

  const handleSubmit = async () => {
    if (!body.trim() && !existingImg && !newImg) {
      setErrorMessage("Post body or image is required");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("body", body);

      if (newImg) {
        formData.append("image", newImg);
      }

      const res = await axios.put(
        `https://linked-posts.routemisr.com/posts/${post._id}`,
        formData,
        {
          headers: { token: userToken },
        }
      );

      if (res.data.message === "success") {
        toast.success("Post updated successfully");
        onUpdate(res.data.updatedPost || { ...post, body, image: newImg ? URL.createObjectURL(newImg) : existingImg || "" });
        onClose();
      } else {
        throw new Error("Failed to update post");
      }

    } catch (error) {
      toast.error("Error updating post");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 relative w-full max-w-2xl mx-auto mt-12"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl cursor-pointer font-semibold transition-all duration-300"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex gap-3 mb-4">
          <img
            src={post.user?.photo}
            alt={post.user?.name}
            className="size-12 rounded-full border border-gray-500"
          />
          <div>
            <h3 className="font-semibold">{post.user?.name}</h3>
            <TbWorld className="inline me-1" />
            <p className="inline text-sm text-gray-500">Public</p>
          </div>
        </div>

        <textarea
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg 
                     border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Edit your thoughts here..."
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setErrorMessage("");
          }}
        ></textarea>

        {!existingImg && !newImg && (
          <div>
            <label
              htmlFor="edit-image-upload"
              className="relative flex group items-center justify-between p-2 border rounded-full border-gray-300 mt-3 cursor-pointer"
            >
              <p className="font-semibold">Edit Image</p>
              <BiImageAdd className="text-2xl text-green-500 group-hover:text-black/90" />
              <span
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                           px-2 py-1 text-xs rounded bg-gray-800 text-white 
                           opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
              >
                Update Image
              </span>
            </label>
            <input
              type="file"
              id="edit-image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        )}

        {(existingImg || newImg) && (
          <div className="py-3 rounded-2xl relative">
            <MdDelete
              className="absolute top-5 right-5 text-2xl rounded-full cursor-pointer hover:bg-white transition-all duration-300"
              onClick={handleRemoveImage}
              title="Remove Image"
            />
            <img
              src={newImg ? URL.createObjectURL(newImg) : existingImg}
              alt="Post"
              className="h-96 w-full object-contain rounded-lg"
            />
          </div>
        )}

        {errorMessage && (
          <p className="bg-red-300 font-semibold py-1 mt-2 px-1">
            {errorMessage}
          </p>
        )}

        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="mt-3 p-3 rounded-full bg-red-700 text-white hover:bg-blue-300 hover:text-black transition-all duration-250 text-[15px] font-semibold flex items-center justify-center cursor-pointer w-full"
        >
          {isLoading ? "Updating..." : "Update Post"}
        </button>
      </div>
    </div>
  );
}
