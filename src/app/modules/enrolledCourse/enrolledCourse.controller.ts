import { httpStatus } from "../../config/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
        userId,
        req.body,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student is enrolled successfully",
        data: result,
    });
});

const myEnrolledCourses = catchAsync(async (req, res) => {
    const studentId = req.user.userId;
    const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
        studentId,
        req.query,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Data retried successfully",
        meta: result.meta,
        data: result.result,
    });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
        req.user.userId,
        req.body,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Marks is update successfully",
        data: result,
    });
});

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    myEnrolledCourses,
    updateEnrolledCourseMarks,
};
