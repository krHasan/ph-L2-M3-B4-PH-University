import { model, Schema } from "mongoose";
import { FacultyModel, TFaculty } from "./faculty.interface";
import { userNameSchema } from "../user/user.schema";
import {
    bloodGroupArray,
    genderTypesArray,
    genderTypesErrorMessage,
} from "../user/user.constant";

const facultySchema = new Schema<TFaculty, FacultyModel>(
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
                values: genderTypesArray,
                message: genderTypesErrorMessage,
            },
            required: true,
        },
        dateOfBirth: { type: Date },
        email: { type: String, required: true, unique: true },
        contactNo: { type: String, required: true },
        emergencyContactNo: { type: String, required: true },
        bloodGroup: {
            type: String,
            enum: bloodGroupArray,
        },
        presentAddress: { type: String, required: true },
        permanentAddress: { type: String, required: true },
        profileImg: { type: String, default: "" },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            required: [true, "Academic department is required"],
            ref: "AcademicDepartment",
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            ref: "AcademicFaculty",
        },
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

facultySchema.virtual("fullName").get(function () {
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

facultySchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

facultySchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

facultySchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

//creating a custom static method
facultySchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Faculty.findOne({ id });
    return existingUser;
};

export const Faculty = model<TFaculty, FacultyModel>("Faculty", facultySchema);
