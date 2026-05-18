import { Outlet } from "react-router";
import styled from "styled-components";
import AdminAside from "../components/layout/admin/AdminAside.tsx";

function AdminLayout() {
    return (
        <AdminContainer>
            <AdminAside />

            <AdminMain>
                <AdminContentInner>
                    <Outlet />
                </AdminContentInner>
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

const AdminMain = styled.main`
    flex: 1;
    padding: 32px;
    overflow-y: auto;
`;

const AdminContentInner = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
`;