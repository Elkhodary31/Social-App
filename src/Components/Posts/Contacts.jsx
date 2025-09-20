import React, { useContext } from 'react'
import { PostContext } from '../../Context/PostContext'
import { Link } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'

export default function Contacts() {
  const { loading,contacts } = useContext(PostContext)
  const { user} = useContext(UserContext)
console.log(contacts)
  const ContactSkeleton = () => (
    <div className="flex items-center p-2 space-x-3 animate-pulse">
      <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  )

  return (
    <div className="custom-scroll w-[280px] h-screen bg-gray-100 border-l border-gray-300 flex flex-col p-3 pb-0 shadow-md mt-8 pt-24 dark:bg-gray-800" >
      <div className="flex-1 overflow-y-auto space-y-3">
        <h3 className="text-lg font-semibold mb-3 border-b-2 py-1 border-gray-400 inline-block pr-5">Your Profile</h3>
        <Link
          to={`/profile/${user._id}`}
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition dark:hover:bg-black dark:" 
        >
          <img
            src={user.photo}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover mr-3"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
        </Link>

        <h3 className="text-lg font-semibold mb-3 border-b-2 py-1 border-gray-400 inline-block pr-5">Your Contacts</h3>

{ 
  contacts?.length > 0
    ? contacts.map((user, i) => (
        <div
          key={user._id || i}
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-black cursor-pointer transition " 
        >
          <img
            src={user?.photo || ""}
            alt={user?.name || ""}
            className="w-9 h-9 rounded-full object-cover mr-3"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white ">
            {user?.name || ""}
          </span>
        </div>
      ))
    : loading && Array.from({ length: 5 }).map((_, idx) => <ContactSkeleton key={idx} />)
}

      </div>
    </div>
  )
}
