import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./configAxios";
import { IQuery } from "../interfaces";


const customQuery = ({ queryKey, url, config }: IQuery) => {
    return useQuery({
        queryKey,
        queryFn: async () => {
            return await axiosInstance.get(url, config);
        },
    })
}

export default customQuery;