import "./App.css";
import MainLayout from "./Pages/MainLayout/MainLayout";
import Home from "./Pages/Home/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/Login";
import { AuthContextProvider } from "./Context/AuthContext";
import ProtectedRoutes from "./Components/ProtectedRoutes/ProtectedRoutes";
import Posts from "./Pages/Posts/posts";
import { UserContextProvider } from "./Context/UserContext";
import { Toaster } from "react-hot-toast";
import Settings from "./Pages/Settings/Settings";
import UserData from "./Pages/Settings/UserData/UserData";
import ChangePassword from "./Pages/Settings/ChangePassword/ChangePassword";
import Profile from "./Pages/Profile/Profile";
import SinglePost from "./Pages/SinglePost/SinglePost";
import Search from "./Pages/Search/Search";
import PostContextProvider from "./Context/PostContext";
import NotFound from "./Pages/NotFound/NotFound";

function App() {
  const routes = createBrowserRouter([
    {
      path: "",
      element: (
        <ProtectedRoutes>
          <MainLayout />
        </ProtectedRoutes>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "posts", element: <Posts /> },
        { path: "profile/:id", element: <Profile /> },
        { path: "post/:id", element: <SinglePost /> },
        { path: "search", element: <Search/> },
        { path: "*", element: <NotFound/> },
        {
          path: "settings",
          element: <Settings />,
          children: [
            { index: true, element: <UserData /> },
            { path: "change-password", element: <ChangePassword /> },
            { path: "user-data", element: <UserData /> },
          ],
        },
      ],
    },
    {
      path: "login",
      element: <Login />,
    },
  ]);

  return (
    <AuthContextProvider>
      <UserContextProvider>
        <PostContextProvider>
          <Toaster />
          <RouterProvider router={routes}></RouterProvider>
        </PostContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  );
}

export default App;
