import React, { useContext } from "react";
import styles from "./Home.module.css";
import Todos from "../../ui/Todos/Todos";
import { tokenContext } from "../../context/tokenContext";
import customQuery from "../../config/CustomQuery";
import { AxiosError } from "axios";
import { IErrorApi } from "../../interfaces";

interface IProps {}
const Home = ({}: IProps) => {
  const getToken = useContext(tokenContext);
  const { data, isLoading, error } = customQuery({
    queryKey: "getAllTodos",
    url: "users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${getToken?.token}`,
      },
    },
  });
  // console.log(error);

  const Error = error as AxiosError<IErrorApi>
  return (
    <div className="container mx-auto flex justify-center align-middle mt-6">
      <div className="lg:w-[50%] md:w-[65%] sm:w-[80%] w-[90%]">
        {isLoading ? (
          <div className="animate-pulse w-full">
            <div className="w-full h-8 bg-gray-300 rounded mt-5 py-6"></div>
            <div className="w-full h-8 bg-gray-300 rounded mt-5 py-6"></div>
          </div>
        ) : error ? (
          <div
            className="flex bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700"
            role="alert"
          >
            <svg
              className="w-5 h-5 inline mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div>
              <span className="font-medium">Danger alert!</span> {Error.response?.data.error.message}.
            </div>
          </div>
        ) : data?.data?.todos.length ? (
          data.data.todos.map(
            (todo: { title: string; id: number }, index: number) => (
              <Todos index={index} {...todo} key={todo.id} />
            )
          )
        ) : (
          <h2 className="font-bold text-4xl">There are no todos right now!</h2>
        )}
      </div>
    </div>
  );
};

export default Home;
