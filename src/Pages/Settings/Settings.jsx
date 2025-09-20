import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Sidebar from "../../Components/Settings/Sidebar";
import { Outlet } from "react-router-dom";

dayjs.extend(relativeTime);

export default function Settings() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}
