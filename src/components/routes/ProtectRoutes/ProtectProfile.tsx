import React, { useContext } from "react";
import { tokenContext } from "../../context/tokenContext";
import { Navigate } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}
const ProtectProfile = ({ children }: IProps) => {
    const token_contxt = useContext(tokenContext);
    if (token_contxt?.token) {
        return children;
    } else {
        return <Navigate to={"/login"} />
    }
};

export default ProtectProfile;
