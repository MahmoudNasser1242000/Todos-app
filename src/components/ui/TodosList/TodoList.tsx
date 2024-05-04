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
    });
    let [action, setAction] = useState<string>("");

    const getToken = useContext(tokenContext);
    const decodeToken = jwtDecode(`${getToken?.token}`);
    const [newTodo, setNewTodo] = useState({
        user: [decodeToken?.id],
        title: "",
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
        });
    }

    function openModal(id: string | number, title: string) {
        setTodoToUpdate({
            id,
            title,
        });
        setIsOpen(true);
        setAction("update");
    }

    const todoAction = async (
        method: string,
        url: string,
        meta: unknown,
        onSuccess: () => void
    ) => {
        setLoading(true);
        try {
            const data = await axiosInstance[method](url, meta, {
                headers: {
                    Authorization: `Bearer ${getToken?.token}`,
                },
            });
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

    const changeTodoValue = (e: ChangeEvent<HTMLInputElement>) => {
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
                "put",
                `todos/${todoToUpdate.id}`,
                { data: { title: todoToUpdate.title } },
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
        await todoAction("delete", `todos/${todoToUpdate.id}`, null, onDeleteTodoSuccess);
    };

    // =========================ADD TODO=========================

    const getNewTodo = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTodo((prev) => {
            return {
                ...prev,
                title: e.target.value,
            };
        });
    };

    const onAddTodoSuccess = () => {
        setIsOpen(false);
        setNewTodo((prev) => {
            return {
                ...prev,
                title: "",
            };
        });
        refetch();
    };

    const addTodo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await todoAction("post", `todos`, { data: newTodo }, onAddTodoSuccess);
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
    };
    const generateTodo = async () => {
        for (let i = 0; i < 50; i++) {
            await todoAction(
                "post",
                "todos",
                {
                    data: {
                        title: faker.word.words({ count: { min: 5, max: 10 } }),
                        user: decodeToken?.id,
                    },
                },
                () => {
                    onGenerateTodosSuccess(i);
                }
            );
        }
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

            {action === "update" ? (
                <Modal
                    title="Update Todo"
                    err={err}
                    isOpen={isOpen}
                    closeModal={closeModal}
                >
                    <form onSubmit={updateTodo}>
                        <div className="mt-2">
                            <Input
                                name="title"
                                value={todoToUpdate.title}
                                onChange={changeTodoValue}
                            />
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
                                    "Update Your Todo"
                                )}
                            </button>
                        </div>
                    </form>
                </Modal>
            ) : action === "delete" ? (
                <Modal
                    title="Delete Todo"
                    err={err}
                    isOpen={isOpen}
                    closeModal={closeModal}
                >
                    <form onSubmit={deleteTodo}>
                        <div className="mt-2">
                            Are You Sure You Want To Delete This Todo?
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
                                    "Delete Your Todo"
                                )}
                            </button>
                        </div>
                    </form>
                </Modal>
            ) : (
                <Modal
                    title="Add New Todo"
                    err={err}
                    isOpen={isOpen}
                    closeModal={closeModal}
                >
                    <form onSubmit={addTodo}>
                        <div className="mt-2">
                            <Input name="title" value={newTodo.title} onChange={getNewTodo} />
                        </div>
                        <div className="mt-4">
                            <button className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                                {loading ? (
                                    <>
                                        <div
                                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                            role="status"
                                        ></div>{" "}
                                        <span> Loading...</span>
                                    </>
                                ) : (
                                    "Add New Todo"
                                )}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
};

export default TodoList;
