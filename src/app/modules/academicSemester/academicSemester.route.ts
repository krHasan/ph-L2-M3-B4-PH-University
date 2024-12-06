import express from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
    "/create-academic-semester",
    validateRequest(
        AcademicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.createAcademicSemester,
);

router.get("/", AcademicSemesterControllers.getAllAcademicSemester);
router.get("/:id", AcademicSemesterControllers.getAcademicSemesterById);
router.patch(
    "/:id",
    validateRequest(
        AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.updateAcademicSemester,
);

export const AcademicSemesterRoutes = router;
