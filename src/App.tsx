import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/theme.ts";
import { GlobalStyle } from "./styles/GlobalStyle.ts";
import { RouterProvider } from "react-router";
import GetRouter from "./router/getRouter.tsx";

function App() {
    const themeMode = "light";

    return (
        <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
            <GlobalStyle />
            <RouterProvider router={GetRouter} />
        </ThemeProvider>
    );
}

export default App;
