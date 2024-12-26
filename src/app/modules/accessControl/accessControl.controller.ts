import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AccessControlServices } from "./accessControl.service";

const addANewAccessControl = catchAsync(async (req, res) => {
    const result = await AccessControlServices.addANewAccessControlIntoDB(
        req.body,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Access control added successfully",
        data: result,
    });
});

const getAllAccessControls = catchAsync(async (req, res) => {
    const result = await AccessControlServices.getAllAccessControlsFromDB(
        req.query,
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Access control lists",
        meta: result.meta,
        data: result.result,
    });
});

export const AccessControlControllers = {
    addANewAccessControl,
    getAllAccessControls,
};
