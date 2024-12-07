import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";
import { AcademicFacultyControllers } from "./academicFaculty.controller";

const router = express.Router();

router.post(
    "/create-academic-faculty",
    validateRequest(AcademicFacultyValidation.createAcademicFacultyValidation),
    AcademicFacultyControllers.createAcademicFaculty,
);

router.get("/", AcademicFacultyControllers.getAllAcademicFaculty);
router.get("/:id", AcademicFacultyControllers.getAcademicFacultyById);
router.patch(
    "/:id",
    validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidation),
    AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
