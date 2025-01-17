import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
    "/create-academic-faculty",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicFacultyValidation.createAcademicFacultyValidation),
    AcademicFacultyControllers.createAcademicFaculty,
);

router.get(
    "/",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AcademicFacultyControllers.getAllAcademicFaculty,
);
router.get(
    "/:id",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AcademicFacultyControllers.getAcademicFacultyById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidation),
    AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
