import { z } from "zod";
import { userStatusArray } from "./user.constant";

const userNameValidationSchema = z.object({
    firstName: z
        .string()
        .min(1)
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
            message: "First Name must start with a capital letter",
        }),
    middleName: z.string().optional(),
    lastName: z.string(),
});

const updateUserNameValidationSchema = z.object({
    firstName: z.string().min(1).max(20).optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
});

const userValidationSchema = z.object({
    password: z
        .string({
            invalid_type_error: "Password must be string",
        })
        .max(20, { message: "Password can not be more than 20 characters" })
        .optional(),
});

const changeStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum([...userStatusArray] as [string, ...string[]]),
    }),
});

export const UserValidation = {
    userNameValidationSchema,
    updateUserNameValidationSchema,
    userValidationSchema,
    changeStatusValidationSchema,
};
