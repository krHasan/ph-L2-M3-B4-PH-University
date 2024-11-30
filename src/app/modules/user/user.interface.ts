export type TUser = {
    id: string;
    password: string;
    needsPasswordChange: boolean;
    role: "Admin" | "Student" | "Faculty";
    status: "in-progress" | "blocked" | "active";
    isDeleted: boolean;
};
