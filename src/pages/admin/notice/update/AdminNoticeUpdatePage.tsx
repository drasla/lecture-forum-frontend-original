// /src/pages/admin/notice/edit/AdminNoticeEditPage.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import {
    type NoticeInputType,
    noticeSchema,
} from "../../../../schemas/admin/notice/noticeSchema.ts";
import noticeApi from "../../../../api/user/noticeApi.ts";
import adminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminLoadingText,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function AdminNoticeUpdatePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // URL에서 공지사항 ID 추출
    const noticeId = Number(id);

    const [isPageLoading, setIsPageLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset, // 💡 API로 불러온 데이터를 폼에 채워넣기 위한 함수
        formState: { errors, isSubmitting },
    } = useForm<NoticeInputType>({
        resolver: zodResolver(noticeSchema),
    });

    // 1. 기존 공지사항 데이터 불러오기
    useEffect(() => {
        if (isNaN(noticeId)) {
            alert("잘못된 접근입니다.");
            navigate("/admin/notice");
            return;
        }

        const fetchNotice = async () => {
            try {
                // 💡 조회는 권한이 필요 없는 공용 API 사용
                const noticeData = await noticeApi.getNoticeById(noticeId);

                // 💡 불러온 데이터를 폼의 기본값으로 세팅 (reset)
                reset({
                    title: noticeData.title,
                    content: noticeData.content,
                });
            } catch (error) {
                console.error("공지사항 데이터 로드 실패:", error);
                alert("존재하지 않거나 삭제된 공지사항입니다.");
                navigate("/admin/notice");
            } finally {
                setIsPageLoading(false);
            }
        };

        fetchNotice().then(() => {});
    }, [noticeId, navigate, reset]);

    // 2. 수정 데이터 전송
    const onSubmit = async (data: NoticeInputType) => {
        try {
            // 💡 수정은 관리자 전용 API 사용
            await adminNoticeApi.updateNotice(noticeId, data);
            alert("공지사항이 성공적으로 수정되었습니다.");

            // 수정 완료 후 목록으로 이동 (뒤로 가기 시 이전 페이지네이션 상태 유지를 위해 -1 옵션도 고려할 수 있음)
            // 여기서는 깔끔하게 목록 1페이지로 가거나 브라우저 뒤로가기 활용
            navigate(-1);
        } catch (error) {
            console.error("공지사항 수정 실패:", error);
            alert("공지사항 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>공지사항 수정</AdminTitle>
            </AdminPageHeader>

            <Card padding="32px">
                {isPageLoading ? (
                    <AdminLoadingText>데이터를 불러오는 중입니다...</AdminLoadingText>
                ) : (
                    <AdminForm onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup
                            id="title"
                            label="공지사항 제목"
                            placeholder="제목을 입력하세요"
                            errorMessage={errors.title?.message}
                            registerObj={register("title")}
                        />

                        <TextareaGroup
                            id="content"
                            label="공지사항 내용"
                            placeholder="사용자들에게 안내할 공지사항 내용을 상세히 적어주세요."
                            errorMessage={errors.content?.message}
                            registerObj={register("content")}
                            style={{ minHeight: "300px" }}
                        />

                        <AdminButtonGroup $align="right" style={{ marginTop: "16px" }}>
                            <Button
                                type="button"
                                variant="text"
                                color="secondary"
                                onClick={() => navigate(-1)} // 취소 시 이전 페이지로 (검색/페이지네이션 파라미터 유지)
                                disabled={isSubmitting}>
                                취소
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}>
                                {isSubmitting ? "수정 중..." : "수정 완료"}
                            </Button>
                        </AdminButtonGroup>
                    </AdminForm>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminNoticeUpdatePage;
