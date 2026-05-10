import { Link, useNavigate } from "react-router"; // react-router-dom v6+ 최신 문법
import styled from "styled-components";
import { FiSun, FiMoon, FiUser } from "react-icons/fi"; // react-icons
// import { useAuthStore } from "../../../store/useAuthStore";
// import { useThemeStore } from "../../../store/useThemeStore";

function MainHeader() {
    const navigate = useNavigate();

    // TODO: Zustand 스토어 연동 (지금은 임시 상태로 둡니다)
    const isLogin = false;
    const themeMode = "light";
    const toggleTheme = () => console.log("테마 변경");
    // const logout = () => console.log("로그아웃");

    return (
        <HeaderContainer>
            <HeaderInner>
                {/* 1. 로고 영역 */}
                <Logo to="/">토론대난투</Logo>

                {/* 2. 네비게이션 및 우측 메뉴 영역 */}
                <NavGroup>
                    {/* 다크모드 토글 버튼 */}
                    <IconButton onClick={toggleTheme} aria-label="테마 변경">
                        {themeMode === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
                    </IconButton>

                    {/* 로그인 상태에 따른 버튼 분기 */}
                    {isLogin ? (
                        <>
                            <IconButton as={Link} to="/profile" aria-label="내 정보">
                                <FiUser size={20} />
                            </IconButton>
                            {/*<TextButton onClick={logout}>로그아웃</TextButton>*/}
                        </>
                    ) : (
                        <>
                            <TextButton as={Link} to="/auth/signIn">
                                로그인
                            </TextButton>
                            <PrimaryButton onClick={() => navigate("/auth/signUp")}>
                                회원가입
                            </PrimaryButton>
                        </>
                    )}
                </NavGroup>
            </HeaderInner>
        </HeaderContainer>
    );
}

export default MainHeader;

// --- Styled Components ---

const HeaderContainer = styled.header`
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    height: 64px;
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};

    /* 약간의 투명도와 블러 효과를 주면 최신 트렌드에 맞게 예뻐집니다 */
    background-color: ${({ theme }) => theme.colors.background.paper}CC;
    backdrop-filter: blur(8px);
`;

const HeaderInner = styled.div`
    max-width: 1000px; /* 토론 사이트에 맞는 적절한 최대 너비 */
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Logo = styled(Link)`
    font-size: 24px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    letter-spacing: -0.5px;
`;

const NavGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const IconButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;
    color: ${({ theme }) => theme.colors.text.default};
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.background.default};
    }
`;

const TextButton = styled(Link)`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.default};
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.background.default};
    }
`;

const PrimaryButton = styled.button`
    font-size: 14px;
    font-weight: 600;
    color: #ffffff; /* 버튼 글자는 무조건 흰색 */
    background-color: ${({ theme }) => theme.colors.primary};
    padding: 8px 16px;
    border-radius: 8px;
    transition:
        background-color 0.2s ease,
        transform 0.1s ease;

    &:hover {
        /* CSS filter를 쓰면 테마 색상을 유지하면서 살짝 어둡게 만들기 편합니다 */
        filter: brightness(0.9);
    }

    &:active {
        transform: scale(0.98);
    }
`;
