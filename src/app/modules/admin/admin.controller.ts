import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getAllAdmins = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllAdminFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Admins list",
        count: result?.length,
        data: result,
    });
});

const getAdminById = catchAsync(async (req, res) => {
    const result = await AdminServices.getAdminByIdFromDB(req.params.adminId);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Admin Information",
        data: result,
    });
});

const deleteAdminById = catchAsync(async (req, res) => {
    const adminId = req.params.adminId;
    const result = await AdminServices.deleteAdminFromDB(adminId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Admin is deleted",
        data: result,
    });
});

const updateAdmin = catchAsync(async (req, res) => {
    const adminId = req.params.adminId;
    const result = await AdminServices.updateAdminIntoDB(
        adminId,
        req.body.admin,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Admin is Updated Successfully",
        data: result,
    });
});

export const AdminControllers = {
    getAllAdmins,
    getAdminById,
    deleteAdminById,
    updateAdmin,
};
