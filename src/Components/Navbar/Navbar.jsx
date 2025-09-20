import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { SlSocialStumbleupon } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { PostContext } from "../../Context/PostContext";
import useLogout from "../../Utilities/Hooks/Logout";
import { BiSearch } from "react-icons/bi";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function NavbarComponent() {
    const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();
  const logout = useLogout();
  const { user } = useContext(UserContext);
  const { users } = useContext(PostContext);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
    const searchRef = useRef(null);
    useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    if (storedTheme === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");  
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");  
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    localStorage.setItem("darkMode", newDarkModeState);
    
    if (newDarkModeState) {
      document.documentElement.classList.add("dark");  
    } else {
      document.documentElement.classList.remove("dark");  
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowSearch(false)
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      setQuery("");
      setShowSearch(false);
    }
  };

  return (
    <>
      <nav className="center shadow-md bg-gray-200 fixed w-full z-50 h-20 dark:bg-gray-800 ">
        <div className="mx-auto w-full px-3 flex items-center justify-between py-2 gap-4" >
          <Link
            to="/"
            className="flex items-center gap-4 text-4xl font-bold text-blue-600 dark:text-white"
          >
            <SlSocialStumbleupon className="text-black dark:text-blue-400" />
            <h1 className="text-2xl flex-1">Social App</h1>
          </Link>

          <div className="hidden md:block relative flex-grow w-full md:max-w-[400px]">
            <form onSubmit={handleSubmit}>
<div className="relative w-full">
  <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 dark:text-white" />
  <input
    type="search"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
    placeholder="Search People"
  />
</div>

              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 cursor-pointer dark:bg-black"
              >
                Search
              </button>
            </form>
            {query && (
              <ul className="absolute z-50 bg-white w-full mt-1 rounded-lg shadow max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <li
                      key={u._id}
                      onClick={() => navigate(`/profile/${u._id}`)}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    >
                      <img
                        src={u.photo}
                        alt={u.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{u.name}</span>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No users found</li>
                )}
              </ul>
            )}
          </div>

          <button
            onClick={() => setShowSearch(true)}
            className="block md:hidden p-2 text-gray-600 rounded-full bg-gray-300 mr-auto cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </button>

          {showSearch && (
            <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4" >
              <div className="bg-white w-full max-w-md rounded-lg shadow-lg relative" ref={searchRef}>
                <button
                  onClick={() => setShowSearch(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
                <form onSubmit={handleSubmit} className="p-4">
              <div className="relative w-full">
  <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
  <input
    type="search"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
    placeholder="Search People"
  />
</div>
                  <button
                    type="submit"
                    className="mt-2 w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-all duration-200 cursor-pointer"
                  >
                    Search
                  </button>
                </form>
                {query && (
                  <ul className="absolute z-50 bg-white w-full mt-1 rounded-lg shadow max-h-60 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <li
                          key={u._id}
                          onClick={() => {
                            navigate(`/profile/${u._id}`);
                            setShowSearch(false);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                          <img
                            src={u.photo}
                            alt={u.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{u.name}</span>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No users found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}



<div className="flex items-center gap-3">
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={isDarkMode}
      onChange={toggleDarkMode}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all duration-300"></div>
    <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-all duration-300 peer-checked:translate-x-5 flex items-center justify-center">
      {isDarkMode ? (
        <MdLightMode className="text-yellow-500 text-xl" />
      ) : (
        <MdDarkMode className="text-gray-800 text-xl" />
      )}
    </div>
  </label>

  <Dropdown placement="bottom-end">
    <DropdownTrigger>
      <Avatar
        isBordered
        as="button"
        className="transition-all cursor-pointer hover:bg-black/10 duration-300"
        color="secondary"
        name={user?.name}
        size="sm"
        src={user?.photo}
        aria-label="User profile"
      />
    </DropdownTrigger>
    <DropdownMenu aria-label="Profile Actions" variant="flat">
      <DropdownItem
        key="profile"
        textValue="Profile"
        onClick={() => navigate(`/profile/${user._id}`)}
      >
        <p className="font-semibold">Signed in as</p>
        <p className="font-semibold">{user?.email}</p>
      </DropdownItem>

      <DropdownItem
        key="settings"
        textValue="Settings"
        onClick={() => navigate(`/settings/user-data`)}
      >
        My Settings
      </DropdownItem>

      <DropdownItem key="logout" color="danger" onClick={logout}>
        Log Out
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>


        </div>
      </nav>
    </>
  );
}
