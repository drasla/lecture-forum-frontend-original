import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GenderType, RoleType } from "../../types/user.type.ts";

export interface User {
    id: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    username: string | null;
    name: string | null;
    nickname: string | null;
    email: string | null;
    phoneNumber: string | null;
    birthdate: Date | null;
    gender: GenderType | null;
    role: RoleType | null;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;

    login: (user: User, token: string) => void;
    logout: VoidFunction;
}

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            isLoggedIn: false,
            user: null,
            token: null,

            login: (user, token) => set({ isLoggedIn: true, user, token }),

            logout: () => set({ isLoggedIn: false, user: null, token: null }),
        }),
        {
            name: "auth-storage",
        },
    ),
);
