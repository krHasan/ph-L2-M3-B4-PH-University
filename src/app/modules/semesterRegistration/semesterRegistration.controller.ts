import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
            req.body,
        );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Semester Registration has been created successfully",
        data: result,
    });
});

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(
            req.query,
        );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Semester Registration list",
        meta: result.meta,
        data: result.result,
    });
});

const getSemesterRegistrationById = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationServices.getSemesterRegistrationByIdFromDB(
            req.params?.id,
        );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Semester Registration Information",
        data: result,
    });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
            req.params.id,
            req.body,
        );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Semester Registration is Updated Successfully",
        data: result,
    });
});

const deleteSemesterRegistration = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(
            req.params.id,
        );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Semester Registration has been deleted Successfully",
        data: result,
    });
});

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSemesterRegistrationById,
    updateSemesterRegistration,
    deleteSemesterRegistration,
};
