import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/create-academic-department",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(
        AcademicDepartmentValidation.createAcademicDepartmentValidation,
    ),
    AcademicDepartmentControllers.createDepartmentFaculty,
);

router.get(
    "/",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    AcademicDepartmentControllers.getAllAcademicDepartment,
);
router.get(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    AcademicDepartmentControllers.getAcademicDepartmentById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(
        AcademicDepartmentValidation.updateAcademicDepartmentValidation,
    ),
    AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
