import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
    {
        id: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ["Admin", "Student", "Faculty"],
        },
        status: {
            type: String,
            enum: ["in-progress", "blocked", "active"],
            default: "in-progress",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const User = model<TUser>("User", userSchema);
