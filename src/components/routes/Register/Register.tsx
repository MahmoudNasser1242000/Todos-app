import React, { useState } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import Input from "../../ui/Input/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import { registerSchema } from "../../validation";
import axiosInstance from "../../config/configAxios";
import { Bounce, toast } from "react-toastify";
import { IErrorApi } from "../../interfaces";
import { AxiosError } from "axios";

const Register = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate()

  interface IFormInput {
    username: string;
    email: string;
    password: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(registerSchema) });

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    setLoading(true);
    try {
      const register = await axiosInstance.post("auth/local/register", data);
      console.log(register);
      toast.success("Sign in successfully", {
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

      setTimeout(() => {
        navigate("/login");
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
      setLoading(false);
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
              Sign in to your account
            </p>

            <div>
              <label htmlFor="password" className="sr-only">
                Name
              </label>
              <Input
                {...register("username")}
                placeholder="Enter Name"
                type="text"
                required={false}
              />
              <ErrorMessage>{errors.username?.message}</ErrorMessage>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Input
                {...register("email")}
                placeholder="Enter email"
                type="email"
              />
              <ErrorMessage>{errors.email?.message}</ErrorMessage>
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
              type="submit"
              className={`block w-full rounded-[5px] bg-indigo-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={errors.password || errors.username || errors.email? true : false}
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
                "Sign in"
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Allready have an acount?
              <Link to={"/login"} className="underline text-sky-800">
                {" "}
                Login Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
