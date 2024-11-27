import config from "../../config";
import { TStudent } from "../student/student.interface";
import { NewUser } from "./user.interface";
import { User } from "./user.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
    const user: NewUser = {
        id: "",
        password: "",
        role: "",
    };

    user.password = password || (config.default_password as string);
    user.role = "Student";

    //set manually generated id
    user.id = "2023100001";

    const result = await User.create(user);

    if (Object.keys(result).length) {
        studentData.id = result.id;
        studentData.user = result._id;
    }
    return result;
};

export const UserServices = {
    createStudentIntoDB,
};
