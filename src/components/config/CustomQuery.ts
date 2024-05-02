import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./configAxios";
import { AxiosRequestConfig } from "axios";

interface IQuery {
    queryKey: string,
    url: string,
    config?: AxiosRequestConfig
}
const customQuery = ({ queryKey, url, config }: IQuery) => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: async () => {
            return await axiosInstance.get(url, config);
        }
    });
}

export default customQuery;