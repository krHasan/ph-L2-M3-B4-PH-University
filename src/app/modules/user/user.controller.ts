import { UserServices } from "./user.service";

const createStudent = async (req: Request, res: Response) => {
    try {
        const { password, student } = req.body;

        // const zodParsedData = studentValidationSchema.parse(student);

        const result = await UserServices.createStudentIntoDB();
        res.status(200).json({
            success: true,
            message: "Student is created successfully",
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
