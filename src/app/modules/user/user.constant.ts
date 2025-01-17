export const USER_ROLE = {
    student: "student",
    faculty: "faculty",
    admin: "admin",
    superAdmin: "superAdmin",
} as const;
export const userRoleArray = Object.values(USER_ROLE);

export const USER_STATUS = {
    active: "active",
    blocked: "blocked",
} as const;
export const userStatusArray = Object.values(USER_STATUS);

export const GENDER_TYPES = {
    male: "male",
    female: "female",
    other: "other",
} as const;
export const genderTypesArray = Object.values(GENDER_TYPES);
export const genderTypesErrorMessage = `Allowed gender types are ${genderTypesArray.join(", ")}`;

export const BLOOD_GROUPS = {
    "A+": "A+",
    "B+": "B+",
    "O+": "O+",
    "AB+": "AB+",
    "A-": "A-",
    "B-": "B-",
    "O-": "O-",
    "AB-": "AB-",
} as const;
export const bloodGroupArray = Object.values(BLOOD_GROUPS);
