import { type PropsWithChildren, useEffect, useState } from "react";
import userApi from "../../api/user/userApi.ts";
import { useAuthStore } from "../../stores/auth/authStore.ts";

type Props = PropsWithChildren;

export function AuthProvider({ children }: Props) {
    const { isLoggedIn, token, logout } = useAuthStore();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const checkAuthValidity = async () => {
            // 💡 스토어상 로그인 상태이고 토큰이 존재할 때만 백엔드 검증 유무 판별
            if (isLoggedIn && token) {
                try {
                    // 백엔드의 보호된 라우터 중 '내 프로필 조회' 엔드포인트를 찔러 토큰 무결성 검사
                    await userApi.getMyProfile();
                } catch (error) {
                    console.error("인증 토큰 유효성 검증 실패:", error);

                    // 💡 401 Unauthorized 등 에러가 발생하면 가차없이 로그아웃 처리 (스토어 + 스토리지 청소)
                    logout();
                    alert("로그인 세션이 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.");
                }
            }

            // 검증 프로세스 완료 표기 (로그인이 안 되어 있는 게스트 유저도 이 라인을 통과함)
            setIsInitialized(true);
        };

        checkAuthValidity().then(() => {});
    }, [isLoggedIn, token, logout]);

    // 최초 1회 토큰 판독이 완료되기 전까지는 빈 화면(혹은 스피너)을 보여주어 화면 깜빡임 차단
    if (!isInitialized) {
        return null;
    }

    return <>{children}</>;
}
