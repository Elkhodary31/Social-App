import React from "react";

export default function Loader() {
  return (
    <>
      <div className=" absolute z-20 w-full flex items-center justify-center h-screen bg-black/50">
        <span className="w-16 h-16 border-8 border-white border-b-blue-700 rounded-full inline-block animate-spin"></span>
      </div>
    </>
  );
}
