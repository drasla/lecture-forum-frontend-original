import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            background: {
                default: string; // 앱의 가장 밑바탕 배경색
                paper: string; // 사이드바, 카드, 모달 등 떠 있는 요소의 배경색
            };
            text: {
                default: string; // 기본 글자색
                disabled: string; // 비활성화되거나 덜 중요한 보조 글자색
            };
            divider: string; // 선, 테두리, 구분선 색상
            primary: string; // 앱의 메인 브랜드 컬러
            secondary: string; // 보조 포인트 컬러
            success: string; // 성공 또는 긍정적인 상황을 나타내는 컬러
            error: string; // 오류 또는 부정적인 상황을 나타내는 컬러
            warning: string; // 경고 또는 주의를 나타내는 컬러
            info: string; // 정보 또는 참고를 나타내는 컬러
        };
    }
}
