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

export interface User {
    id: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt?: Date | null;
    username: string | null;
    name: string | null;
    nickname: string | null;
    email: string | null;
    phoneNumber: string | null;
    birthdate: Date | null;
    gender: GenderType | null;
    role: RoleType | null;
}