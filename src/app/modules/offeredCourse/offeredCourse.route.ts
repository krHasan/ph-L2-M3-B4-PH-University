import express from "express";
import { OfferedCourseControllers } from "./offeredCourse.controller";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offeredCourse.validation";

const router = express.Router();

router.post(
    "/create-offered-course",
    validateRequest(
        OfferedCourseValidations.createOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.createOfferedCourse,
);
router.get("/", OfferedCourseControllers.getAllOfferedCourses);
router.get("/:id", OfferedCourseControllers.getOfferedCourse);
router.patch(
    "/:id",
    validateRequest(
        OfferedCourseValidations.updatedOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.updateOfferedCourse,
);
router.delete("/:id", OfferedCourseControllers.deleteOfferedCourse);

export const OfferedCourseRoute = router;
