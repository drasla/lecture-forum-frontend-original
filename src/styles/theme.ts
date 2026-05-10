import type { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
    colors: {
        background: {
            default: "#F3F4F6", // 앱 전체의 약간 시원한 회색 배경
            paper: "#FFFFFF", // 헤더, 토론 카드, 모달 등 떠 있는 요소 (순백색)
        },
        text: {
            default: "#1F2937", // 너무 쨍하지 않은 진한 회색 (가독성 최적화)
            disabled: "#9CA3AF", // 부가 정보나 비활성화된 버튼 텍스트
        },
        divider: "#E5E7EB", // 연한 회색 구분선
        primary: "#2563EB", // 메인 브랜드 컬러 (신뢰감 있는 파란색)
        secondary: "#4B5563", // 보조 컬러 (진회색)
        success: "#10B981", // 성공 (초록색 - 알림 등에 사용)
        error: "#EF4444", // 에러 (빨간색 - 주로 '반대' 의견이나 폼 에러에 사용)
        warning: "#F59E0B", // 경고 (주황색)
        info: "#3B82F6", // 정보 (파란색)
    },
};

export const darkTheme: DefaultTheme = {
    colors: {
        background: {
            default: "#111827", // 아주 어두운 남색/회색 계열
            paper: "#1F2937", // 배경보다 살짝 밝은 카드 배경
        },
        text: {
            default: "#F9FAFB", // 거의 흰색에 가까운 밝은 회색
            disabled: "#6B7280", // 다크모드용 비활성 텍스트
        },
        divider: "#374151", // 다크모드용 구분선
        primary: "#3B82F6", // 파란색 (어두운 배경에서 더 잘 보이게 살짝 밝게)
        secondary: "#9CA3AF",
        success: "#34D399",
        error: "#F87171", // 빨간색 명도 조절 (눈부심 방지)
        warning: "#FBBF24",
        info: "#60A5FA",
    },
};