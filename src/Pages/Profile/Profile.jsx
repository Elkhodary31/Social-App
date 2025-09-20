import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { PostContext } from "../../Context/PostContext";
import PostCard from "../../Components/PostCard";
import AddPost from "../../Components/AddPost/AddPost";
import { IoSettingsOutline } from "react-icons/io5";
import { BiImageAdd } from "react-icons/bi";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import PostSkeleton from "../../Components/Skeleton/Skeleton";
import { UserContext } from "../../Context/UserContext";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [img, setImg] = useState("");
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(20);
  const { id } = useParams();
  const modalRef = useRef(null);
  const { userToken } = useContext(AuthContext);
  const { createPost, deletePost } = useContext(PostContext);
  const { user, updateProfilePhoto, loading } = useContext(UserContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateProfilePhoto(file).then((newUser) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.user._id === newUser._id ? { ...post, user: newUser } : post
        )
      );
    });
  };

  const handleDelete = async (postId) => {
    await deletePost(postId);
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const getUserPosts = () => {
    setLoadingPosts(true);
    axios
      .get(`https://linked-posts.routemisr.com/users/${id}/posts`, {
        params: { limit },
        headers: { token: userToken },
      })
      .then((res) => {
        setPosts(res.data.posts || []);
      })
      .catch(() => {})
      .finally(() => setLoadingPosts(false));
  };

  const handleCreatePost = async () => {
    if (!body && !img) {
      setErrorMessage("Post content or image is required.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("body", body);
    if (img) formData.append("image", img);
    try {
      await createPost(formData);
      setBody("");
      setImg("");
      setShowAddPost(false);
      getUserPosts();
    } catch {
      setErrorMessage("Failed to create post.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2
      ) {
        setLimit((prev) => prev + 10);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (userToken) {
      getUserPosts();
      console.log("getUserPosts");
    }
  }, [limit]);

  return (
    <>
    <title>Profile</title>
      <div className="flex flex-col items-center justify-center gap-4 pt-36 bg-gray-800 max-w-2xl mx-auto rounded-lg relative">
        <Link
          to="/settings/user-data"
          className="absolute top-25 right-5 flex flex-col items-center text-white hover:text-black group"
        >
          <div className="rounded-full p-2 hover:bg-gray-300">
            <IoSettingsOutline className="transition-transform duration-700 hover:rotate-[360deg] text-3xl" />
          </div>
        </Link>
        <div className="relative inline-block">
          {loading ? (
            <div className="w-28 h-28 rounded-full border-4 border-blue-500 mx-auto animate-pulse bg-gray-300" />
          ) : (
            <img
              src={user?.photo}
              alt={user?.name}
              className="rounded-full border-4 border-blue-500 w-28 h-28 mx-auto"
            />
          )}
          <label htmlFor="upload-photo">
            <MdModeEdit
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700"
              size={28}
            />
          </label>
          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <h2 className="py-2 text-4xl text-white mb-3 font-semibold">
          {user.name}
        </h2>
      </div>

      <AddPost className="!mt-0 !pt-0" onClick={() => setShowAddPost(true)} />

      {loadingPosts && <PostSkeleton />}

      <div>
        {posts.toReversed().map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDelete={() => handleDelete(post._id)}
            refreshPosts={getUserPosts}
          />
        ))}
        <div role="status" className="text-center py-5"></div>
      </div>

      {showAddPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 relative w-full max-w-2xl mx-auto mt-12"
          >
            <button
              onClick={() => {
                setBody("");
                setImg("");
                setShowAddPost(false);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl cursor-pointer font-semibold"
            >
              ✕
            </button>

            <div className="flex gap-3 mb-4">
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
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="relative flex group items-center justify-between p-2 border rounded-full border-gray-300 mt-3 cursor-pointer"
                >
                  <p className="font-semibold">Add Image To Your Post</p>
                  <BiImageAdd className="text-2xl text-green-500 group-hover:text-black/90" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                    Add Image
                  </span>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setImg(e.target.files[0]);
                      setErrorMessage("");
                    }
                  }}
                />
              </div>
            )}

            {img && (
              <div className="py-3 rounded-2xl relative">
                <MdDelete
                  className="absolute top-5 right-5 text-2xl cursor-pointer hover:bg-white transition-all duration-300"
                  onClick={() => setImg("")}
                />
                <img
                  src={URL.createObjectURL(img)}
                  className="h-96 w-full rounded-2xl"
                  alt="Preview"
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
              onClick={handleCreatePost}
              className="mt-3 p-3 rounded-full bg-red-700 text-white hover:bg-blue-300 hover:text-black transition-all duration-250 text-[15px] font-semibold flex items-center justify-center"
            >
              {isLoading ? "Loading..." : "Add Post"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
