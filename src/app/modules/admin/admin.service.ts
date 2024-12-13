/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { adminSearchableFields } from "./admin.constant";
import { Admin } from "./admin.model";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TAdmin } from "./admin.interface";

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
    const adminQuery = new QueryBuilder(Admin.find(), query)
        .search(adminSearchableFields)
        .paginate()
        .filter()
        .sort()
        .fields();

    const result = await adminQuery.modelQuery;
    return result;
};

const getAdminByIdFromDB = async (id: string) => {
    const result = await Admin.findById(id);
    return result;
};

const deleteAdminFromDB = async (id: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const deleteAdmin = await Admin.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session },
        );
        if (!deleteAdmin) {
            throw new AppError(400, "Failed to delete admin");
        }

        const deletedUser = await User.findByIdAndUpdate(
            deleteAdmin.user,
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

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
    const { name, ...remainingStudentData } = payload;
    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData,
    };
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }

    const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

export const AdminServices = {
    getAllAdminFromDB,
    getAdminByIdFromDB,
    deleteAdminFromDB,
    updateAdminIntoDB,
};
