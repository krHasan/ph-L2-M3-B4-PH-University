import { model, Schema } from "mongoose";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { semesterRegistrationStatus } from "./semesterRegistration.constant";

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
    {
        academicSemester: {
            type: Schema.Types.ObjectId,
            ref: "AcademicSemester",
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: semesterRegistrationStatus,
            default: "UPCOMING",
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        minCredit: { type: Number, default: 3 },
        maxCredit: { type: Number, default: 16 },
    },
    {
        timestamps: true,
    },
);

export const SemesterRegistration = model<TSemesterRegistration>(
    "SemesterRegistration",
    semesterRegistrationSchema,
);
