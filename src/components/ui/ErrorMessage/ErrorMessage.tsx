import React from "react";
import styles from "./ErrorMessage.module.css"

interface IProps {
  children: React.ReactNode
}
const ErrorMessage = ({children}: IProps) => {
  return <p className={`text-red-700 font-light ${styles.error}`}>{children}</p>;
};

export default ErrorMessage;
