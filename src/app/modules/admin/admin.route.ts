import express from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
    "/",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AdminControllers.getAllAdmins,
);
router.get(
    "/:id",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AdminControllers.getAdminById,
);
router.delete(
    "/:id",
    auth(USER_ROLE.superAdmin),
    AdminControllers.deleteAdminById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.superAdmin),
    validateRequest(adminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

export const AdminRoutes = router;
