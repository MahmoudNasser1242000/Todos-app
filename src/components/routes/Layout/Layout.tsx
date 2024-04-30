import React from "react";
import NavBar from "../../ui/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <div className="container mx-auto">
      <NavBar/>
      <Outlet/>
      <ToastContainer />
    </div>
  );
};

export default Layout;
