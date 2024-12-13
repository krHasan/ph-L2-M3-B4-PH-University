import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CourseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Course is created successfully",
        data: result,
    });
});

const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCoursesFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Courses Lists",
        count: result?.length,
        data: result,
    });
});

const getCourseById = catchAsync(async (req, res) => {
    const result = await CourseServices.getCourseByIdFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Course Information",
        data: result,
    });
});

const deleteCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.deleteCourseFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Course is deleted successfully",
        data: result,
    });
});

const updateCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.updateCourseIntoDB(
        req.params.id,
        req.body,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Course is Updated Successfully",
        data: result,
    });
});

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.assignFacultiesWithCourseIntoDB(
        req.params.courseId,
        req.body.faculties,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Faculties assigned Successfully",
        data: result,
    });
});

const removeFacultiesWithCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.removeFacultiesWithCourseIntoDB(
        req.params.courseId,
        req.body.faculties,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Faculties removed Successfully",
        data: result,
    });
});

export const CourseControllers = {
    createCourse,
    getAllCourses,
    getCourseById,
    deleteCourse,
    updateCourse,
    assignFacultiesWithCourse,
    removeFacultiesWithCourse,
};
