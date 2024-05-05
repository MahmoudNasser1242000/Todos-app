import React, { ChangeEvent, useContext, useState } from "react";
import styles from "./AllTodos.module.css"
import customQuery from "../../config/CustomQuery";
import { tokenContext } from "../../context/tokenContext";
import { AxiosError } from "axios";
import { IErrorApi } from "../../interfaces";
import Pagination from "../../ui/Pagination/Pagination";

interface IProps {

}
const AllTodos = ({ }: IProps) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [sort, setSort] = useState<string>("DESC");

  const getToken = useContext(tokenContext);
  const { data, isLoading, error, isFetching } = customQuery({
    queryKey: ["All-Todos", page, pageSize, sort],
    url: `todos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:${sort}`,
    config: {
      headers: {
        Authorization: `Bearer ${getToken?.token}`,
      },
    },
  });
  console.log(data);

  const pageIncrement = () => {
    setPage((prev) => prev + 1)
  }

  const pageDecrement = () => {
    setPage((prev) => prev - 1)
  }

  const changePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value)
  }

  const changePageSort = (e: ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value)
  }
  const Error = error as AxiosError<IErrorApi>;
  return (
    <>
      <div className="py-7 px-8 items-start flex-row-reverse justify-between">
        {
          isLoading ? (
            <ol className="relative border-s border-gray-200 dark:border-gray-700 w-[70%] mr-6 animate-pulse">
              <li className=" mb-6">
                <div className="absolute w-5 h-5 text-[11px] flex justify-center items-center text-stone-600 bg-gray-200 rounded-full -start-2.5  border border-white dark:border-gray-900 dark:bg-gray-700" />
                <div className="ml-5">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
                </div>
              </li>
              <li className="">
                <div className="absolute w-5 h-5 text-[11px] flex justify-center items-center text-stone-600 bg-gray-200 rounded-full -start-2.5  border border-white dark:border-gray-900 dark:bg-gray-700" />
                <div className="ml-5">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
                </div>
              </li>
            </ol>

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
            <>
              <div className="flex justify-between items-start flex-row-reverse">
                <div>
                  <select
                    name="page-size"
                    id="page-size"
                    className="mt-1.5 w-[200px] rounded-md border outline-none py-2 px-3 border-gray-300 text-gray-700 sm:text-sm"
                    onChange={changePageSize}
                  >
                    <option value="" hidden>Page Size</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
              
                  <select
                    name="sort"
                    id="sort"
                    className="mt-1.5 mr-2 w-[200px] rounded-md border outline-none py-2 px-3 border-gray-300 text-gray-700 sm:text-sm"
                    onChange={changePageSort}
                  >
                    <option value="DESC">latest</option>
                    <option value="ASC">oldest</option>
                  </select>
                </div>
                <ol className="relative border-s border-gray-200 dark:border-gray-700">
                  {data?.data?.data?.map((todo: { id: number, attributes: { createdAt: string, title: string, description: string } }, index: number) => (
              
                    <li className="mb-10 ms-4" key={todo.id}>
                      <div className="absolute w-5 h-5 text-[11px] flex justify-center items-center text-stone-600 bg-gray-200 rounded-full -start-2.5  border border-white dark:border-gray-900 dark:bg-gray-700" >{index + 1}</div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{todo.attributes.createdAt}</time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{todo.attributes.title}</h3>
                      <p className="mb-4 w-[70%] text-base font-normal text-gray-500 dark:text-gray-400">{todo.attributes.description}</p>
                    </li>
                  ))
                  }
                </ol>
              </div>
              <Pagination isLoading={isFetching} pageIncrement={pageIncrement} pageDecrement={pageDecrement} meta={data?.data?.meta?.pagination} />
            </>

          ) : (<h2 className="font-bold text-4xl">There are no todos right now!</h2>)
        }
      </div>
    </>
  );
}
export default AllTodos;
