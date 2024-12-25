import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "./auth.utils";
import { httpStatus } from "../../config/httpStatus";
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
    const user = await User.isUserExistsByCustomId(payload?.id);
    if (!user || user?.isDeleted || user?.status === "blocked") {
        throw new AppError(404, "User not found");
    }

    const isPasswordMatched = await User.isPasswordMatched(
        payload?.password,
        user.password,
    );

    if (!isPasswordMatched) {
        throw new AppError(403, "Password didn't not matched");
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange,
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {
    const user = await User.isUserExistsByCustomId(userData?.userId);
    if (!user || user?.isDeleted || user?.status === "blocked") {
        throw new AppError(404, "User not found");
    }

    const isPasswordMatched = await User.isPasswordMatched(
        payload?.oldPassword,
        user?.password,
    );

    if (!isPasswordMatched) {
        throw new AppError(403, "Password did not matched");
    }

    const newHashedPassword = await bcrypt.hash(
        payload?.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        {
            id: userData.userId,
            role: userData.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );

    return null;
};

const refreshToken = async (token: string) => {
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    const { userId, iat } = decoded;

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
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
};

const forgetPassword = async (userId: string) => {
    const user = await User.isUserExistsByCustomId(userId);
    if (!user || user?.isDeleted || user?.status === "blocked") {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        "10m",
    );

    const resetUILink = `${config.frontend_link}?id=${user.id}&token=${resetToken}`;

    sendEmail(user.email, resetUILink);
};

const resetPassword = async (
    payload: { id: string; newPassword: string },
    token: string,
) => {
    const user = await User.isUserExistsByCustomId(payload.id);
    if (!user || user?.isDeleted || user?.status === "blocked") {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const decoded = verifyToken(token, config.jwt_access_secret as string);

    if (payload.id !== decoded.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are forbidden");
    }

    const newHashedPassword = await bcrypt.hash(
        payload?.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        {
            id: decoded.userId,
            role: decoded.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );
};

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
