import axios from "axios";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { userToken } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters and include a capital letter, number, and special character."
      );
      setNewPassword("");
      return;
    }

    axios
      .patch(
        "https://linked-posts.routemisr.com/users/change-password",
        { password, newPassword },
        { headers: { token: userToken } }
      )
      .then(() => {
        toast.success("Password Changed successfully");
        setPassword("");
        setNewPassword("");
      })
      .catch(() => {
        toast.error("Password is Incorrect");
        setPassword("");
        setNewPassword("");
      });
  }

  return (
    <>
        <title>Change Password</title>

    <div className="flex flex-col items-center justify-center p-6 pt-24">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Old Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
            dark:text-white"
            placeholder="•••••••••"
            required
            />
        </div>
        <div className="mb-6">
          <label
            htmlFor="new_password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
            New Password
          </label>
          <input
            type="password"
            id="new_password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
            dark:text-white"
            placeholder="•••••••••"
            required
            />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
          focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 
          text-center cursor-pointer"
          >
          Submit
        </button>
      </form>
    </div>
          </>
  );
}
