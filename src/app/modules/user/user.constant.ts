export const USER_ROLE = {
    Student: "Student",
    Faculty: "Faculty",
    Admin: "Admin",
    SuperAdmin: "SuperAdmin",
} as const;
export const userRoleArray = Object.values(USER_ROLE);

export const USER_STATUS = {
    Active: "Active",
    Blocked: "Blocked",
} as const;
export const userStatusArray = Object.values(USER_STATUS);

export const GENDER_TYPES = {
    Male: "Male",
    Female: "Female",
    Other: "Other",
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
