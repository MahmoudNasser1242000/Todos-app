import { Dialog, Transition } from "@headlessui/react";
import { ChangeEvent, FormEvent, Fragment, MouseEventHandler, useContext, useState } from "react";
import Todos from "../Todos/Todos";
import { tokenContext } from "../../context/tokenContext";
import customQuery from "../../config/CustomQuery";
import { AxiosError } from "axios";
import { IErrorApi, ITodo } from "../../interfaces/index";
import Input from "../Input/Input";
import axiosInstance from "../../config/configAxios";

const TodoList = () => {
    let [isOpen, setIsOpen] = useState(false);
    let [err, setError] = useState<string>("");
    let [loading, setLoading] = useState<boolean>(false);
    let [todoToUpdate, setTodoToUpdate] = useState<ITodo>({
        id: "",
        title: "",
    });
    let [action, setAction] = useState<string>("");

    const getToken = useContext(tokenContext);
    const { data, isLoading, error, refetch } = customQuery({
        queryKey: ["Todos", todoToUpdate.id],
        url: "users/me?populate=todos",
        config: {
            headers: {
                Authorization: `Bearer ${getToken?.token}`,
            },
        },
    });
    const Error = error as AxiosError<IErrorApi>;

    const changeTodoValue = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTodoToUpdate((prev: ITodo) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    function closeModal() {
        setIsOpen(false);
        setTodoToUpdate({
            id: "",
            title: "",
        });
    }

    function openModal(id: string | number, title: string) {
        setTodoToUpdate({
            id,
            title,
        });
        setIsOpen(true);
        setAction("update")
    }

    const updateTodo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (todoToUpdate.title) {
            setLoading(true);
            try {
                const data = await axiosInstance.put(`todos/${todoToUpdate.id}`, { data: { title: todoToUpdate.title } }, {
                    headers: {
                        Authorization: `Bearer ${getToken?.token}`
                    }
                });
                if (data?.status) {
                    closeModal();
                    console.log(
                        "done"
                    );

                }
            } catch (error) {
                const Error = error as AxiosError<IErrorApi>;
                setError(`${Error?.response?.data?.error?.message}`)
            } finally {
                setLoading(false);
            }
        } else {
            setError("You Have To Write New Title.");
        }
    };

    const getIdToDelete = (id: string | number) => {
        setTodoToUpdate((prev) => {
            return {
                ...prev,
                id
            }
        })
        setIsOpen(true)
        setAction("delete");
    }
    
    const deleteTodo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true);
        try {
            const data = await axiosInstance.delete(`todos/${todoToUpdate.id}`, {
                headers: {
                    Authorization: `Bearer ${getToken?.token}`
                }
            });
            if (data?.status) {
                setIsOpen(false);
                refetch()
            }
        } catch (error) {
            const Error = error as AxiosError<IErrorApi>;
            setError(`${Error?.response?.data?.error?.message}`)
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <div className="w-full">
                {isLoading ? (
                    <div className="animate-pulse w-full">
                        <div className="w-full h-8 bg-gray-300 rounded mt-5 py-6"></div>
                        <div className="w-full h-8 bg-gray-300 rounded mt-5 py-6"></div>
                    </div>
                ) : error ? (
                    <div
                        className="flex bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700"
                        role="alert"
                    >
                        <svg
                            className="w-5 h-5 inline mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                        <div>
                            <span className="font-medium">Danger alert!</span>{" "}
                            {Error.response?.data.error.message}.
                        </div>
                    </div>
                ) : data?.data?.todos.length ? (
                    data.data.todos.map(
                        (todo: { title: string; id: string | number }, index: number) => (
                            <Todos
                                index={index}
                                {...todo}
                                key={todo.id}
                                openModal={openModal}
                                getIdToDelete={getIdToDelete}
                            />
                        )
                    )
                ) : (
                    <h2 className="font-bold text-4xl">There are no todos right now!</h2>
                )}
            </div>

            {
                action === "update" ? (
                    <Transition appear show={isOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={closeModal}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black/25" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                            {err ? (
                                                <div className="hover:red-yellow-500 w-full mb-2 select-none border-l-4 border-red-400 bg-red-100 p-4 font-medium">
                                                    {err}
                                                </div>
                                            ) : null}
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                Update Todo
                                            </Dialog.Title>
                                            <form onSubmit={updateTodo}>
                                                <div className="mt-2">
                                                    <Input
                                                        name="title"
                                                        value={todoToUpdate.title}
                                                        onChange={changeTodoValue}
                                                    />
                                                </div>

                                                <div className="mt-4">
                                                    <button
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <div
                                                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                                    role="status"
                                                                ></div>{" "}
                                                                <span>Loading...</span>
                                                            </>
                                                        ) : (
                                                            "Update Your Todo"
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                ) : (
                    <Transition appear show={isOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={closeModal}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black/25" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                            {err ? (
                                                <div className="hover:red-yellow-500 w-full mb-2 select-none border-l-4 border-red-400 bg-red-100 p-4 font-medium">
                                                    {err}
                                                </div>
                                            ) : null}
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                Delete Todo
                                            </Dialog.Title>
                                            <form onSubmit={deleteTodo}>
                                                <div className="mt-2">
                                                    Are You Sure You Want To Delete This Todo? 
                                                </div>

                                                <div className="mt-4">
                                                    <button
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <div
                                                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                                    role="status"
                                                                ></div>{" "}
                                                                <span>Loading...</span>
                                                            </>
                                                        ) : (
                                                            "Delete Your Todo"
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                )
            }
        </>
    );
};

export default TodoList;
