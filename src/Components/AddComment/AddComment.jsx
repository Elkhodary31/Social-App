import axios from "axios";
import React, { useContext, useState } from "react";
import { IoSend } from "react-icons/io5";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

export default function AddComment({ postId, setComments }) {
  const id =postId
  
  const [content, setContent] = useState("");
  const { userToken } = useContext(AuthContext);

  async function handleAddComment() {
    
    console.log("hiiiiiiiiiiiiii");
    
    if (!content.trim()){
        toast.error("Can't Add Empty Comment")
        return; 
    } 
    try {
      const res = await axios.post(
        "https://linked-posts.routemisr.com/comments",
        {
          content: content,
          post: id,
        },
        {
          headers: {
            token: userToken,
          },
        }
      );

      toast.success("Comment added successfully");
      setComments(res.data.comments); 

      setContent("");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    }
  }

function handleKeyDown(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    handleAddComment();
    e.target.blur(); 
  } else if (e.key === "Escape") {
    setContent("");
    e.target.blur(); 
  }
}


  return (
  <div className="flex items-center justify-between relative w-full">
  <textarea
    placeholder="Add your comment..."
    value={content}
    onChange={(e) => setContent(e.target.value)}
    onKeyDown={handleKeyDown}
    rows={1}
    className="peer w-full resize-none overflow-y-auto bg-gray-300 dark:bg-gray-600 text-black font-bold px-4 py-3 rounded-2xl 
               focus:bg-white focus:border focus:border-blue-500 focus:text-black 
               transition duration-200 ease-in-out focus:outline-none pr-10"
  />

  <button
    onClick={handleAddComment}
    type="submit"
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 rounded-full p-2 cursor-pointer 
               transition-all duration-300 hover:text-blue-800 hover:bg-gray-400 
               opacity-0 peer-focus:opacity-100 peer-focus:pointer-events-auto"
  >
    <IoSend className="text-xl" />
  </button>
</div>

  );
}
