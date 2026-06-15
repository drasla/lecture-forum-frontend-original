import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/theme.ts";
import { RouterProvider } from "react-router";
import { useThemeStore } from "./stores/theme/themeStore.ts";
import GetRouter from "./router/GetRouter.tsx";
import { GlobalStyle } from "./styles/GlobalStyle.tsx";
import { AuthProvider } from "./providers/auth/AuthProvider.tsx";

function App() {
    const { theme } = useThemeStore();

    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            <GlobalStyle />
            <AuthProvider>
                <RouterProvider router={GetRouter} />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
