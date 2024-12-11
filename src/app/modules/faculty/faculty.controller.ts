import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FacultyServices } from "./faculty.service";

const getAllFaculties = catchAsync(async (req, res) => {
    const result = await FacultyServices.getAllFacultyFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Faculties list",
        count: result?.length,
        data: result,
    });
});

const getFacultyById = catchAsync(async (req, res) => {
    const result = await FacultyServices.getFacultyByIdFromDB(
        req.params.facultyId,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Faculty Information",
        data: result,
    });
});

const deleteFacultyById = catchAsync(async (req, res) => {
    const facultyId = req.params.facultyId;
    const result = await FacultyServices.deleteFacultyFromDB(facultyId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Faculty is deleted",
        data: result,
    });
});

const updateFaculty = catchAsync(async (req, res) => {
    const facultyId = req.params.facultyId;
    const result = await FacultyServices.updateFacultyIntoDB(
        facultyId,
        req.body.faculty,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Student is Updated Successfully",
        data: result,
    });
});

export const FacultyControllers = {
    getAllFaculties,
    getFacultyById,
    deleteFacultyById,
    updateFaculty,
};
