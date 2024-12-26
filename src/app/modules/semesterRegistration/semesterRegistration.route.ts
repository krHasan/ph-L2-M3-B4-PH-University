import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/create-semester-registration",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(
        SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.createSemesterRegistration,
);
router.get(
    "/",
    auth(
        USER_ROLE.SuperAdmin,
        USER_ROLE.Admin,
        USER_ROLE.Faculty,
        USER_ROLE.Student,
    ),
    SemesterRegistrationControllers.getAllSemesterRegistrations,
);
router.get(
    "/:id",
    auth(
        USER_ROLE.SuperAdmin,
        USER_ROLE.Admin,
        USER_ROLE.Faculty,
        USER_ROLE.Student,
    ),
    SemesterRegistrationControllers.getSemesterRegistrationById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(
        SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.updateSemesterRegistration,
);
router.delete(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    SemesterRegistrationControllers.deleteSemesterRegistration,
);

export const SemesterRegistrationRouter = router;
