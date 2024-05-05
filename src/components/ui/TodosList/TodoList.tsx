import { ChangeEvent, FormEvent, useContext, useState } from "react";
import Todos from "../Todos/Todos";
import { tokenContext } from "../../context/tokenContext";
import customQuery from "../../config/CustomQuery";
import { AxiosError } from "axios";
import { IErrorApi, ITodo } from "../../interfaces/index";
import Input from "../Input/Input";
import axiosInstance from "../../config/configAxios";
import { jwtDecode } from "jwt-decode";
import Modal from "../Modal/Modal";
import { faker } from "@faker-js/faker";
import { Bounce, toast } from "react-toastify";

const TodoList = () => {
    let [isOpen, setIsOpen] = useState(false);
    let [err, setError] = useState<string>("");
    let [loading, setLoading] = useState<boolean>(false);
    let [todoToUpdate, setTodoToUpdate] = useState<ITodo>({
        id: "",
        title: "",
        description: ""
    });
    let [action, setAction] = useState<string>("");

    const getToken = useContext(tokenContext);
    const decodeToken: { id: number } = jwtDecode(`${getToken?.token}`);
    const [newTodo, setNewTodo] = useState({
        user: [decodeToken?.id],
        title: "",
        description: ""
    });

    const { data, isLoading, error, refetch } = customQuery({
        queryKey: ["Todos"],
        url: "users/me?populate=todos",
        config: {
            headers: {
                Authorization: `Bearer ${getToken?.token}`,
            },
        },
    });
    // console.log(data);

    const Error = error as AxiosError<IErrorApi>;

    function closeModal() {
        setIsOpen(false);
        setTodoToUpdate({
            id: "",
            title: "",
            description: ""
        });
    }

    function openModal(id: string | number, title: string, description: string) {
        setTodoToUpdate({
            id,
            title,
            description
        });
        setIsOpen(true);
        setAction("update");
    }

    const todoAction = async (
        url: string,
        meta: unknown,
        onSuccess: () => void
    ) => {
        setLoading(true);
        try {
            let data;
            if (action === "update") {
                data = await axiosInstance.put(url, meta, {
                    headers: {
                        Authorization: `Bearer ${getToken?.token}`,
                    },
                });
            } else if (action === "delete") {
                data = await axiosInstance.delete(url, {
                    headers: {
                        Authorization: `Bearer ${getToken?.token}`,
                    },
                });
            } else {
                data = await axiosInstance.post(url, meta, {
                    headers: {
                        Authorization: `Bearer ${getToken?.token}`,
                    },
                });
            }
            if (data?.status === 200) {
                onSuccess();
            }
        } catch (error) {
            const Error = error as AxiosError<IErrorApi>;
            setError(`${Error?.response?.data?.error?.message}`);
        } finally {
            setLoading(false);
        }
    };

    // =========================UPDATE TODO=========================

    const changeTodoValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTodoToUpdate((prev: ITodo) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const onUpdateTodoSucess = () => {
        closeModal();
        console.log("done");
        refetch();
    };

    const updateTodo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (todoToUpdate.title) {
            await todoAction(
                `todos/${todoToUpdate.id}`,
                { data: { title: todoToUpdate.title, description: todoToUpdate.description } },
                onUpdateTodoSucess
            );
        } else {
            setError("You Have To Write New Title.");
        }
    };

    // =========================DELETE TODO=========================

    const getIdToDelete = (id: string | number) => {
        setTodoToUpdate((prev) => {
            return {
                ...prev,
                id,
            };
        });
        setIsOpen(true);
        setAction("delete");
    };

    const onDeleteTodoSuccess = () => {
        setIsOpen(false);
        refetch();
    };

    const deleteTodo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await todoAction(`todos/${todoToUpdate.id}`, null, onDeleteTodoSuccess);
    };

    // =========================ADD TODO=========================

    const getNewTodo = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTodo((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const onAddTodoSuccess = () => {
        setIsOpen(false);
        setNewTodo((prev) => {
            return {
                ...prev,
                title: "",
                description: ""
            };
        });
        refetch();
    };

    const addTodo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await todoAction(`todos`, { data: newTodo }, onAddTodoSuccess);
    };

    // =========================GENERATE TODO=========================
    const onGenerateTodosSuccess = (i: number) => {
        if (i === 0) {
            toast.success("Generates Todos Successfully", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                closeButton: false,
                transition: Bounce,
            });
        }
        if (i === 49) {
            refetch()
        }
    };

    const generateTodo = async () => {
        for (let i = 0; i < 50; i++) {
            await todoAction(
                `todos`,
                {
                    data: {
                        title: faker.word.words({ count: { min: 5, max: 10 } }),
                        description: faker.lorem.paragraphs({ min: 2, max: 3 }),
                        user: decodeToken?.id,
                    }
                },
                () => {
                    onGenerateTodosSuccess(i);
                }
            );
        };
    };
    return (
        <>
            <div className="w-full">
                <div className="w-full flex justify-center gap-x-3 py-5">
                    <button
                        className={`block rounded-[5px] bg-indigo-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => {
                            setIsOpen(true);
                            setAction("post");
                        }}
                    >
                        Add Todo
                    </button>
                    <button
                        onClick={generateTodo}
                        className={`block rounded-[5px] bg-indigo-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Generate Todo
                    </button>
                </div>
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
                ) : data?.data?.todos?.length ? (
                    data.data.todos.map(
                        (todo: { title: string, description: string, id: string | number }, index: number) => (
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

            <Modal
                title={action === "update" ? "Update Todo" : action === "delete" ? "Delete Todo" : "Add Todo"}
                err={err}
                isOpen={isOpen}
                closeModal={closeModal}
            >
                <form onSubmit={action === "update" ? updateTodo : action === "delete" ? deleteTodo : addTodo}>
                    <div className="mt-2">
                        {
                            action === "update" ?
                                (
                                    <>
                                        <Input
                                            name="title"
                                            value={todoToUpdate.title}
                                            onChange={changeTodoValue}
                                        />
                                        <textarea name="description" value={todoToUpdate.description} onChange={changeTodoValue} id="message" className="block p-2.5 w-full text-sm mt-3 outline-none text-gray-900 bg-gray-50 h-40 rounded-lg border border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here...">
                                        </textarea>
                                    </>
                                ) : action === "delete" ? ("Are You Sure You Want To Delete This Todo?") :
                                    (
                                        <>
                                            <Input name="title" value={newTodo.title} onChange={getNewTodo} />
                                            <textarea id="message" name="description" value={newTodo.description} onChange={getNewTodo} className="block p-2.5 w-full mt-3 text-sm text-gray-900 outline-none h-40 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                                        </>
                                    )
                        }
                    </div>

                    <div className="mt-4">
                        <button className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                            {loading ? (
                                <>
                                    <div
                                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                        role="status"
                                    ></div>{" "}
                                    <span>Loading...</span>
                                </>
                            ) : (
                                action === "update" ? "Update Your Todo" : action === "delete" ? "Delete Your Todo" : "Add New Todo"
                            )}
                        </button>
                    </div>
                </form>
            </Modal>            
        </>
    );
};

export default TodoList;
