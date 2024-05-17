import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  // Base classes
  let classes =
    "md:w-[120px] transition-all duration-300 ease-[ease-out] text-lg leading-6 text-center tracking-[-0.01em] px-6 max-md:px-2 py-0";

  // Add active or default class
  classes += isActive ? " text-white" : " text-[#8a8a93] hover:text-white";

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
};

export default NavLink;
