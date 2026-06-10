import { Link, useLocation } from "react-router";
import styled from "styled-components";
import {
    FiUser,
    FiMessageSquare,
    FiFileText,
    FiMessageCircle,
    FiArrowLeft,
    FiLock,
} from "react-icons/fi";

const myNavList = [
    {
        id: "profile",
        path: "/my/profile",
        label: "회원정보 수정",
        icon: <FiUser size={18} />,
    },
    {
        id: "password",
        path: "/my/password",
        label: "비밀번호 변경",
        icon: <FiLock size={18} />,
    },
    {
        id: "inquiry",
        path: "/my/inquiry",
        label: "1:1 문의 내역",
        icon: <FiMessageSquare size={18} />,
    },
    {
        id: "posts",
        path: "/my/posts",
        label: "내가 쓴 글",
        icon: <FiFileText size={18} />,
    },
    {
        id: "replies",
        path: "/my/replies",
        label: "내가 쓴 댓글",
        icon: <FiMessageCircle size={18} />,
    },
];

function MyAside() {
    const location = useLocation();

    return (
        <MySidebar>
            <SidebarHeader to="/my">마이페이지</SidebarHeader>
            <SidebarMenu>
                {myNavList.map(nav => {
                    const isActive = location.pathname.startsWith(nav.path);

                    return (
                        <MenuItem key={nav.id} to={nav.path} $isActive={isActive}>
                            {nav.icon}
                            {nav.label}
                        </MenuItem>
                    );
                })}
            </SidebarMenu>

            {/* 메인 서비스로 돌아가기 버튼을 하단에 분리하여 배치 */}
            <BackToService to="/">
                <FiArrowLeft size={18} />
                서비스로 돌아가기
            </BackToService>
        </MySidebar>
    );
}

export default MyAside;

// --- Styled Components ---

const MySidebar = styled.aside`
    width: 240px;
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-right: 1px solid ${({ theme }) => theme.colors.divider};
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* 화면 전체 높이 사용 */
`;

const SidebarHeader = styled(Link)`
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    font-size: 20px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const SidebarMenu = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    gap: 4px;
    flex: 1; /* 남은 공간을 모두 차지하도록 하여 하단 버튼을 아래로 밀어냄 */
`;

const MenuItem = styled(Link)<{ $isActive?: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 24px;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s;

    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.secondary)};
    background-color: ${({ theme, $isActive }) =>
        $isActive ? `${theme.colors.primary}10` : "transparent"};
    border-left: 3px solid
        ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : "transparent")};

    &:hover {
        background-color: ${({ theme }) => theme.colors.background.default};
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const BackToService = styled(Link)`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.secondary};
    border-top: 1px solid ${({ theme }) => theme.colors.divider};
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;
