import express from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";

const router = express.Router();

router.get("/", AdminControllers.getAllAdmins);
router.get("/:id", AdminControllers.getAdminById);
router.delete("/:id", AdminControllers.deleteAdminById);
router.patch(
    "/:id",
    validateRequest(adminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

export const AdminRoutes = router;
