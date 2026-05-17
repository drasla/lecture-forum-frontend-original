import { createBrowserRouter, redirect } from "react-router";
import MainLayout from "../layouts/MainLayout.tsx";
import HomePage from "../pages/HomePage.tsx";
import SignUpPage from "../pages/auth/signUp/SignUpPage.tsx";
import SignInPage from "../pages/auth/signIn/SignInPage.tsx";
import { useAuthStore } from "../stores/auth/AuthStore.ts";
import { Role } from "../types/user.type.ts";
import AdminLayout from "../layouts/AdminLayout.tsx";

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
                element: <div>카테고리 관리 페이지가 들어올 자리입니다.</div>,
            },
            // 추가될 어드민 페이지들...
        ],
    },
]);

export default router;
