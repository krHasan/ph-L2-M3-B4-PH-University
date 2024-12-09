import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    const studentQuery = new QueryBuilder(
        Student.find()
            .populate("admissionSemester")
            .populate({
                path: "academicDepartment",
                populate: {
                    path: "academicFaculty",
                },
            }),
        query,
    )
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await studentQuery.modelQuery;

    return result;
};

const getStudentByIdFromDB = async (id: string) => {
    const result = await Student.findOne({ id })
        .populate("admissionSemester")
        .populate({
            path: "academicDepartment",
            populate: {
                path: "academicFaculty",
            },
        });
    // const result = await Student.aggregate([{ $match: { id: id } }]);
    return result;
};

const deleteStudentByIdFromDB = async (id: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const result = await Student.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session },
        );

        if (!result) {
            throw new AppError(400, "Failed to delete student");
        }
        const deletedUser = await User.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session },
        );
        if (!deletedUser) {
            throw new AppError(400, "Failed to delete user");
        }
        await session.commitTransaction();
        await session.endSession();

        return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(400, error.message);
    }
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;
    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData,
    };
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }
    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }

    const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

export const StudentServices = {
    getAllStudentsFromDB,
    getStudentByIdFromDB,
    deleteStudentByIdFromDB,
    updateStudentIntoDB,
};
