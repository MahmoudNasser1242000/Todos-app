import React, { useContext } from "react";
import { tokenContext } from "../../context/tokenContext";
import { Navigate } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}
const ProtectAuth = ({children}: IProps) => {
    const token_contxt = useContext(tokenContext);
    if (token_contxt?.token) {
        return <Navigate to={"/"} />
    } else {
        return children;
    }
};

export default ProtectAuth;
