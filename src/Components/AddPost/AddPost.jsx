import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import { TbWorld } from "react-icons/tb";
import { BiImageAdd } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { PostContext } from "../../Context/PostContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AddPost({ className = "", post = null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [img, setImg] = useState("");
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(UserContext);
  const { userToken } = useContext(AuthContext);
  const { getPosts } = useContext(PostContext);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setBody("");
        setImg("");
        setShowAddPost(false);
        setErrorMessage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setBody("");
        setImg("");
        setShowAddPost(false);
        setErrorMessage(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function uploadImage(e) {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
      setErrorMessage("");
    }
  }

  function addPost() {
    if (!body && !img) {
      setErrorMessage("Fields are Empty");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    if (body) formData.append("body", body);
    if (img) formData.append("image", img);
    axios
      .post("https://linked-posts.routemisr.com/posts", formData, {
        headers: { token: userToken },
      })
      .then((res) => {
        if (res.data.message === "success") {
          toast.success("Post Added Successfully");
          setShowAddPost(false);
          setBody("");
          setImg("");
          getPosts();
        }
      })
      .catch(() => {
        toast.error("Failed to add post");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className={`pt-16 mt-8 ${className}`}>
      <div className="mt-6 mb-6 flex items-center justify-between mx-auto bg-gray-300 p-4 rounded-2xl max-w-2xl dark:bg-gray-800">
        <Link to={`/profile/${user._id}`}>
          <img
            src={user.photo}
            alt={user.name}
            className="size-12 rounded-full mr-2 border border-gray-500 hover:bg-black/10 cursor-pointer transition-all duration-300"
          />
        </Link>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                     py-3 px-3 cursor-pointer dark:bg-gray-500"
          placeholder={`What is on your mind, ${user?.name || ""}?`}
          onClick={() => setShowAddPost(true)}
          readOnly
        />
      </div>

      {showAddPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-500 rounded-lg relative w-full max-w-2xl mx-auto mt-12 flex flex-col "
          >
            <div className=" p-6">
              <h5 className="text-center text-2xl font-bold border-b border-b-gray-700 mb-2 py-1 dark:text-black">
                Add Post
              </h5>
              <button
                onClick={() => {
                  setBody("");
                  setImg("");
                  setShowAddPost(false);
                }}
                className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-black text-xl cursor-pointer font-semibold transition-all duration-300"
              >
                ✕
              </button>

              <div className="flex gap-3 mb-4 dark:text-black">
                <Link to={`/profile/${user._id}`}>
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="size-12 rounded-full border border-gray-500"
                  />
                </Link>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <TbWorld className="inline me-1" />
                  <p className="inline text-sm text-gray-500">Public</p>
                </div>
              </div>

              <textarea
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg 
                         border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-300"
                placeholder="Write your thoughts here..."
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  setErrorMessage("");
                }}
              ></textarea>

              {!img && (
                <div>
                  <label
                    htmlFor="image-upload"
                    className="relative flex group items-center justify-between p-2 border rounded-full border-gray-300 mt-3 cursor-pointer dark:text-black"
                  >
                    <p className="font-semibold">Add Image To Your Post</p>
                    <BiImageAdd className="text-2xl text-green-500 dark:text-black dark:hover:text-green-500 group-hover:text-black/90" />
                    <span
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                    px-2 py-1 text-xs rounded bg-gray-800 text-white 
                    opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
                    >
                      Add Image
                    </span>
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => uploadImage(e)}
                  />
                </div>
              )}

              {img && (
                <div className="py-3 rounded-2xl relative">
                  <MdDelete
                    className="absolute top-5 right-5 text-2xl rounded-full cursor-pointer hover:bg-white transition-all duration-300"
                    onClick={() => setImg("")}
                  />
                  <img
                    src={URL.createObjectURL(img)}
                    className="max-h-96 w-full rounded-2xl"
                    alt=""
                  />
                </div>
              )}

              {errorMessage && (
                <p className="bg-red-300 font-semibold py-1 mt-2 px-1">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="p-6 border-t border-gray-300 dark:border-gray-700 flex justify-center">
              <button
                disabled={isLoading}
                onClick={addPost}
                className="p-3 rounded-full bg-blue-700 text-white dark:bg-gray-300 dark:text-black dark:hover:bg-black dark:hover:text-white hover:bg-blue-300 hover:text-black transition-all duration-250 text-[15px] font-semibold flex items-center justify-center cursor-pointer w-full max-w-xs"
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <IoIosAddCircleOutline className="inline me-1" />
                    Add Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
