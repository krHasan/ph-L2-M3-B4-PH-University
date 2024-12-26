import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { httpStatus } from "../config/httpStatus";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../modules/auth/auth.utils";
import { USER_STATUS } from "../modules/user/user.constant";
import { AccessControlServices } from "../modules/accessControl/accessControl.service";

const auth = (...requiredRoles: TUserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized",
                );
            }

            const decoded = verifyToken(
                token,
                config.jwt_access_secret as string,
            );

            const { role, userId, iat } = decoded;

            const user = await User.isUserExistsByCustomId(userId);
            if (
                !user ||
                user?.isDeleted ||
                user?.status === USER_STATUS.Blocked
            ) {
                throw new AppError(httpStatus.NOT_FOUND, "User not found");
            }

            if (
                user?.passwordChangedAt &&
                User.isJWTIssuedBeforePasswordChanged(
                    user?.passwordChangedAt,
                    iat as number,
                )
            ) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized",
                );
            }

            const allowedRoles =
                await AccessControlServices.getRolesByMethodAndUrl(
                    req.method,
                    req.baseUrl + req.route.path,
                );

            console.log(
                `AllowedRoles: ${allowedRoles} for ${req.method}: ${req.baseUrl + req.route.path}`,
            );
            if (allowedRoles?.length && !allowedRoles.includes(role)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized",
                );
            } else if (requiredRoles?.length && !requiredRoles.includes(role)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized",
                );
            }

            req.user = decoded as JwtPayload;
            return next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;
