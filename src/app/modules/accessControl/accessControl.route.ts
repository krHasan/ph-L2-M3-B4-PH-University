import express from "express";
import { AccessControlControllers } from "./accessControl.controller";
import { AccessControlValidations } from "./accessControl.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
    "/",
    auth(USER_ROLE.SuperAdmin),
    validateRequest(
        AccessControlValidations.createAccessControlValidationSchema,
    ),
    AccessControlControllers.addANewAccessControl,
);

router.get("/", auth(), AccessControlControllers.getAllAccessControls);

export const AccessControlRoutes = router;
