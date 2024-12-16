/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { SemesterRegistration } from "./semesterRegistration.model";
import { RegistrationStatusName } from "./semesterRegistration.constant";

const createSemesterRegistrationIntoDB = async (
    payload: TSemesterRegistration,
) => {
    const academicSemester = payload?.academicSemester;
    const isAcademicSemesterExists =
        await AcademicSemester.findById(academicSemester);

    if (!isAcademicSemesterExists) {
        throw new AppError(404, "This academic semester is not found");
    }

    const isThereAnyUpcomingOrOngoingSemester =
        await SemesterRegistration.findOne({
            $or: [
                { status: RegistrationStatusName.UPCOMING },
                { status: RegistrationStatusName.ONGOING },
            ],
        });

    console.log(isThereAnyUpcomingOrOngoingSemester);
    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(
            404,
            `There is already a ${isThereAnyUpcomingOrOngoingSemester?.status} registered semester`,
        );
    }

    const isSemesterRegisterExists = await SemesterRegistration.findOne({
        academicSemester,
    });

    if (isSemesterRegisterExists) {
        throw new AppError(409, "This academic semester is already registered");
    }

    const result = await SemesterRegistration.create(payload);
    return result;
};

const getAllSemesterRegistrationFromDB = async (
    query: Record<string, unknown>,
) => {
    const semesterRegistrationQuery = new QueryBuilder(
        SemesterRegistration.find().populate("academicSemester"),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await semesterRegistrationQuery.modelQuery;

    return result;
};

const getSemesterRegistrationByIdFromDB = async (id: string) => {
    return await SemesterRegistration.findById(id).populate("academicSemester");
};

const updateSemesterRegistrationIntoDB = async (
    id: string,
    payload: Partial<TSemesterRegistration>,
) => {
    const requestedSemester = await SemesterRegistration.findById(id);
    const requestedSemesterStatus = requestedSemester?.status;
    const payloadSemesterStatus = payload?.status;

    if (!requestedSemester) {
        throw new AppError(404, "Semester is not found");
    }

    if (requestedSemesterStatus === RegistrationStatusName.ENDED) {
        throw new AppError(
            403,
            `This semester is already ${RegistrationStatusName.ENDED}`,
        );
    }

    if (
        requestedSemesterStatus === RegistrationStatusName.UPCOMING &&
        payloadSemesterStatus === RegistrationStatusName.ENDED
    ) {
        throw new AppError(
            400,
            `You can't directly change from ${requestedSemesterStatus} to ${payloadSemesterStatus}`,
        );
    }

    if (
        requestedSemesterStatus === RegistrationStatusName.ONGOING &&
        payloadSemesterStatus === RegistrationStatusName.UPCOMING
    ) {
        throw new AppError(
            400,
            `You can't directly change from ${requestedSemesterStatus} to ${payloadSemesterStatus}`,
        );
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSemesterRegistrationByIdFromDB,
    updateSemesterRegistrationIntoDB,
};
