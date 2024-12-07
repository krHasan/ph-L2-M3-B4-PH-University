import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
        req.body,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Faculty is created successfully",
        data: result,
    });
});

const getAllAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFaculty();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Faculty Lists",
        data: result,
    });
});

const getAcademicFacultyById = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAcademicFacultyById(
        req.params.id,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Faculty Information",
        data: result,
    });
});

const updateAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
        req.params.id,
        req.body,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Faculty is Updated Successfully",
        data: result,
    });
});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getAcademicFacultyById,
    updateAcademicFaculty,
};
