import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const PostContext = createContext();

export default function PostContextProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [limit, setLimit] = useState(20);
  const { userToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); 
const [contacts, setContacts] = useState([]);


 async function getContacts() {
  try {
    const res = await axios.get(
      `https://linked-posts.routemisr.com/posts?limit=50&page=1`,
      { headers: { token: userToken } }
    );

    const contactsRes = res.data.posts;
    console.log("contactsRes",contactsRes);
    
const uniqueUsers = Array.from(
  new Map(
    contactsRes.map((post) => [post?.user?._id, post.user]) 
  ).values() 
).slice(0, 30);
    
    setContacts(uniqueUsers);
    console.log("contacts",contacts);
    
  } catch (error) {
    console.error("Error fetching top users:", error);
  }
}


async function getPosts() {
  try {
    setLoading(true);

    const infoRes = await axios.get(
      `https://linked-posts.routemisr.com/posts?limit=1&page=1`,
      { headers: { token: userToken } }
    );

    const total = infoRes.data.paginationInfo.total;
    const lastPage = Math.ceil(total / limit);

    const postsRes = await axios.get(
      `https://linked-posts.routemisr.com/posts?limit=${limit}&page=${lastPage}`,
      { headers: { token: userToken } }
    );

const latestPosts = postsRes.data.posts.slice(-limit).reverse();
    setPosts(latestPosts);

    let collectedUsers = new Map();
    let page = 1;

    while (collectedUsers.size < 50) {
      const res = await axios.get(
        `https://linked-posts.routemisr.com/posts?limit=20&page=${page}`,
        { headers: { token: userToken } }
      );

      res.data.posts.forEach((post) => {
        if (post.user && !collectedUsers.has(post.user._id)) {
          collectedUsers.set(post.user._id, post.user);
        }
      });

      if (res.data.posts.length < 20) break;
      page++;
    }

    setUsers([...collectedUsers.values()]);
  } catch (error) {
    console.error("Error fetching posts/users:", error);
  } finally {
    setLoading(false);
  }
}

  async function getSinglePost(id) {
    try {
      const response = await axios.get(
        `https://linked-posts.routemisr.com/posts/${id}`,
        { headers: { token: userToken } }
      );

      const newPost = response.data.post;

      setRecentPosts(function (prev) {
        if (prev.find((p) => p._id === newPost._id)) {
          return prev;
        }
        return [...prev, newPost];
      });

      return newPost;
    } catch (error) {
      console.error("Error fetching single post:", error);
    }
  }

  async function createPost(formData) {
    try {
      const response = await axios.post(
        "https://linked-posts.routemisr.com/posts",
        formData,
        {
          headers: {
            token: userToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPosts((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  async function updatePost(id, formData) {
    try {
      const response = await axios.put(
        `https://linked-posts.routemisr.com/posts/${id}`,
        formData,
        {
          headers: {
            token: userToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPosts((prev) =>
        prev.map((post) => (post._id === id ? response.data : post))
      );
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  async function deletePost(id) {
    try {
      await axios.delete(`https://linked-posts.routemisr.com/posts/${id}`, {
        headers: { token: userToken },
      });
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
 useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
     getPosts();
  }, [userToken, limit]);

  return (
    <PostContext.Provider
      value={{
        posts,
        recentPosts,
        setPosts,
        setRecentPosts,
        setLimit,
        getPosts,
        getSinglePost,
        createPost,
        updatePost,
        deletePost,
        users,
        loading, contacts
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
