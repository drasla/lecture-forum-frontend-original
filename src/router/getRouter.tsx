import { createBrowserRouter, redirect } from "react-router";
import MainLayout from "../layouts/MainLayout.tsx";
import HomePage from "../pages/HomePage.tsx";
import SignUpPage from "../pages/auth/signUp/SignUpPage.tsx";
import SignInPage from "../pages/auth/signIn/SignInPage.tsx";
import { useAuthStore } from "../stores/auth/AuthStore.ts";
import { Role } from "../types/user.type.ts";
import AdminLayout from "../layouts/AdminLayout.tsx";
import AdminCategoryListPage from "../pages/admin/category/AdminCategoryListPage.tsx";
import AdminCategoryCreatePage from "../pages/admin/category/create/AdminCategoryCreatePage.tsx";
import AdminCategoryUpdatePage from "../pages/admin/category/update/AdminCategoryUpdatePage.tsx";

const adminLoader = () => {
    const { isLoggedIn, user } = useAuthStore.getState();

    if (!isLoggedIn) {
        alert("로그인이 필요합니다.");
        return redirect("/auth/signin");
    }

    if (user?.role !== Role.ADMIN) {
        alert("관리자만 접근할 수 있는 페이지입니다.");
        return redirect("/");
    }

    return null; // 통과!
};

const guestLoader = () => {
    const { isLoggedIn } = useAuthStore.getState();

    if (isLoggedIn) {
        return redirect("/");
    }

    return null;
};

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        path: "/",
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "auth",
                loader: guestLoader,
                children: [
                    { path: "signUp", element: <SignUpPage /> },
                    { path: "signIn", element: <SignInPage /> },
                ],
            },
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        loader: adminLoader,
        children: [
            {
                index: true,
                loader: () => redirect("/admin/category"),
            },
            {
                path: "category",
                children: [
                    {
                        index: true,
                        element: <AdminCategoryListPage />,
                    },
                    {
                        path: "create",
                        element: <AdminCategoryCreatePage />,
                    },
                    {
                        path: "edit/:id",
                        element: <AdminCategoryUpdatePage />,
                    },
                ],
            },
        ],
    },
]);

export default router;
