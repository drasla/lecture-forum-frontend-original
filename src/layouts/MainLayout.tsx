import { Outlet } from "react-router";
import MainHeader from "../components/layout/main/MainHeader.tsx";
import MainFooter from "../components/layout/main/MainFooter.tsx";
import styled from "styled-components";

const LayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* 화면의 최소 높이를 100vh로 잡아줍니다 */
`;

const MainContainer = styled.main`
    flex: 1; /* 💡 핵심! 남은 세로 공간을 모두 차지하게 해서 푸터를 맨 아래로 밀어냅니다. */
    width: 100%;
    max-width: 1000px; /* 헤더의 HeaderInner와 동일한 너비로 맞춰줍니다 */
    margin: 0 auto; /* 화면 가운데 정렬 */
    padding: 40px 20px; /* 모바일 환경을 고려해 좌우 패딩을 주고, 위아래 여백을 줍니다 */
`;

function MainLayout() {
    return (
        <LayoutWrapper>
            <MainHeader />
            <MainContainer>
                <Outlet />
            </MainContainer>
            <MainFooter />
        </LayoutWrapper>
    );
}

export default MainLayout;
