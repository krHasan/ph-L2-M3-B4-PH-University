import { httpStatus } from "../../config/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FacultyServices } from "./faculty.service";

const getAllFaculties = catchAsync(async (req, res) => {
    const result = await FacultyServices.getAllFacultyFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Faculties list",
        meta: result.meta,
        data: result.result,
    });
});

const getFacultyById = catchAsync(async (req, res) => {
    const result = await FacultyServices.getFacultyByIdFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Faculty Information",
        data: result,
    });
});

const deleteFacultyById = catchAsync(async (req, res) => {
    const facultyId = req.params.id;
    const result = await FacultyServices.deleteFacultyFromDB(facultyId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Faculty is deleted",
        data: result,
    });
});

const updateFaculty = catchAsync(async (req, res) => {
    const facultyId = req.params.id;
    const result = await FacultyServices.updateFacultyIntoDB(
        facultyId,
        req.body.faculty,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Faculty is Updated Successfully",
        data: result,
    });
});

export const FacultyControllers = {
    getAllFaculties,
    getFacultyById,
    deleteFacultyById,
    updateFaculty,
};
