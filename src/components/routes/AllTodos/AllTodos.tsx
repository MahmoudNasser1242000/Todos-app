import React, { useContext, useState } from "react";
import styles from "./AllTodos.module.css"
import customQuery from "../../config/CustomQuery";
import { tokenContext } from "../../context/tokenContext";
import { AxiosError } from "axios";
import { IErrorApi } from "../../interfaces";

interface IProps {

}
const AllTodos = ({ }: IProps) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(1);
  
  const getToken = useContext(tokenContext);
  const { data, isLoading, error } = customQuery({
    queryKey: ["All-Todos", page, pageSize],
    url: `todos/pagination[${page}]=1&pagination[${pageSize}]=50`,
    config: {
      headers: {
        Authorization: `Bearer ${getToken?.token}`,
      },
    },
  });
  console.log(data?.data?.data);

  const pageIncrease = () => {
    setPage((prev) => prev + 1)
  }

  const pageDecrease = () => {
    setPage((prev) => prev - 1)
  }

  const Error = error as AxiosError<IErrorApi>;
  return (
    <div className="py-7 px-8">
      {
        isLoading ? (

          <div role="status" className="max-w-md p-4 space-y-4 divide-y divide-gray-200 rounded animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>
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
              <span className="font-medium">Danger alert!</span>{" "}
              {Error.response?.data.error.message}.
            </div>
          </div>
        ) : data?.data?.data?.length ? (
          <ol className="relative border-s border-gray-200 dark:border-gray-700">
            {data?.data?.data?.map((todo: {id: number, attributes: {createdAt: string, title: string, description: string}}, index:number) => (

            <li className="mb-10 ms-4" key={todo.id}>
              <div className="absolute w-5 h-5 text-[11px] flex justify-center items-center text-stone-600 bg-gray-200 rounded-full -start-2.5  border border-white dark:border-gray-900 dark:bg-gray-700" >{index+1}</div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{todo.attributes.createdAt}</time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{todo.attributes.title}</h3>
              <p className="mb-4 w-[70%] text-base font-normal text-gray-500 dark:text-gray-400">{todo.attributes.description}</p>
            </li>
            ))
              }
          </ol>

        ) : (<h2 className="font-bold text-4xl">There are no todos right now!</h2>)
      }
    </div>
  );
}
export default AllTodos;
