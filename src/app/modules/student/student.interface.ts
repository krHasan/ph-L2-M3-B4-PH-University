import { Model, Types } from "mongoose";
import { TBloodGroup, TGender, TUserName } from "../user/user.interface";

export type TGuardian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
};

export type TLocalGuardian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
};

export type TStudent = {
    id: string;
    user: Types.ObjectId;
    name: TUserName;
    gender: TGender;
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: TBloodGroup;
    presentAddress: string;
    permanentAddress: string;
    guardian: TGuardian;
    localGuardian: TLocalGuardian;
    profileImg?: string;
    admissionSemester?: Types.ObjectId;
    isDeleted: boolean;
    academicDepartment: Types.ObjectId;
    academicFaculty: Types.ObjectId;
};

//for creating static method
export interface StudentModel extends Model<TStudent> {
    // eslint-disable-next-line no-unused-vars
    isUserExists(id: string): Promise<TStudent | null>;
}

//for creating instance
// export type StudentMethods = {
//     isUserExists(id: string): Promise<TStudent | null>;
// };

// export type StudentModel = Model<
//     TStudent,
//     Record<string, never>,
//     StudentMethods
// >;
