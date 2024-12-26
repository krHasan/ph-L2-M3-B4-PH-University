import QueryBuilder from "../../builder/QueryBuilder";
import { TAccessControl } from "./accessControl.interface";
import { AccessControl } from "./accessControl.model";

const addANewAccessControlIntoDB = async (payload: TAccessControl) => {
    const result = await AccessControl.create(payload);
    return result;
};

const getRolesByMethodAndUrl = async (method: string, url: string) => {
    const result = await AccessControl.findOne({ method, url });
    if (result) {
        return result.roles;
    } else {
        return [];
    }
};

const getAllAccessControlsFromDB = async (query: Record<string, unknown>) => {
    const accessControlQuery = new QueryBuilder(AccessControl.find(), query)
        .search(["url"])
        .fields()
        .filter()
        .paginate()
        .sort();

    const result = await accessControlQuery.modelQuery;
    const meta = await accessControlQuery.getMetaData();

    return {
        meta,
        result,
    };
};

export const AccessControlServices = {
    addANewAccessControlIntoDB,
    getRolesByMethodAndUrl,
    getAllAccessControlsFromDB,
};
