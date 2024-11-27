import { Request, Response } from "express";
import { StudentServices } from "./student.service";

const getAllStudents = async (req: Request, res: Response) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB();
        res.status(200).json({
            success: true,
            message: "Students list",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};

const getStudentById = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId;
        const result = await StudentServices.getStudentByIdFromDB(studentId);
        res.status(200).json({
            success: true,
            message: "Student Information",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};

const deleteStudentById = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId;
        const result = await StudentServices.deleteStudentByIdFromDB(studentId);
        res.status(200).json({
            success: true,
            message: "Student Deleted",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};

export const StudentControllers = {
    getAllStudents,
    getStudentById,
    deleteStudentById,
};
