import { Link } from "react-router";
import styled from "styled-components";
import { FiGrid, FiUsers, FiSettings } from "react-icons/fi";

const adminNavList = [
    {
        id: "category",
        path: "/admin/category",
        label: "카테고리 관리",
        icon: <FiGrid size={18} />,
    },
    {
        id: "user",
        path: "/admin/user",
        label: "유저 관리",
        icon: <FiUsers size={18} />,
    },
    {
        id: "home",
        path: "/",
        label: "서비스로 돌아가기",
        icon: <FiSettings size={18} />,
    },
];

function AdminAside() {
    return (
        <AdminSidebar>
            <SidebarHeader to="/admin">관리자 센터</SidebarHeader>
            <SidebarMenu>
                {adminNavList.map(nav => {
                    // 현재 경로가 메뉴의 경로를 포함하고 있는지 확인 (단, '/' 홈버튼은 예외처리)
                    const isActive = nav.path !== "/" && location.pathname.startsWith(nav.path);

                    return (
                        <MenuItem
                            key={nav.id}
                            to={nav.path}
                            $isActive={isActive} // 활성화 여부를 스타일로 넘김
                        >
                            {nav.icon}
                            {nav.label}
                        </MenuItem>
                    );
                })}
            </SidebarMenu>
        </AdminSidebar>
    );
}

export default AdminAside;

// --- Styled Components ---

const AdminSidebar = styled.aside`
    width: 260px;
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-right: 1px solid ${({ theme }) => theme.colors.divider};
    display: flex;
    flex-direction: column;
`;

const SidebarHeader = styled(Link)`
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    font-size: 20px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const SidebarMenu = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    gap: 8px;
`;

const MenuItem = styled(Link)<{ $isActive?: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s;

    /* 활성화 상태면 메인 컬러, 아니면 기본 텍스트 컬러 */
    color: ${({ theme, $isActive }) =>
        $isActive ? theme.colors.primary : theme.colors.text.default};
    background-color: ${({ theme, $isActive }) =>
        $isActive ? `${theme.colors.primary}15` : "transparent"};

    /* 왼쪽에 살짝 포인트를 주면 더 예쁩니다 */
    border-left: 4px solid
        ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : "transparent")};

    &:hover {
        background-color: ${({ theme }) => theme.colors.background.default};
        color: ${({ theme }) => theme.colors.primary};
    }
`;
