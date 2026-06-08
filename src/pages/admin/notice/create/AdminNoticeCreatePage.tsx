import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import {
    type NoticeInputType,
    noticeSchema,
} from "../../../../schemas/admin/notice/noticeSchema.ts";
import adminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";

function AdminNoticeCreatePage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NoticeInputType>({
        resolver: zodResolver(noticeSchema),
        defaultValues: { title: "", content: "" },
    });

    const onSubmit = async (data: NoticeInputType) => {
        try {
            await adminNoticeApi.createNotice(data);
            alert("공지사항이 성공적으로 등록되었습니다.");
            navigate("/admin/notice");
        } catch (error) {
            console.error("공지사항 등록 실패:", error);
            alert("공지사항 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>새 공지사항 등록</AdminTitle>
            </AdminPageHeader>

            <Card padding="32px">
                <AdminForm onSubmit={handleSubmit(onSubmit)}>
                    {/* 💡 1. 제목 입력 (InputGroup 활용) */}
                    <InputGroup
                        id="title"
                        label="공지사항 제목"
                        placeholder="제목을 입력하세요"
                        errorMessage={errors.title?.message}
                        registerObj={register("title")}
                    />

                    {/* 💡 2. 본문 입력 (TextareaGroup 완벽 활용!) */}
                    <TextareaGroup
                        id="content"
                        label="공지사항 내용"
                        placeholder="사용자들에게 안내할 공지사항 내용을 상세히 적어주세요."
                        errorMessage={errors.content?.message}
                        registerObj={register("content")}
                        style={{ minHeight: "300px" }} // 공지사항이므로 높이를 넉넉하게 부여
                    />

                    {/* 💡 3. 액션 버튼 */}
                    <AdminButtonGroup $align="right" style={{ marginTop: "16px" }}>
                        <Button
                            type="button"
                            variant="text"
                            color="secondary"
                            as={Link}
                            to="/admin/notice"
                            disabled={isSubmitting}>
                            취소
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}>
                            {isSubmitting ? "등록 중..." : "등록하기"}
                        </Button>
                    </AdminButtonGroup>
                </AdminForm>
            </Card>
        </AdminContainer>
    );
}

export default AdminNoticeCreatePage;