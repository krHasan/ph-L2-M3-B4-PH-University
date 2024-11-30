import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllStudents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Students list",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getStudentById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const studentId = req.params.studentId;
        const result = await StudentServices.getStudentByIdFromDB(studentId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Student Information",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const deleteStudentById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const studentId = req.params.studentId;
        const result = await StudentServices.deleteStudentByIdFromDB(studentId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Student Deleted",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const StudentControllers = {
    getAllStudents,
    getStudentById,
    deleteStudentById,
};
