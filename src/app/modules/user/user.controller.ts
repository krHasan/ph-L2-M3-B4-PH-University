import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { password, student } = req.body;

        // const zodParsedData = studentValidationSchema.parse(student);

        const result = await UserServices.createStudentIntoDB(
            password,
            student,
        );
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Student is created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const UserControllers = {
    createStudent,
};
