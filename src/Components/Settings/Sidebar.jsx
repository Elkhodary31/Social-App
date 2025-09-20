import React, { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { SiGoogleforms } from "react-icons/si";
import { TbLogout2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import useLogout from "../../Utilities/Hooks/Logout";
import { HiOutlineMenu } from "react-icons/hi";

export default function Sidebar() {
  const logout = useLogout();
  const [open, setOpen] = useState(false);
    const menu = useRef(null);
  
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menu.current &&  !menu.current.contains(event.target)) {
            setOpen(false)
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  return (
    <>

<button

type="button"
className="sm:hidden fixed top-4 left-4 z-20 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg mt-20
hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300 cursor-pointer"
onClick={() => setOpen(true)}
>
  <span className="sr-only">Open sidebar</span>
  <HiOutlineMenu className="w-6 h-6" />
</button>



      <aside
  ref= {menu}

        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-200 dark:bg-gray-800 shadow-xl pt-24 
        transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform sm:static sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="user-data"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <SiGoogleforms className="text-lg" />
                <span className="ms-3">User Data</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="change-password"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaEdit />
                <span className="ms-3">Change Password</span>
              </NavLink>
            </li>
            <li>
              <button
                className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white 
                           hover:bg-red-100 dark:hover:bg-red-700 group transition-colors cursor-pointer"
                onClick={() => logout()}
              >
                <TbLogout2 />
                <span className="ms-3 text-red-600">Log Out</span>
              </button>
            </li>
          </ul>
          <button
            className="sm:hidden mt-6 w-full bg-gray-300 dark:bg-gray-700 py-2 rounded-lg"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}
