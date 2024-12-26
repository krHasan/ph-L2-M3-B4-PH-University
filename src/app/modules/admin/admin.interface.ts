import { Model, Types } from "mongoose";
import { TBloodGroup, TGender, TUserName } from "../user/user.interface";

export type TAdmin = {
    id: string;
    user: Types.ObjectId;
    designation: string;
    name: TUserName;
    gender: TGender;
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: TBloodGroup;
    presentAddress: string;
    permanentAddress: string;
    profileImg?: string;
    isDeleted: boolean;
};

export interface AdminModel extends Model<TAdmin> {
    // eslint-disable-next-line no-unused-vars
    isUserExists(id: string): Promise<TAdmin | null>;
}
