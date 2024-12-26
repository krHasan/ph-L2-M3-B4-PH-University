import express from "express";
import { OfferedCourseControllers } from "./offeredCourse.controller";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offeredCourse.validation";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/create-offered-course",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(
        OfferedCourseValidations.createOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.createOfferedCourse,
);
router.get(
    "/",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin, USER_ROLE.Faculty),
    OfferedCourseControllers.getAllOfferedCourses,
);
router.get(
    "/my-offered-courses",
    auth(USER_ROLE.Student),
    OfferedCourseControllers.getMyOfferedCourses,
);
router.get(
    "/:id",
    auth(
        USER_ROLE.SuperAdmin,
        USER_ROLE.Admin,
        USER_ROLE.Faculty,
        USER_ROLE.Student,
    ),
    OfferedCourseControllers.getOfferedCourse,
);
router.patch(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    validateRequest(
        OfferedCourseValidations.updatedOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.updateOfferedCourse,
);
router.delete(
    "/:id",
    auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
    OfferedCourseControllers.deleteOfferedCourse,
);

export const OfferedCourseRoute = router;
