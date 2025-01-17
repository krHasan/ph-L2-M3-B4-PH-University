/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import {
    generateAdminId,
    generateFacultyId,
    generateStudentId,
} from "./user.utils";
import AppError from "../../errors/AppError";
import { TFaculty } from "../faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";
import { TAdmin } from "../admin/admin.interface";
import { Admin } from "../admin/admin.model";
import { USER_ROLE } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { httpStatus } from "../../config/httpStatus";

const createStudentIntoDB = async (
    password: string,
    payload: TStudent,
    file: any,
) => {
    const userData: Partial<TUser> = {};

    userData.password = password || (config.default_password as string);
    userData.role = USER_ROLE.student;
    userData.email = payload.email;

    const admissionSemester = await AcademicSemester.findById(
        payload.admissionSemester,
    );
    if (!admissionSemester) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Admission semester not found",
        );
    }

    // find department
    const academicDepartment = await AcademicDepartment.findById(
        payload.academicDepartment,
    );
    if (!academicDepartment) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Academic department not found",
        );
    }
    payload.academicFaculty = academicDepartment.academicFaculty;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        if (admissionSemester)
            userData.id = await generateStudentId(admissionSemester);

        if (file) {
            //image upload
            const imageName = `${userData?.id}-${payload?.name?.firstName}_${payload?.name?.lastName}`;
            const uploadResult = await sendImageToCloudinary(
                file.path,
                imageName,
            );
            payload.profileImg = uploadResult?.secure_url;
        }

        const newUser = await User.create([userData], { session });

        if (!newUser.length) {
            throw new AppError(400, "Failed to create user");
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        const newStudent = await Student.create([payload], { session });
        if (!newStudent) {
            throw new AppError(400, "Failed to create student");
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(400, error.message);
    }
};

const createFacultyIntoDB = async (
    password: string,
    payload: TFaculty,
    file: any,
) => {
    const userData: Partial<TUser> = {};

    userData.password = password || (config.default_password as string);
    userData.role = USER_ROLE.faculty;
    userData.email = payload.email;

    const academicDepartment = await AcademicDepartment.findById(
        payload.academicDepartment,
    );
    if (!academicDepartment) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Academic department not found",
        );
    }
    payload.academicFaculty = academicDepartment.academicFaculty;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        if (!academicDepartment) {
            throw new AppError(400, "Academic Department doesn't exists");
        }

        userData.id = await generateFacultyId();

        if (file) {
            //image upload
            const imageName = `${userData?.id}-${payload?.name?.firstName}_${payload?.name?.lastName}`;
            const uploadResult = await sendImageToCloudinary(
                file.path,
                imageName,
            );
            payload.profileImg = uploadResult?.secure_url;
        }

        const newUser = await User.create([userData], { session });

        if (!newUser.length) {
            throw new AppError(400, "Failed to create user");
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        const newFaculty = await Faculty.create([payload], { session });
        if (!newFaculty) {
            throw new AppError(400, "Failed to create faculty");
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(400, error.message);
    }
};

const createAdminIntoDB = async (
    password: string,
    payload: TAdmin,
    file: any,
) => {
    const userData: Partial<TUser> = {};

    userData.password = password || (config.default_password as string);
    userData.role = USER_ROLE.admin;
    userData.email = payload.email;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        userData.id = await generateAdminId();

        if (file) {
            //image upload
            const imageName = `${userData?.id}-${payload?.name?.firstName}_${payload?.name?.lastName}`;
            const uploadResult = await sendImageToCloudinary(
                file.path,
                imageName,
            );
            payload.profileImg = uploadResult?.secure_url;
        }

        const newUser = await User.create([userData], { session });

        if (!newUser.length) {
            throw new AppError(400, "Failed to create user");
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        const newAdmin = await Admin.create([payload], { session });
        if (!newAdmin) {
            throw new AppError(400, "Failed to create admin");
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(400, error.message);
    }
};

const getMe = async (decoded: JwtPayload) => {
    const { userId, role } = decoded;
    let result = null;
    if (role === USER_ROLE.student) {
        result = await Student.findOne({ id: userId });
    }
    if (role === USER_ROLE.admin) {
        result = await Admin.findOne({ id: userId });
    }
    if (role === USER_ROLE.faculty) {
        result = await Faculty.findOne({ id: userId });
    }
    return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe,
    changeStatus,
};
