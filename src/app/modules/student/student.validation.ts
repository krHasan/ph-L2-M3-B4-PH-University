import { z } from "zod";
import { bloodGroupArray, genderTypesArray } from "../user/user.constant";
import { UserValidation } from "../user/user.validation";

const guardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string(),
});

const localGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
});

const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20).optional(),
        student: z.object({
            name: UserValidation.userNameValidationSchema,
            gender: z.enum(genderTypesArray as [string, ...string[]]),
            dateOfBirth: z.string().optional(),
            email: z.string().email(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z.enum(bloodGroupArray as [string, ...string[]]),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            guardian: guardianValidationSchema,
            localGuardian: localGuardianValidationSchema,
            // profileImg: z.string(),
            admissionSemester: z.string().optional(),
            academicDepartment: z.string(),
        }),
    }),
});

const updateGuardianValidationSchema = z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherContactNo: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
    name: z.string().optional(),
    occupation: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional(),
});

export const updateStudentValidationSchema = z.object({
    body: z.object({
        student: z.object({
            name: UserValidation.updateUserNameValidationSchema,
            gender: z
                .enum(genderTypesArray as [string, ...string[]])
                .optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z
                .enum(bloodGroupArray as [string, ...string[]])
                .optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            guardian: updateGuardianValidationSchema.optional(),
            localGuardian: updateLocalGuardianValidationSchema.optional(),
            admissionSemester: z.string().optional(),
            // profileImg: z.string().optional(),
            academicDepartment: z.string().optional(),
        }),
    }),
});

export const studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema,
};
