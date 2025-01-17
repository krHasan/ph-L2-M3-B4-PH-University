/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { httpStatus } from "../../config/httpStatus";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { Student } from "../student/student.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import EnrolledCourse from "./enrolledCourse.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { calculateGradeAndPoints } from "./enrolledCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";

const createEnrolledCourseIntoDB = async (
    userId: string,
    payload: TEnrolledCourse,
) => {
    //check if the offered courses is exists
    const { offeredCourse } = payload;
    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course not found");
    }
    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_GATEWAY, "Room is full!");
    }

    const course = await Course.findById(isOfferedCourseExists.course);
    const currentCredit = course?.credits;

    //check if the student is already enrolled
    const student = await Student.findOne({ id: userId }, { _id: 1 });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, "Student not found");
    }

    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        offeredCourse,
        student: student._id,
    });

    if (isStudentAlreadyEnrolled) {
        throw new AppError(httpStatus.CONFLICT, "Student is already enrolled");
    }

    //check total credits exceeds maxCredit
    const semesterRegistration = await SemesterRegistration.findById(
        isOfferedCourseExists.semesterRegistration,
        { maxCredit: 1 },
    );
    const maxCredit = semesterRegistration?.maxCredit;

    const enrolledCourses = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration:
                    isOfferedCourseExists.semesterRegistration,
                student: student._id,
            },
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "enrolledCourseData",
            },
        },
        {
            $unwind: "$enrolledCourseData",
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: "$enrolledCourseData.credits" },
            },
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1,
            },
        },
    ]);

    //total enrolled credits + new enrolled course credit > maxCredit
    const totalCredits =
        enrolledCourses.length > 0
            ? enrolledCourses[0].totalEnrolledCredits
            : 0;

    if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You have exceeded maximum number of credits",
        );
    }

    //Create an enrolled course
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const result = await EnrolledCourse.create(
            [
                {
                    semesterRegistration:
                        isOfferedCourseExists.semesterRegistration,
                    academicSemester: isOfferedCourseExists.academicSemester,
                    academicFaculty: isOfferedCourseExists.academicFaculty,
                    academicDepartment:
                        isOfferedCourseExists.academicDepartment,
                    offeredCourse: offeredCourse,
                    course: isOfferedCourseExists.course,
                    student: student._id,
                    faculty: isOfferedCourseExists.faculty,
                    isEnrolled: true,
                },
            ],
            { session },
        );

        if (!result) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Failed to enrolled in this course",
            );
        }

        const maxCapacity = isOfferedCourseExists.maxCapacity;
        await OfferedCourse.findByIdAndUpdate(
            offeredCourse,
            {
                maxCapacity: maxCapacity - 1,
            },
            { session },
        );

        await session.commitTransaction();
        await session.endSession();

        return result;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(400, error.message);
    }
};

const getMyEnrolledCoursesFromDB = async (
    studentId: string,
    query: Record<string, unknown>,
) => {
    const student = await Student.findOne({ id: studentId });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, "Student not found");
    }

    const enrolledCourseQuery = new QueryBuilder(
        EnrolledCourse.find({ student: student._id }).populate(
            "semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty",
        ),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await enrolledCourseQuery.modelQuery;
    const meta = await enrolledCourseQuery.getMetaData();
    return {
        meta,
        result,
    };
};

const updateEnrolledCourseMarksIntoDB = async (
    facultyId: string,
    payload: Partial<TEnrolledCourse>,
) => {
    const { semesterRegistration, offeredCourse, student, courseMarks } =
        payload;

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course is not found");
    }

    const isSemesterRegistration =
        await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistration) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Semester registration is not found",
        );
    }

    const isStudent = await Student.findById(student);
    if (!isStudent) {
        throw new AppError(httpStatus.NOT_FOUND, "Student is not found");
    }

    const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
    if (!faculty) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty is not found");
    }

    const isThisCourseBelongsToFaculty = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty._id,
    });

    if (!isThisCourseBelongsToFaculty) {
        throw new AppError(httpStatus.FORBIDDEN, "You are forbidden");
    }

    const modifiedData: Record<string, unknown> = {
        ...courseMarks,
    };

    if (courseMarks?.finalTerm) {
        const { classTest1, classTest2, midTerm, finalTerm } = courseMarks;

        const totalMarks = classTest1 + midTerm + classTest2 + finalTerm;

        console.log(totalMarks);
        const courseResult = calculateGradeAndPoints(totalMarks);
        modifiedData.grade = courseResult.grade;
        modifiedData.gradePoints = courseResult.gradePoints;
        modifiedData.isCompleted = true;
    }

    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }

    const result = await EnrolledCourse.findByIdAndUpdate(
        isThisCourseBelongsToFaculty._id,
        modifiedData,
        { new: true },
    );
    return result;
};

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    getMyEnrolledCoursesFromDB,
    updateEnrolledCourseMarksIntoDB,
};
