import React, { InputHTMLAttributes, Ref, forwardRef } from "react";
import styles from "./Input.module.css";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {}
const Input = forwardRef(({ ...atrr }: IProps, ref: Ref<HTMLInputElement>) => {
  return (
    <input
      ref={ref}
      type="text"
      {...atrr}
      className="w-full rounded-md border border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none"
    />
  );
});

export default Input;