import { Link, Outlet } from "react-router"; // react-router-dom v6+ / react-router v7
import styled from "styled-components";
import { FiGrid, FiUsers, FiSettings } from "react-icons/fi";

function AdminLayout() {
    return (
        <AdminContainer>
            {/* 좌측 관리자 사이드바 */}
            <AdminSidebar>
                <SidebarHeader to="/admin">관리자 센터</SidebarHeader>
                <SidebarMenu>
                    <MenuItem to="/admin/category">
                        <FiGrid size={18} />
                        카테고리 관리
                    </MenuItem>
                    <MenuItem to="/admin/users">
                        <FiUsers size={18} />
                        유저 관리
                    </MenuItem>
                    <MenuItem to="/">
                        <FiSettings size={18} />
                        서비스로 돌아가기
                    </MenuItem>
                </SidebarMenu>
            </AdminSidebar>

            {/* 우측 메인 콘텐츠 영역 (Outlet을 통해 하위 페이지들이 렌더링됨) */}
            <AdminMain>
                <Outlet />
            </AdminMain>
        </AdminContainer>
    );
}

export default AdminLayout;

// --- Styled Components ---

const AdminContainer = styled.div`
    display: flex;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

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

const MenuItem = styled(Link)`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.default};
    transition: all 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors.background.default};
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const AdminMain = styled.main`
    flex: 1;
    padding: 32px;
    overflow-y: auto;
`;
