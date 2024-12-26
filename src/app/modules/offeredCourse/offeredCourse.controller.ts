import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(
        req.body,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Offered course created successfully",
        data: result,
    });
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
        req.query,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Offered course lists",
        meta: result.meta,
        data: result.result,
    });
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
        userId,
        req.query,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "My offered courses lists",
        data: result,
    });
});

const getOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getOfferedCourseByIdFromDB(
        req.params.id,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Offered course information",
        data: result,
    });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
        req.params.id,
        req.body,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Offered course information updated successfully",
        data: result,
    });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(
        req.params.id,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Offered course has been deleted successfully",
        data: result,
    });
});

export const OfferedCourseControllers = {
    createOfferedCourse,
    getAllOfferedCourses,
    getMyOfferedCourses,
    getOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse,
};
