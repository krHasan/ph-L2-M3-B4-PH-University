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
        message: "Student is created successfully",
        data: result,
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
};
