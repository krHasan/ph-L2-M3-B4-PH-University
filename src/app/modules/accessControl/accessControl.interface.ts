import { TUserRole } from "../user/user.interface";
import { HTTP_METHODS } from "./accessControl.constant";

export type THttpMethod = keyof typeof HTTP_METHODS;

export type TAccessControl = {
    method: THttpMethod;
    url: string;
    roles: TUserRole[];
};
