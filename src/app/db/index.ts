import config from "../config";
import { USER_ROLE, USER_STATUS } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

const superUser = {
    id: "rakib.hasan",
    email: "hasanbappi@gmail.com",
    password: config.super_admin_password,
    needsPasswordChange: false,
    role: USER_ROLE.SuperAdmin,
    status: USER_STATUS.Active,
    isDeleted: false,
};

const seedSuperAdmin = async () => {
    //when database is connect, we will check is there any super user admin
    const isSuperAdminExists = await User.findOne({
        role: USER_ROLE.SuperAdmin,
    });
    if (!isSuperAdminExists) {
        await User.create(superUser);
    }
};

export default seedSuperAdmin;
