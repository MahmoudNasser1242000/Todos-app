import React from "react";

interface IProps {
    pageIncrement: () => void,
    pageDecrement: () => void,
    isLoading: boolean,
    meta: {
        page: number,
        pageCount: number,
        pageSize: number,
        total: number,
    }
}
const Pagination = ({ pageDecrement, pageIncrement, isLoading, meta: { page, pageSize, pageCount, total } }: IProps) => {
    return (
        <div className="flex flex-col items-center">
            {/* Help text */}
            <span className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">1</span> To <span className="font-semibold text-gray-900 dark:text-white">{page !== pageCount ? page * pageSize : total} Todos</span> In <span className="font-semibold text-gray-900 dark:text-white"> Page {page} </span> Of <span className="font-semibold text-gray-900 dark:text-white">{pageCount} Pages</span>
            </span>
            {/* Buttons */}
            <div className="inline-flex mt-2 xs:mt-0">
                <button onClick={pageDecrement} disabled={page === 1 ? true : false} className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed">
                    <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                    </svg>
                    {isLoading ? (<div
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    ></div>) : "Prev"}
                </button>
                <button onClick={pageIncrement} disabled={page === pageCount ? true : false} className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? (<div
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    ></div>) : "Next"}
                    <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </button>
            </div>
        </div>

    );
};

export default Pagination;
