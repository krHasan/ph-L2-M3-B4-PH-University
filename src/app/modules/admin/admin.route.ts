import express from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
    "/",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    AdminControllers.getAllAdmins,
);
router.get(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    AdminControllers.getAdminById,
);
router.delete(
    "/:id",
    auth(USER_ROLE.SuperAdmin),
    AdminControllers.deleteAdminById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.SuperAdmin),
    validateRequest(adminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

export const AdminRoutes = router;
