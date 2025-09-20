import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-hot-toast";

export default function useLogout() {
  const { setUserToken } = useContext(AuthContext);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    setUserToken(null);
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return logout;
}
