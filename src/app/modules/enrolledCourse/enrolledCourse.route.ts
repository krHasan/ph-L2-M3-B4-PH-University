import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";
import { EnrolledCourseControllers } from "./enrolledCourse.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
    "/create-enrolled-course",
    auth(USER_ROLE.Student),
    validateRequest(
        EnrolledCourseValidations.createEnrolledCourseValidationSchema,
    ),
    EnrolledCourseControllers.createEnrolledCourse,
);

router.get(
    "/my-enrolled-courses",
    auth(USER_ROLE.Student),
    EnrolledCourseControllers.myEnrolledCourses,
);

router.patch(
    "/update-enrolled-course-marks",
    auth(USER_ROLE.Faculty, USER_ROLE.Admin, USER_ROLE.SuperAdmin),
    validateRequest(
        EnrolledCourseValidations.updateEnrolledCourseMarksValidationSchema,
    ),
    EnrolledCourseControllers.updateEnrolledCourseMarks,
);

export const EnrolledCourseRoutes = router;
