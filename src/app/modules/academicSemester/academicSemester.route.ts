import express from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/create-academic-semester",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(
        AcademicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.createAcademicSemester,
);

router.get(
    "/",
    auth(
        USER_ROLE.SuperAdmin,
        USER_ROLE.Admin,
        USER_ROLE.Faculty,
        USER_ROLE.Student,
    ),
    AcademicSemesterControllers.getAllAcademicSemester,
);
router.get(
    "/:id",
    auth(
        USER_ROLE.SuperAdmin,
        USER_ROLE.Admin,
        USER_ROLE.Faculty,
        USER_ROLE.Student,
    ),
    AcademicSemesterControllers.getAcademicSemesterById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(
        AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.updateAcademicSemester,
);

export const AcademicSemesterRoutes = router;
