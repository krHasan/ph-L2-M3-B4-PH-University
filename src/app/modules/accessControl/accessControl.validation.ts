import { z } from "zod";
import { userRoleArray } from "../user/user.constant";

const createAccessControlValidationSchema = z.object({
    body: z.array(
        z.object({
            method: z.string(),
            url: z.string(),
            roles: z.array(z.enum([...userRoleArray] as [string, ...string[]])),
        }),
    ),
});

export const AccessControlValidations = {
    createAccessControlValidationSchema,
};
