import express from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidations } from "./faculty.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
    "/",
    auth(USER_ROLE.Admin, USER_ROLE.Faculty),
    FacultyControllers.getAllFaculties,
);
router.get("/:id", FacultyControllers.getFacultyById);
router.delete("/:id", FacultyControllers.deleteFacultyById);
router.patch(
    "/:id",
    validateRequest(facultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFaculty,
);

export const FacultyRoutes = router;
