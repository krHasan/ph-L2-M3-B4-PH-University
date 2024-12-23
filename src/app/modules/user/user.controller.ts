import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body;

    const result = await UserServices.createStudentIntoDB(
        password,
        student,
        req?.file,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Student is created successfully",
        data: result,
    });
});

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty } = req.body;

    const result = await UserServices.createFacultyIntoDB(password, faculty);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Faculty is created successfully",
        data: result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin } = req.body;

    const result = await UserServices.createAdminIntoDB(password, admin);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Admin is created successfully",
        data: result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await UserServices.getMe(user);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Data retrieved successfully",
        data: result,
    });
});

const changeStatus = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const result = await UserServices.changeStatus(userId, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User status updated successfully",
        data: result,
    });
});

export const UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus,
};
