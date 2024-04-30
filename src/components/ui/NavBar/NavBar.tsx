import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { tokenContext } from "../../context/tokenContext";

const NavBar = () => {
  const token_contxt = useContext(tokenContext);
  return (
    <>
      <header className="bg-white mt-10 ">
        <div className="mx-auto flex justify-between rounded-md bg-indigo-700 h-16 items-center gap-8 px-4 sm:px-6 lg:px-8">
          {token_contxt?.token ? (
            <h1>
              <Link to={""} className="block text-white text-2xl font-semibold">
                Home
              </Link>
            </h1>
          ) : (
            ""
          )}
          {!token_contxt?.token ? (
            <div className="flex gap-4">
              <Link
                to={"login"}
                className="block rounded-md bg-[#7d6cfc] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#8676ffa2]"
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-indigo-700 transition hover:text-indigo-700/65 sm:block"
              >
                Register
              </Link>
            </div>
          ) : (
            <Link
              to={"/login"}
              className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-indigo-700 transition hover:text-indigo-700/65 sm:block"
              onClick={() => { token_contxt.setToken(null) }}
            >
              Logout
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default NavBar;
