import { Model, Types } from "mongoose";
import { TBloodGroup, TGender, TUserName } from "../user/user.interface";

export type TFaculty = {
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
    academicDepartment: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    isDeleted: boolean;
};

export interface FacultyModel extends Model<TFaculty> {
    // eslint-disable-next-line no-unused-vars
    isUserExists(id: string): Promise<TFaculty | null>;
}
