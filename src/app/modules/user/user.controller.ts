import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body;

    const result = await UserServices.createStudentIntoDB(password, student);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Student is created successfully",
        data: result,
    });
});

export const UserControllers = {
    createStudent,
};
