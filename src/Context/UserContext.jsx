import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const { userToken } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get("https://linked-posts.routemisr.com/users/profile-data", {
        headers: { token: userToken },
      });
      setUser(data.user);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchUserData();
    }
  }, [userToken]);

  const updateProfilePhoto = async (file) => {
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be less than 4MB.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setLoading(true);

      await axios.put(
        "https://linked-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: userToken,
          },
        }
      );

      await fetchUserData();
      toast.success("Profile photo updated successfully.");
    } catch (err) {
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, updateProfilePhoto }}>
      {children}
    </UserContext.Provider>
  );
}
