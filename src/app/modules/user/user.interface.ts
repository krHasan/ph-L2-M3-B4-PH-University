/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import {
    BLOOD_GROUPS,
    GENDER_TYPES,
    USER_ROLE,
    USER_STATUS,
} from "./user.constant";

export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = keyof typeof USER_STATUS;
export type TGender = keyof typeof GENDER_TYPES;
export type TBloodGroup = keyof typeof BLOOD_GROUPS;

export type TUserName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export interface TUser {
    id: string;
    email: string;
    password: string;
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
    role: TUserRole;
    status: TUserStatus;
    isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
    isUserExistsByCustomId(id: string): Promise<TUser>;
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>;
    isJWTIssuedBeforePasswordChanged(
        passwordChangedTimestamp: Date,
        jwtIssuedTimestamp: number,
    ): boolean;
}
