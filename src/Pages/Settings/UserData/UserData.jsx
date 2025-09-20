import React, { useContext } from "react";
import { MdModeEdit } from "react-icons/md";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserContext } from "../../../Context/UserContext";

dayjs.extend(relativeTime);

export default function UserData() {
  const { user, updateProfilePhoto, loading } = useContext(UserContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    updateProfilePhoto(file);
  };

  return (
    <>
    <title>User Data</title>
    <div className="mx-auto max-w-2xl px-4 py-8 pt-30">
      <div className="text-center p-6 bg-white shadow-md rounded-2xl border mb-6 dark:bg-gray-600">
        <div className="relative inline-block">
          {loading ? (
            <div className="w-28 h-28 rounded-full border-4 border-blue-500 mx-auto animate-pulse bg-gray-300" />
          ) : (
            <img
            src={user?.photo}
            alt={user?.name}
            className="rounded-full border-4 border-blue-500 w-28 h-28 mx-auto"
            />
          )}
          <label htmlFor="upload-photo">
            <MdModeEdit
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700"
              size={28}
              />
          </label>
          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            />
        </div>
        <div className="text-gray-800 mt-4 dark:text-black">
          <h3 className="text-2xl font-semibold">{user?.name}</h3>
          <h4 className="text-lg text-gray-500 dark:text-black">{user?.email}</h4>
        </div>
      </div>
      <div className="p-6 bg-gray-50 shadow-md rounded-2xl border space-y-4 dark:bg-gray-600" >
        <div className="">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1 dark:text-black">
            Date of Birth
          </label>
          <input
            type="text"
            id="dob"
            value={user?.dateOfBirth}
            disabled
            className="w-full bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1 dark:text-black">
            Gender
          </label>
          <input
            type="text"
            id="gender"
            value={user?.gender}
            disabled
            className="w-full bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 cursor-not-allowed"
            />
        </div>
        <div>
          <label htmlFor="joined" className="block text-sm font-medium text-gray-700 mb-1 dark:text-black">
            Joined
          </label>
          <input
            type="text"
            id="joined"
            value={user?.createdAt ? dayjs(user?.createdAt).fromNow() : ""}
            disabled
            className="w-full bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 cursor-not-allowed"
            />
        </div>
      </div>
    </div>
            </>
  );
}
