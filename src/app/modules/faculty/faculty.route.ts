import express from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidations } from "./faculty.validation";

const router = express.Router();

router.get("/", FacultyControllers.getAllFaculties);
router.get("/:id", FacultyControllers.getFacultyById);
router.delete("/:id", FacultyControllers.deleteFacultyById);
router.patch(
    "/:id",
    validateRequest(facultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFaculty,
);

export const FacultyRoutes = router;
