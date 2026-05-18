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
    {
        path: "/admin",
        element: <AdminLayout />, // 💡 관리자용 전용 레이아웃
        loader: adminLoader, // 💡 여기서 권한이 없으면 튕겨냅니다
        children: [
            {
                // /admin으로 들어왔을 때 기본으로 보여줄 화면 (예: 카테고리로 바로 리다이렉트)
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
