import React, { useContext, useEffect, useState } from "react";
import PostCard from "../../Components/PostCard";
import { AuthContext } from "../../Context/AuthContext";
import { PostContext } from "../../Context/PostContext";
import { useParams } from "react-router-dom";
import PostSkeleton from "../../Components/Skeleton/Skeleton";

export default function SinglePost() {
  const { id } = useParams();
  const { userToken } = useContext(AuthContext);
  const { getSinglePost } = useContext(PostContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const fetchedPost = await getSinglePost(id); 
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id && userToken) {
      fetchPost();
    }
  }, [id, userToken]);

  if (loading) return <div className="pt-32">
      <PostSkeleton/>
    </div>

  return (
    <>
    <title>Post</title>
        <PostCard key={post?._id} className="pt-28 md:px-24" mx={"mx-0"}post={post} />

  </>

  );
}
