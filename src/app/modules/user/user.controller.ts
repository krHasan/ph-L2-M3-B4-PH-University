import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body;

    const result = await UserServices.createStudentIntoDB(password, student);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Student is created successfully",
        data: result,
    });
});

export const UserControllers = {
    createStudent,
};
