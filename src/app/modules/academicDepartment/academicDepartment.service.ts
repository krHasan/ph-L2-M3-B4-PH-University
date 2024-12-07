import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    // const isDepartmentExists = await AcademicDepartment.findOne({
    //     name: payload.name,
    // });
    // if (isDepartmentExists)
    //     throw new Error("This department is already exists");

    const result = await AcademicDepartment.create(payload);
    return result;
};

const getAllAcademicDepartment = async () => {
    const result = await AcademicDepartment.find().populate("academicFaculty");
    return result;
};

const getAcademicDepartmentById = async (id: string) => {
    const result =
        await AcademicDepartment.findById(id).populate("academicFaculty");
    return result;
};

const updateAcademicDepartmentIntoDB = async (
    id: string,
    payload: Partial<TAcademicDepartment>,
) => {
    const result = await AcademicDepartment.findOneAndUpdate(
        {
            _id: id,
        },
        payload,
        { new: true },
    ).populate("academicFaculty");
    return result;
};

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartment,
    getAcademicDepartmentById,
    updateAcademicDepartmentIntoDB,
};
