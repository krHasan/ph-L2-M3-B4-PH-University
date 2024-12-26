import express from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidations } from "./faculty.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
    "/",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin, USER_ROLE.Faculty),
    FacultyControllers.getAllFaculties,
);
router.get(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin, USER_ROLE.Faculty),
    FacultyControllers.getFacultyById,
);
router.delete(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    FacultyControllers.deleteFacultyById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(facultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFaculty,
);

export const FacultyRoutes = router;
