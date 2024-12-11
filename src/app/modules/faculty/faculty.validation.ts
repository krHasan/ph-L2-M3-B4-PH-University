import { z } from "zod";
import { CommonValidationSchemas } from "../common/common.validation";

const createFacultyValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20).optional(),
        faculty: z.object({
            name: CommonValidationSchemas.userNameValidationSchema,
            designation: z.string(),
            gender: z.enum(["Male", "Female", "Other"]),
            dateOfBirth: z.string().optional(),
            email: z.string().email(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z
                .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
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
            name: CommonValidationSchemas.updateUserNameValidationSchema,
            designation: z.string().optional(),
            gender: z.enum(["Male", "Female", "Other"]).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z
                .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
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
