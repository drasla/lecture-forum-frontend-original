import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeType = "light" | "dark";

interface ThemeState {
    theme: ThemeType;
    onChangeTheme: () => void;
}

// persist 미들웨어를 사용하여 localStorage에 자동 저장/불러오기 기능을 추가합니다.
export const useThemeStore = create<ThemeState>()(
    persist(
        set => ({
            theme: "light", // 기본값
            onChangeTheme: () =>
                set(state => ({ theme: state.theme === "light" ? "dark" : "light" })),
        }),
        {
            name: "theme", // localStorage에 저장될 Key 이름
        },
    ),
);
