import * as yup from "yup";

export const registerSchema = yup
    .object({
        username: yup
            .string()
            .min(3, "name must be at least 3 characters")
            .max(15, "name must be maximum 15 characters")
            .required("name required"),
        email: yup.string().email("enter valid email").required("email required"),
        password: yup
            .string()
            .matches(
                /^(?=.*\d{3,})(?=.*[a-zA-Z]{2,})(?=.*[\W_]+).{6,12}$/,
                "password must has at least 4 numbers, 1 charcater and 1 special charcater"
            )
            .required("password is required"),
    })
    .required();


export const loginSchema = yup
    .object({
        identifier: yup.string().email("enter valid email").required("email required"),
        password: yup
            .string()
            .matches(
                /^(?=.*\d{3,})(?=.*[a-zA-Z]{2,})(?=.*[\w_]+).{6,12}$/,
                "password must has at least 4 numbers, 1 charcater and 1 special charcater"
            )
            .required("password is required"),
    })
    .required();