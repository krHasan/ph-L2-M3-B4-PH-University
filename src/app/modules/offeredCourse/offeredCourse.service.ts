import QueryBuilder from "../../builder/QueryBuilder";
import { httpStatus } from "../../config/httpStatus";
import AppError from "../../errors/AppError";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { RegistrationStatusName } from "../semesterRegistration/semesterRegistration.constant";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { Student } from "../student/student.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { hasTimeConflict } from "./offeredCourse.utils";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        academicFaculty,
        academicDepartment,
        semesterRegistration,
        course,
        faculty,
        section,
        days,
        startTime,
        endTime,
    } = payload;

    /* Academic Faculty and Department validations*/
    const isAcademicFacultyExist =
        await AcademicFaculty.findById(academicFaculty);

    if (!isAcademicFacultyExist) {
        throw new AppError(404, "Academic faculty not found");
    }

    const isAcademicDepartmentExist =
        await AcademicDepartment.findById(academicDepartment);

    if (!isAcademicDepartmentExist) {
        throw new AppError(404, "Academic department not found");
    }

    const isDepartmentBelongsToFaculty = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });

    if (!isDepartmentBelongsToFaculty) {
        throw new AppError(
            400,
            `The ${isAcademicDepartmentExist.name} is not belongs to ${isAcademicFacultyExist.name}`,
        );
    }

    /* Academic Semester and Registration related validations */
    const isSemesterRegistrationExist =
        await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExist) {
        throw new AppError(404, "Semester Registration not found");
    }

    const academicSemester = isSemesterRegistrationExist.academicSemester;

    /* Course and Faculty related validations */
    const isCourseExist = await Course.findById(course);

    if (!isCourseExist) {
        throw new AppError(404, "Course not found");
    }

    const isFacultyExist = await Faculty.findById(faculty);

    if (!isFacultyExist) {
        throw new AppError(404, "Faulty not found");
    }

    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select("days startTime endTime");

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            409,
            "This faculty is not available at that time! Choose other time or date",
        );
    }

    /* Section related validations */
    const isSectionIsExists = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section,
    });

    if (isSectionIsExists) {
        throw new AppError(
            400,
            "Offered course with same section is already exists",
        );
    }

    const result = await OfferedCourse.create({ ...payload, academicSemester });
    return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCoursesQuery = new QueryBuilder(
        OfferedCourse.find()
            .populate({
                path: "semesterRegistration",
                populate: {
                    path: "academicSemester",
                },
            })
            .populate("academicSemester")
            .populate("academicFaculty")
            .populate({
                path: "academicDepartment",
                populate: {
                    path: "academicFaculty",
                },
            })
            .populate("course")
            .populate("faculty"),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await offeredCoursesQuery.modelQuery;
    const meta = await offeredCoursesQuery.getMetaData();
    return { meta, result };
};

const getMyOfferedCoursesFromDB = async (
    userId: string,
    query: Record<string, unknown>,
) => {
    //pagination setup
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ id: userId });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, "Student not found");
    }

    //find current ongoing semester registration
    const currentOngoingRegistrationSemester =
        await SemesterRegistration.findOne({
            status: RegistrationStatusName.ONGOING,
        });

    if (!currentOngoingRegistrationSemester) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Current ongoing semester registration not found",
        );
    }

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester?._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            },
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "course",
            },
        },
        {
            $unwind: "$course",
        },
        {
            $lookup: {
                from: "enrolledcourses",
                let: {
                    currentOngoingRegistrationSemester:
                        currentOngoingRegistrationSemester?._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$semesterRegistration",
                                            "$$currentOngoingRegistrationSemester",
                                        ],
                                    },
                                    {
                                        $eq: ["$student", "$$currentStudent"],
                                    },
                                    {
                                        $eq: ["$isEnrolled", true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: "enrolledCourses",
            },
        },
        {
            $lookup: {
                from: "enrolledcourses",
                let: {
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$student", "$$currentStudent"],
                                    },
                                    {
                                        $eq: ["$isCompleted", true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: "completedCourses",
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: "$completedCourses",
                        as: "completed",
                        in: "$$completed.course",
                    },
                },
            },
        },
        {
            $addFields: {
                isPrerequisitesFulfilled: {
                    $or: [
                        { $eq: ["$course.preRequisiteCourses", []] },
                        {
                            $setIsSubset: [
                                "$course.preRequisiteCourses.course",
                                "$completedCourseIds",
                            ],
                        },
                    ],
                },
                isAlreadyEnrolled: {
                    $in: [
                        "$course._id",
                        {
                            $map: {
                                input: "$enrolledCourses",
                                as: "enroll",
                                in: "$$enroll.course",
                            },
                        },
                    ],
                },
            },
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPrerequisitesFulfilled: true,
            },
        },
    ];

    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];

    const result = await OfferedCourse.aggregate([
        ...aggregationQuery,
        ...paginationQuery,
    ]);

    const total = (await OfferedCourse.aggregate(aggregationQuery))?.length;
    const totalPage = Math.ceil(result.length / limit);

    return {
        meta: { page, limit, total, totalPage },
        result,
    };
};

const getOfferedCourseByIdFromDB = async (id: string) => {
    return await OfferedCourse.findById(id)
        .populate({
            path: "semesterRegistration",
            populate: {
                path: "academicSemester",
            },
        })
        .populate("academicSemester")
        .populate("academicFaculty")
        .populate({
            path: "academicDepartment",
            populate: {
                path: "academicFaculty",
            },
        })
        .populate("course")
        .populate("faculty");
};

const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">,
) => {
    const { faculty, days, startTime, endTime } = payload;

    const isOfferedCourseExists = await OfferedCourse.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(404, "Offered course not found");
    }

    const isFacultyExist = await Faculty.findById(faculty);

    if (!isFacultyExist) {
        throw new AppError(404, "Faculty not found");
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration);

    if (
        semesterRegistrationStatus?.status !== RegistrationStatusName.UPCOMING
    ) {
        throw new AppError(
            400,
            `You can't update this offered course as it is ${semesterRegistrationStatus?.status}`,
        );
    }

    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select("days startTime endTime");

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            409,
            "This faculty is not available at that time! Choose other time or date",
        );
    }

    const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
    const offeredCourseToBeDeleted = await OfferedCourse.findById(id);
    if (!offeredCourseToBeDeleted) {
        throw new AppError(404, "Offered Course not found");
    }
    const semesterRegistration = await SemesterRegistration.findById(
        offeredCourseToBeDeleted?.semesterRegistration,
    ).select("status");
    if (semesterRegistration?.status !== RegistrationStatusName.UPCOMING) {
        throw new AppError(
            400,
            `You can't delete this offered course as the semester registration status for this course is ${semesterRegistration?.status}`,
        );
    }

    return await OfferedCourse.findByIdAndDelete(id);
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getMyOfferedCoursesFromDB,
    getOfferedCourseByIdFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
};
