export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
} as const;

export type GenderType = (typeof Gender)[keyof typeof Gender];

export const Role = {
    USER: "USER",
    ADMIN: "ADMIN",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];