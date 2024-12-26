/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { facultySearchableFields } from "./faculty.constant";
import { Faculty } from "./faculty.model";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TFaculty } from "./faculty.interface";

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
    const facultyQuery = new QueryBuilder(
        Faculty.find().populate("academicDepartment academicFaculty"),
        query,
    )
        .search(facultySearchableFields)
        .paginate()
        .filter()
        .sort()
        .fields();

    const result = await facultyQuery.modelQuery;
    const meta = await facultyQuery.getMetaData();
    return { meta, result };
};

const getFacultyByIdFromDB = async (id: string) => {
    const result = await Faculty.findById(id).populate(
        "academicDepartment academicFaculty",
    );
    return result;
};

const deleteFacultyFromDB = async (id: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const deleteFaculty = await Faculty.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session },
        );
        if (!deleteFaculty) {
            throw new AppError(400, "Failed to delete faculty");
        }

        const deletedUser = await User.findByIdAndUpdate(
            deleteFaculty.user,
            { isDeleted: true },
            { new: true, session },
        );
        if (!deletedUser) {
            throw new AppError(400, "Failed to delete user");
        }
        await session.commitTransaction();
        await session.endSession();
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(400, error.message);
    }
};

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
    const { name, ...remainingStudentData } = payload;
    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData,
    };
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }

    const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

export const FacultyServices = {
    getAllFacultyFromDB,
    getFacultyByIdFromDB,
    deleteFacultyFromDB,
    updateFacultyIntoDB,
};
