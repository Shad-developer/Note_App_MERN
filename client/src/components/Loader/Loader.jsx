import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-t-transparent border-solid rounded-full animate-spin text-blue-500"></div>
    </div>
  );
};

export default Loader;
