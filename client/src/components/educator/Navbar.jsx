import React from "react";
import { assets, dummyEducatorData as educatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to={"/"}>
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
        >
          <img 
            src={assets.favicon} 
            alt="Learnova Logo" 
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain" 
          />
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 drop-shadow-sm">
            Learnova
          </h1>
        </div>
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {user ? user.fullName : 'Developers'}</p>
        { user ? <UserButton /> : <img src={assets.profile_img} className="max-w-8 rounded-full" alt="user" /> }
      </div>
    </div>
  );
};

export default Navbar;