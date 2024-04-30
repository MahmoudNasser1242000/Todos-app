import React, { useContext, useState } from "react";
import styles from "./Login.module.css"
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import Input from "../../ui/Input/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { loginSchema } from "../../validation";
import axiosInstance from "../../config/configAxios";
import { Bounce, toast } from "react-toastify";
import { IErrorApi } from "../../interfaces";
import { AxiosError } from "axios";
import { tokenContext } from "../../context/tokenContext";

interface IProps {

}
const Login = ({ }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const token_Context = useContext(tokenContext)
  const navigate: NavigateFunction = useNavigate();

  interface IFormInput {
    identifier: string;
    password: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: IFormInput) => {
    setLoading(true)
    try {
      const login = await axiosInstance.post("auth/local", data);
      console.log(login);
      toast.success("Login successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        closeButton: false,
        transition: Bounce,
      });

      token_Context?.setToken(login.data?.jwt)
      setTimeout(() => {
        navigate("/")
        // window.location.href= "http://localhost:5173/";
      }, 3500);
    } catch (err) {
      const errObj = err as AxiosError<IErrorApi>;
      console.log(errObj);
      toast.error(`${errObj.response?.data?.error?.message}`, {
        className: "text-center w-fit",
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        closeButton: false,
        transition: Bounce,
      });
    } finally {
      setLoading(false)
    }
  };
  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
            Get started today
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati
            sunt dolores deleniti inventore quaerat mollitia?
          </p>

          <form
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-[#43475545_0px_0px_0.25em,_#5a7dbc0d_0px_0.25em_1em] sm:p-6 lg:p-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <p className="text-center text-lg font-medium">
              Login in to your account
            </p>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Input
                {...register("identifier")}
                placeholder="Enter email"
                type="email"
              />
              <ErrorMessage>{errors.identifier?.message}</ErrorMessage>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                {...register("password")}
                placeholder="Enter password"
                type="password"
              />
              <ErrorMessage>{errors.password?.message}</ErrorMessage>
            </div>

            <button
              className={`block w-full rounded-[5px] bg-indigo-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={errors.password || errors.identifier? true : false}
            >
              {loading ? (
                <>
                  <div
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></div>
                  {" "}
                  <span>Loading...</span>
                </>
              ) : (
                "Login"
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an count?
              <Link to={"/register"} className="underline text-sky-800">
                {" "}
                signin Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
