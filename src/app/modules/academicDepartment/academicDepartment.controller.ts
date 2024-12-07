import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const createDepartmentFaculty = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.createAcademicDepartmentIntoDB(
            req.body,
        );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Department is created successfully",
        data: result,
    });
});

const getAllAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartment();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Department Lists",
        data: result,
    });
});

const getAcademicDepartmentById = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAcademicDepartmentById(
        req.params.id,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Department Information",
        data: result,
    });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
            req.params.id,
            req.body,
        );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Academic Department is Updated Successfully",
        data: result,
    });
});

export const AcademicDepartmentControllers = {
    createDepartmentFaculty,
    getAllAcademicDepartment,
    getAcademicDepartmentById,
    updateAcademicDepartment,
};
