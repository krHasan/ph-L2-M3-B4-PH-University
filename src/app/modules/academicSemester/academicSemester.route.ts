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

//will call controller
// router.get("/", StudentControllers.getAllStudents);
// router.get("/:studentId", StudentControllers.getStudentById);
// router.delete("/:studentId", StudentControllers.deleteStudentById);

export const AcademicSemesterRoutes = router;
