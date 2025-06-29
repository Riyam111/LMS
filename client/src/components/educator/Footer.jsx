import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t">
      <div className="flex items-center gap-4">
        <div  className="flex items-center gap-2 cursor-pointer">
          <img 
            src={assets.favicon} 
            alt="logo" 
            className="w-6 h-6 object-contain" 
          />
          <h1 className="text-base font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-500 to-cyan-400">
            Learnova
          </h1>
        </div>
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          &copy; 2025 by Riya. All rights reserved
        </p>
      </div>
      <div className="flex items-center gap-3 max-md:mt-4">
        <a href="">
          <img src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href="">
          <img src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="">
          <img src={assets.instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;