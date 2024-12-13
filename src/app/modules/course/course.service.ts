import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import AppError from "../../errors/AppError";

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(
        Course.find().populate("preRequisiteCourses.course"),
        query,
    )
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await courseQuery.modelQuery;
    return result;
};

const getCourseByIdFromDB = async (id: string) => {
    const result = await Course.findById(id).populate(
        "preRequisiteCourses.course",
    );
    return result;
};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //basic course info update
        await Course.findByIdAndUpdate(id, courseRemainingData, {
            new: true,
            runValidators: true,
            session,
        });

        //check if there is any pre requisite courses
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            //filter out the deleted course
            const courseToBeDeleted = preRequisiteCourses
                .filter((el) => el.course && el.isDeleted)
                .map((el) => el.course);

            await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: {
                            course: { $in: courseToBeDeleted },
                        },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            );

            //filter out the new courses
            const newCoursesToBeAdded = preRequisiteCourses.filter(
                (el) => el.course && !el.isDeleted,
            );

            await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        preRequisiteCourses: { $each: newCoursesToBeAdded },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            );
        }

        await session.commitTransaction();
        await session.endSession();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(500, error);
    }

    return await Course.findById(id).populate("preRequisiteCourses.course");
};

const assignFacultiesWithCourseIntoDB = async (
    id: string,
    payload: Partial<TCourseFaculty>,
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } },
        },
        {
            upsert: true,
            new: true,
        },
    );

    return result;
};

const removeFacultiesWithCourseIntoDB = async (
    id: string,
    payload: Partial<TCourseFaculty>,
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: { faculties: { $in: payload } },
        },
        {
            new: true,
        },
    );

    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getCourseByIdFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesWithCourseIntoDB,
};
