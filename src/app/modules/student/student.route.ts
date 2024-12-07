import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "./student.validation";

const router = express.Router();

//will call controller
router.get("/", StudentControllers.getAllStudents);
router.get("/:studentId", StudentControllers.getStudentById);
router.delete("/:studentId", StudentControllers.deleteStudentById);
router.patch(
    "/:studentId",
    validateRequest(studentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent,
);

export const StudentRoutes = router;
