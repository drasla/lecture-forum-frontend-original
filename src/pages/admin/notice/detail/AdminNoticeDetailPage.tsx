import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
    AdminContainer,
    AdminPageHeader,
    AdminTitle,
    AdminButtonGroup,
    AdminLoadingText,
    AdminDetailHeader,
    AdminDetailTitle,
    AdminDetailMeta,
    AdminDivider,
    AdminDetailContent,
} from "../../../../components/admin/admin.style.tsx";
import type { Notice } from "../../../../types/notice.type.ts";
import noticeApi from "../../../../api/user/noticeApi.ts";
import adminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";
import Card from "../../../../components/common/card/Card.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function AdminNoticeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const noticeId = Number(id);

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isNaN(noticeId)) {
            alert("잘못된 접근입니다.");
            navigate("/admin/notice");
            return;
        }

        const fetchNotice = async () => {
            setIsLoading(true);
            try {
                const data = await noticeApi.getNoticeById(noticeId);
                setNotice(data);
            } catch (error) {
                console.error("공지사항 불러오기 실패:", error);
                alert("존재하지 않거나 삭제된 공지사항입니다.");
                navigate("/admin/notice");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotice().then(() => {});
    }, [noticeId, navigate]);

    const handleDelete = async () => {
        if (!window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

        try {
            await adminNoticeApi.deleteNotice(noticeId);
            alert("공지사항이 성공적으로 삭제되었습니다.");
            navigate("/admin/notice");
        } catch (error) {
            console.error("공지사항 삭제 실패:", error);
            alert("공지사항 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>공지사항 상세</AdminTitle>
            </AdminPageHeader>

            <Card padding="32px">
                {isLoading || !notice ? (
                    <AdminLoadingText>데이터를 불러오는 중입니다...</AdminLoadingText>
                ) : (
                    <>
                        <AdminDetailHeader>
                            <AdminDetailTitle>{notice.title}</AdminDetailTitle>
                            <AdminDetailMeta>
                                <span>NO. {notice.id}</span>
                                <span className="divider">|</span>
                                <span>
                                    {new Date(notice.createdAt).toLocaleString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </AdminDetailMeta>
                        </AdminDetailHeader>

                        <AdminDivider />

                        <AdminDetailContent>{notice.content}</AdminDetailContent>

                        <AdminDivider />

                        <AdminButtonGroup $align="right" style={{ marginTop: "24px" }}>
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={() => navigate(-1)}
                                style={{ marginRight: "auto" }}>
                                목록으로
                            </Button>

                            <Button
                                variant={"contained"}
                                color="primary"
                                as={Link}
                                to={`/admin/notice/edit/${notice.id}`}>
                                수정
                            </Button>
                            <Button variant="contained" color="error" onClick={handleDelete}>
                                삭제
                            </Button>
                        </AdminButtonGroup>
                    </>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminNoticeDetailPage;
