import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { httpStatus } from "../../config/httpStatus";

export const createToken = (
    jwtPayload: { userId: string; role: string },
    secret: string,
    expiresIn: string,
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn,
    });
};

export const verifyToken = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }
};
