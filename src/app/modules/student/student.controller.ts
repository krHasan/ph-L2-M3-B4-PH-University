import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Students list",
        data: result,
    });
});

const getStudentById = catchAsync(async (req, res) => {
    const studentId = req.params.studentId;
    const result = await StudentServices.getStudentByIdFromDB(studentId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Student Information",
        data: result,
    });
});

const deleteStudentById = catchAsync(async (req, res) => {
    const studentId = req.params.studentId;
    const result = await StudentServices.deleteStudentByIdFromDB(studentId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Student Deleted",
        data: result,
    });
});

export const StudentControllers = {
    getAllStudents,
    getStudentById,
    deleteStudentById,
};
