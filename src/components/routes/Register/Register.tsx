import React from "react";
import { Link } from "react-router-dom";
import Input from "../../ui/Input/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";

const Register = () => {
  interface IFormInput {
    name: string;
    email: string;
    password: string;
  }

  const schema = yup
    .object({
      name: yup
        .string()
        .min(3, "name must be at least 3 characters")
        .max(15, "name must be maximum 15 characters")
        .required("name required"),
      email: yup.string().email("enter valid email").required("email required"),
      password: yup
        .string()
        .matches(
          /^(?=.*\d{3,})(?=.*[a-zA-Z]{2,})(?=.*[\w_])+.{6,12}$/,
          "password must has at least 4 numbers, 1 charcater and 1 special charcater"
        )
        .required("password is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(schema) });

  const onSubmit = (data: IFormInput) => console.log(data);
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
                {...register("name")}
                placeholder="Enter Name"
                type="text"
                required={false}
              />
              <ErrorMessage>{errors.name?.message}</ErrorMessage>
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
              className="block w-full rounded-[5px] bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              Sign in
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
