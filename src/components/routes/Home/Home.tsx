import React, { useContext } from "react";
import styles from "./Home.module.css";
import TodoList from "../../ui/TodosList/TodoList";

interface IProps {}
const Home = ({}: IProps) => {
  

  return (
    <div className="container mx-auto flex justify-center align-middle mt-6">
      <div className="lg:w-[50%] md:w-[65%] sm:w-[80%] w-[90%]">
        <TodoList/>
      </div>
    </div>
  );
};

export default Home;
