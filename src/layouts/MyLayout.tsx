import { Outlet } from "react-router";
import styled from "styled-components";
import MyAside from "../components/layout/my/MyAside.tsx";

function MyLayout() {
    return (
        <LayoutContainer>
            {/* 좌측 마이페이지 사이드바 */}
            <MyAside />

            {/* 우측 메인 콘텐츠 영역 */}
            <ContentArea>
                <Outlet />
            </ContentArea>
        </LayoutContainer>
    );
}

export default MyLayout;

// --- Styled Components ---

const LayoutContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentArea = styled.main`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 40px;
    overflow-y: auto; /* 내용이 길어지면 우측 영역만 스크롤되도록 처리 */
`;
