import React from "react";

const HeaderButton = ({ children, onClick }) => {
  return (
    <button
      type="button"
      className="header-nav-btn text-white/95 hover:text-white hover:underline font-medium text-base md:text-lg py-1 px-0 whitespace-nowrap transition-colors duration-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default HeaderButton;