import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../types/user.type.ts";

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
