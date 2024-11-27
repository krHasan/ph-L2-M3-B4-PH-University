import { Student } from "./student.model";

const getAllStudentsFromDB = async () => {
    const result = await Student.find();
    return result;
};

const getStudentByIdFromDB = async (id: string) => {
    // const result = await Student.findOne({ id });
    const result = await Student.aggregate([{ $match: { id: id } }]);
    return result;
};

const deleteStudentByIdFromDB = async (id: string) => {
    const result = await Student.updateOne({ id }, { isDeleted: true });
    return result;
};

export const StudentServices = {
    getAllStudentsFromDB,
    getStudentByIdFromDB,
    deleteStudentByIdFromDB,
};
