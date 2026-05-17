import { Link } from "react-router";
import styled from "styled-components";
import { FiSun, FiMoon, FiUser, FiSettings } from "react-icons/fi";
import { IoChatbubbles } from "react-icons/io5";
import Button from "../../common/button/Button";
import { useThemeStore } from "../../../stores/theme/ThemeStore.ts";
import { useAuthStore } from "../../../stores/auth/AuthStore.ts";
import { Role } from "../../../types/user.type.ts";

function MainHeader() {
    const { theme, onChangeTheme } = useThemeStore();
    const { user, isLoggedIn, logout } = useAuthStore();

    return (
        <HeaderContainer>
            <HeaderInner>
                {/* 1. 로고 영역 */}
                <Logo to="/">
                    <IoChatbubbles size={28} />
                    <span>토론대난투</span>
                </Logo>

                {/* 2. 네비게이션 및 우측 메뉴 영역 */}
                <NavGroup>
                    {/* 다크모드 토글 버튼 */}
                    <Button
                        color={"primary"}
                        variant={"icon"}
                        onClick={onChangeTheme}
                        aria-label="테마 변경">
                        {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
                    </Button>

                    {/* 로그인 상태에 따른 버튼 분기 */}
                    {isLoggedIn ? (
                        <>
                            <Button color="primary" variant={"icon"} as={Link} to={"/profile"}>
                                <FiUser size={20} />
                            </Button>
                            {user?.role === Role.ADMIN && (
                                <Button color="primary" variant={"icon"} as={Link} to={"/admin"}>
                                    <FiSettings size={20} />
                                </Button>
                            )}
                            <Button color={"error"} variant={"contained"} onClick={logout}>
                                로그아웃
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color={"primary"}
                                variant={"text"}
                                as={Link}
                                to={"/auth/signin"}>
                                로그인
                            </Button>
                            <Button
                                color={"primary"}
                                variant={"contained"}
                                as={Link}
                                to={"/auth/signup"}>
                                회원가입
                            </Button>
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
    display: flex;
    align-items: center;
    gap: 8px; /* 아이콘과 글자 사이의 간격 */
    font-size: 24px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    letter-spacing: -0.5px;

    /* 아이콘 색상도 로고 글자색과 동일하게 맞춥니다 */
    svg {
        color: inherit;
    }
`;

const NavGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;
