import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import noticeApi from "../../../api/user/noticeApi.ts";
import Button from "../../../components/common/button/Button.tsx";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../components/post/post.style.tsx";
import type { Notice } from "../../../types/notice.type.ts";

function NoticeDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadNotice = useCallback(async () => {
        try {
            const data = await noticeApi.getNoticeById(Number(id));
            setNotice(data);
        } catch (error) {
            console.error(error);
            alert("존재하지 않거나 삭제된 공지사항입니다.");
            navigate("/notice"); // 에러 시 목록으로 강제 이동
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadNotice().then(() => {});
    }, [loadNotice]);

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>공지사항을 불러오는 중입니다...</LoadingText>
            </PostContainer>
        );
    }

    if (!notice) return null;

    return (
        <PostContainer>
            <DetailWrapper>
                {/* 1. 공지사항 헤더 영역 */}
                <DetailHeader>
                    <DetailTitle>{notice.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>
                                <b>관리자</b> {/* 작성자 고정 */}
                            </span>
                            <span>
                                {new Date(notice.createdAt).toLocaleString("ko-KR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className={"right-info"}>
                            <span>NO. {notice.id}</span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                {/* 2. 공지사항 본문 영역 (줄바꿈 유지를 위해 white-space 적용 권장) */}
                <DetailContent style={{ whiteSpace: "pre-wrap" }}>{notice.content}</DetailContent>

                {/* 3. 하단 제어 버튼 (사용자는 '목록으로' 버튼만 노출) */}
                <div style={{ marginTop: "40px", display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        color={"secondary"}
                        variant={"contained"}
                        onClick={() => navigate(-1)} // 이전 페이지네이션 상태로 부드럽게 복귀
                    >
                        목록으로
                    </Button>
                </div>
            </DetailWrapper>
        </PostContainer>
    );
}

export default NoticeDetailPage;
