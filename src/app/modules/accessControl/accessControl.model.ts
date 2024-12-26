import { model, Schema } from "mongoose";
import { TAccessControl } from "./accessControl.interface";
import { httpMethodsArray } from "./accessControl.constant";
import { userRoleArray } from "../user/user.constant";

const accessControlSchema = new Schema<TAccessControl>({
    method: {
        type: String,
        enum: httpMethodsArray,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    roles: [
        {
            type: String,
            enum: userRoleArray,
        },
    ],
});

export const AccessControl = model<TAccessControl>(
    "AccessControl",
    accessControlSchema,
);
