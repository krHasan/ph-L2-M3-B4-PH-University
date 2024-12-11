import express from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";

const router = express.Router();

router.get("/", AdminControllers.getAllAdmins);
router.get("/:adminId", AdminControllers.getAdminById);
router.delete("/:adminId", AdminControllers.deleteAdminById);
router.patch(
    "/:adminId",
    validateRequest(adminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

export const AdminRoutes = router;
