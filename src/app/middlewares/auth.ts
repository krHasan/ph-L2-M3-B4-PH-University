import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { httpStatus } from "../config/httpStatus";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../modules/auth/auth.utils";

const auth = (...requiredRoles: TUserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log("auth originalUrl", req.originalUrl);
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
            if (!user || user?.isDeleted || user?.status === "blocked") {
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

            if (requiredRoles && !requiredRoles.includes(role)) {
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
