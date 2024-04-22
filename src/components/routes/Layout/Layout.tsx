import React from "react";
import NavBar from "../../ui/NavBar/NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="container mx-auto">
      <NavBar/>
      <Outlet/>
    </div>
  );
};

export default Layout;
