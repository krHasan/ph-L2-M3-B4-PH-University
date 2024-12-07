import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";

const router = express.Router();

router.post(
    "/create-academic-department",
    validateRequest(
        AcademicDepartmentValidation.createAcademicDepartmentValidation,
    ),
    AcademicDepartmentControllers.createDepartmentFaculty,
);

router.get("/", AcademicDepartmentControllers.getAllAcademicDepartment);
router.get("/:id", AcademicDepartmentControllers.getAcademicDepartmentById);
router.patch(
    "/:id",
    validateRequest(
        AcademicDepartmentValidation.updateAcademicDepartmentValidation,
    ),
    AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
