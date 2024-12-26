import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "./student.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

//will call controller
router.get(
    "/",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    StudentControllers.getAllStudents,
);
router.get(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin, USER_ROLE.Faculty),
    StudentControllers.getStudentById,
);
router.delete(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    StudentControllers.deleteStudentById,
);
router.patch(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(studentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent,
);

export const StudentRoutes = router;
