import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import {
    academicSemesterNameCodeMapper,
    AcademicSemesterSearchableFields,
} from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(
            406,
            "Academic semester name and code is mismatched",
        );
    }

    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcademicSemester = async (query: Record<string, unknown>) => {
    const academicSemesterQuery = new QueryBuilder(
        AcademicSemester.find(),
        query,
    )
        .search(AcademicSemesterSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await academicSemesterQuery.modelQuery;
    const meta = await academicSemesterQuery.getMetaData();

    return {
        meta,
        result,
    };
};

const getAcademicSemesterById = async (id: string) => {
    return await AcademicSemester.findById(id);
};

const updateAcademicSemesterIntoDB = async (
    id: string,
    payload: Partial<TAcademicSemester>,
) => {
    if (
        payload.name &&
        payload.code &&
        academicSemesterNameCodeMapper[payload.name] !== payload.code
    ) {
        throw new AppError(404, "Invalid Semester Code");
    }

    const result = await AcademicSemester.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
        },
    );
    return result;
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemester,
    getAcademicSemesterById,
    updateAcademicSemesterIntoDB,
};
