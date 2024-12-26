import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/create-course",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
);
router.get(
    "/:id",
    auth(
        USER_ROLE.SuperAdmin,
        USER_ROLE.Admin,
        USER_ROLE.Faculty,
        USER_ROLE.Student,
    ),
    CourseControllers.getCourseById,
);
router.get(
    "/",
    auth(
        USER_ROLE.SuperAdmin,
        USER_ROLE.Admin,
        USER_ROLE.Faculty,
        USER_ROLE.Student,
    ),
    CourseControllers.getAllCourses,
);
router.delete(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    CourseControllers.deleteCourse,
);
router.patch(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(CourseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
);

router.put(
    "/:courseId/assign-faculties",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse,
);

router.get(
    "/:courseId/get-faculties",
    auth(
        USER_ROLE.SuperAdmin,
        USER_ROLE.Admin,
        USER_ROLE.Faculty,
        USER_ROLE.Student,
    ),
    CourseControllers.getFacultiesWithCourse,
);

router.delete(
    "/:courseId/remove-faculties",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesWithCourse,
);

export const CourseRoute = router;
