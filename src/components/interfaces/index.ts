import { AxiosRequestConfig } from "axios"

export interface IErrorApi {
    error: {
        message: string
    }
}

export interface IQuery {
    queryKey: (string | number)[],
    url: string,
    config?: AxiosRequestConfig,
}

export interface ITodo {
    id: string | number,
    title: string
    description: string
}