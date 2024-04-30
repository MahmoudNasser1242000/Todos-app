import React, { createContext, useEffect, useState } from "react";

interface IContext {
    token: string | null,
    setToken: React.Dispatch<React.SetStateAction<string | null>>
}
export const tokenContext = createContext<IContext | null>(null);

interface IProps {
    children: React.ReactNode
}
const userToken: string | null = localStorage.getItem("token")? localStorage.getItem("token") : null;
const TokenContextProvider = ({ children }: IProps) => {
    const [token, setToken] = useState<string | null>(userToken);

    useEffect(() => {
        if (token === null) {
            localStorage.removeItem("token")
        } else {
            localStorage.setItem("token", token)
        }
    }, [token]);
    
    return <tokenContext.Provider value={{ token, setToken }}>{children}</tokenContext.Provider>;
};

export default TokenContextProvider;
// export const usetoken = () => {
//     return useContext(tokenContext)
// }