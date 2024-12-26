import { z } from "zod";
import { bloodGroupArray, genderTypesArray } from "../user/user.constant";
import { UserValidation } from "../user/user.validation";

const createFacultyValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20).optional(),
        faculty: z.object({
            name: UserValidation.userNameValidationSchema,
            designation: z.string(),
            gender: z.enum(genderTypesArray as [string, ...string[]]),
            dateOfBirth: z.string().optional(),
            email: z.string().email(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z
                .enum(bloodGroupArray as [string, ...string[]])
                .optional(),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            profileImg: z.string().optional(),
            academicDepartment: z.string(),
        }),
    }),
});

const updateFacultyValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20).optional(),
        faculty: z.object({
            name: UserValidation.updateUserNameValidationSchema,
            designation: z.string().optional(),
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
            profileImg: z.string().optional(),
            academicDepartment: z.string().optional(),
        }),
    }),
});

export const facultyValidations = {
    createFacultyValidationSchema,
    updateFacultyValidationSchema,
};
