import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout.tsx";
import HomePage from "../pages/HomePage.tsx";
import SignUpPage from "../pages/auth/signUp/SignUpPage.tsx";
import SignInPage from "../pages/auth/signIn/SignInPage.tsx";

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        path: "/",
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "auth",
                children: [
                    { path: "signUp", element: <SignUpPage /> },
                    { path: "signIn", element: <SignInPage /> },
                ],
            },
        ],
    },
]);

export default router;
