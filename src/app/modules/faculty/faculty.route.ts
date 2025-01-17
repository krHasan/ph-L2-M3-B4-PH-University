import express from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidations } from "./faculty.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
    "/",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyControllers.getAllFaculties,
);
router.get(
    "/:id",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyControllers.getFacultyById,
);
router.delete(
    "/:id",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    FacultyControllers.deleteFacultyById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(facultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFaculty,
);

export const FacultyRoutes = router;
