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
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    username: string;
    name: string;
    nickname: string;
    email: string;
    phoneNumber?: string;
    birthdate?: string | null;
    gender: GenderType;
    role: RoleType;
}
