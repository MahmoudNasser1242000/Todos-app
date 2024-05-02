import React from "react";
import styles from "./Todos.module.css"

interface IProps {
  title: string,
  index: number
}
const Todos = ({title, index }: IProps) => {
  return (
    <div className="shadow-[#32325d40_0px_2px_5px_-1px,_#0000004d_0px_1px_3px_-1px] rounded-sm px-3 py-5 flex justify-between items-center mt-5 bg-slate-50">
      <p className="font-semibold">{index+1}- {title}.</p>
      <div>
        <button className="group relative inline-block text-sm font-medium text-white  mr-2 focus:outline-none focus:ring">
          <span className="absolute inset-0 border border-yellow-300 group-active:border-yellow-300" />
          <span className="block border border-yellow-300 text-black bg-yellow-300 px-6 py-3 transition-transform active:border-yellow-300 active:bg-yellow-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
            Update
          </span>
        </button>
        {" "}
        <button className="group relative inline-block text-sm font-medium text-red-600 focus:outline-none focus:ring active:text-red-500">
          <span className="absolute inset-0 border border-current" />
          <span className="block border border-current bg-white px-6 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
            Delete
          </span>
        </button>
      </div>

    </div>
  );
};

export default Todos;
