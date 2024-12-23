import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "./student.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

//will call controller
router.get("/", StudentControllers.getAllStudents);
router.get(
    "/:id",
    auth(USER_ROLE.Admin, USER_ROLE.Faculty),
    StudentControllers.getStudentById,
);
router.delete("/:id", StudentControllers.deleteStudentById);
router.patch(
    "/:id",
    validateRequest(studentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent,
);

export const StudentRoutes = router;
