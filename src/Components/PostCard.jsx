import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaComments, FaShare, FaUser, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import PostOptions from "./Posts/PostOptions";
import { PostContext } from "../Context/PostContext";
import toast from "react-hot-toast";
import CommentSection from "./CommentSection/CommentSection";

export default function PostCard({
  post: initialPost,
  className = "",
  mx = "mx-auto max-w-2xl",
  onDelete,
  refreshPosts,
}) {
  const { createPost } = useContext(PostContext);
  const location = useLocation();
  const isProfile = location.pathname.includes("profile");
  const isPost = location.pathname.includes("post");

  dayjs.extend(relativeTime);
  dayjs.locale("en");

  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([...post?.comments ?? []]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = (updatedPost) => {
    setPost(updatedPost);
  };

  const handleShare = () => {
    const formData = new FormData();
    formData.append("body", post.body);

    if (post.image) {
      fetch(post.image)
        .then((res) => res.blob())
        .then((blob) => {
          formData.append("image", blob, "shared-image.jpg");
          createPost(formData).then(() => {
            toast.success("Post Shared Successfully!");
            if (refreshPosts) refreshPosts();
          });
        })
        .catch(() => {
          toast.error("Couldn't share post with image");
        });
    } else {
      createPost(formData).then(() => {
        toast.success("Post Shared Successfully!");
        if (refreshPosts) refreshPosts();
      });
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  return (
    <div className={`py-3 px-2 ${className} custom-scroll`}>
      <div className={`bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-md w-full ${mx} overflow-hidden `}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 group dark:text-white">
            <img
              src={post?.user?.photo}
              alt={post?.user?.name}
              className="w-10 h-10 rounded-full border border-gray-500 group-hover:bg-black/50 transition-all duration-300"
            />
            <Link
                to={`/post/${post?._id}`}
              
            >
              <p className="text-gray-800 font-semibold text-large group-hover:underline cursor-ponter transition-all duration-300 dark:text-white">
                {post?.user?.name}
              </p>
              <div
                className="text-gray-500 text-sm  group-hover:underline transition-all duration-300"
              >
                {dayjs(post?.createdAt).fromNow()}
              </div>
            </Link>
          </div>
          <div className="relative z-20">
            {isProfile && (
              <PostOptions post={post} onDelete={onDelete} onUpdate={handleUpdate} />
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-800 dark:text-white">{post?.body}</p>
        </div>

        <div className="mb-4">
          {post?.image && (
            <img
              src={post?.image}
              alt="Post"
              onClick={() => setIsModalOpen(true)}
              className="w-full max-w-full h-80 object-contain mx-auto cursor-pointer hover:opacity-80"
            />
          )}
        </div>

        <div className="flex items-center justify-between dark:text-gray-300 text-gray-500">
          <Link
            to={`/post/${post._id}`}
            className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-50 dark:hover:text-black rounded-full p-1 duration-300 cursor-pointer"
          >
            <FaComments />
            <span>{comments?.length > 0 ? comments?.length : "No"} Comments</span>
          </Link>
          <button
            onClick={handleShare}
            className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1 duration-300 cursor-pointer dark:hover:text-black"
          >
            <FaShare />
            <span>Share</span>
          </button>
        </div>

        <hr className="mt-2 mb-2" />
          
        <CommentSection 
          comments={comments} 
          post={post} 
          setComments={setComments} 
          isPost={isPost} 
        />

      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white bg-black rounded-full p-2 hover:bg-gray-700 cursor-pointer transition-all duration-300"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>
            <img
              src={post?.image}
              alt="Full Size"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
