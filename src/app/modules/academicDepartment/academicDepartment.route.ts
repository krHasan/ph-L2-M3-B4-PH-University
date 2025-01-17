import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/create-academic-department",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        AcademicDepartmentValidation.createAcademicDepartmentValidation,
    ),
    AcademicDepartmentControllers.createDepartmentFaculty,
);

router.get(
    "/",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AcademicDepartmentControllers.getAllAcademicDepartment,
);
router.get(
    "/:id",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AcademicDepartmentControllers.getAcademicDepartmentById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        AcademicDepartmentValidation.updateAcademicDepartmentValidation,
    ),
    AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
