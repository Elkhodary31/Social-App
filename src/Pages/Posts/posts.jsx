import React, { useContext, useEffect } from "react";
import PostCard from "../../Components/PostCard";
import AddPost from "../../Components/AddPost/AddPost";
import { PostContext } from "../../Context/PostContext";
import PostSkeleton from "../../Components/Skeleton/Skeleton";

export default function Posts() {
  const { posts, setLimit, loading } = useContext(PostContext);

  useEffect(() => {
    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        setLimit(prev => prev + 10);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="center flex-col bg">
      <div className="w-full">
        <AddPost />
      </div>

 <div className="w-full space-y-4">
  {posts.map(post => <PostCard key={post._id} post={post} />)}
  {loading &&
    Array.from({ length: 2 }).map((_, idx) => <PostSkeleton key={idx} />)}
</div>

    </div>
  );
}
