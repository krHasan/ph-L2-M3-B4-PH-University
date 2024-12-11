import { model, Schema } from "mongoose";
import { userNameSchema } from "../common/common.schema";
import { AdminModel, TAdmin } from "./admin.interface";

const adminSchema = new Schema<TAdmin, AdminModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User Id is required"],
            unique: true,
        },
        designation: {
            type: String,
            required: true,
        },
        name: {
            type: userNameSchema,
            required: true,
        },
        gender: {
            type: String,
            enum: {
                values: ["Male", "Female", "Other"],
                message: "Gender is Male, Female or Other",
            },
            required: true,
        },
        dateOfBirth: { type: Date },
        email: { type: String, required: true, unique: true },
        contactNo: { type: String, required: true },
        emergencyContactNo: { type: String, required: true },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"],
        },
        presentAddress: { type: String, required: true },
        permanentAddress: { type: String, required: true },
        profileImg: { type: String },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    },
);

adminSchema.virtual("fullName").get(function () {
    if (this.name?.middleName) {
        return (
            this?.name?.firstName +
            " " +
            this?.name?.middleName +
            " " +
            this?.name?.lastName
        );
    } else {
        return this?.name?.firstName + " " + this?.name?.lastName;
    }
});

adminSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

adminSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

adminSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

//creating a custom static method
adminSchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Admin.findOne({ id });
    return existingUser;
};

export const Admin = model<TAdmin, AdminModel>("Admin", adminSchema);
