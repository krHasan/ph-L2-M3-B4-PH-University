import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
        req.body,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic semester is created successfully",
        data: result,
    });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemester(
        req.query,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic semesters are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getAcademicSemesterById = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAcademicSemesterById(
        req.params.id,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Semester",
        data: result,
    });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
        req.params.id,
        req.body,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Semester Updated Successfully",
        data: result,
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemester,
    getAcademicSemesterById,
    updateAcademicSemester,
};
