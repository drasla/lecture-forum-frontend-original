import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import postApi from "../../../api/user/postApi.ts";
import { useAuthStore } from "../../../stores/auth/AuthStore.ts";
import Button from "../../../components/common/button/Button.tsx";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import { ErrorMessage } from "../../../components/common/group/Group.tsx";
import {
    createPostSchema,
    type CreatePostInputType,
} from "../../../schemas/post/createPostSchema.ts";
import {
    PostContainer,
    PostPageHeader,
    PostTitle,
    FormWrapper,
    FormDivider,
    VoteSectionTitle,
    VoteSectionDescription,
    VoteFieldsFlex,
} from "../../../components/post/post.style.tsx";
import { GiCrossedSwords } from "react-icons/gi";
import TextareaGroup from "../../../components/common/textarea/TextareaGroup.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";

function CreatePostPage() {
    const navigate = useNavigate();
    const { categoryId } = useParams<{ categoryId: string }>();
    const { isLoggedIn } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreatePostInputType>({
        resolver: zodResolver(createPostSchema),
        defaultValues: { title: "", content: "", option1Text: "", option2Text: "" },
    });

    const onSubmit = async (data: CreatePostInputType) => {
        if (!categoryId) return;

        setIsSubmitting(true);
        try {
            await postApi.createPost(Number(categoryId), {
                title: data.title,
                content: data.content,
                option1Text: data.option1Text?.trim() || undefined,
                option2Text: data.option2Text?.trim() || undefined,
            });

            alert("게시글이 성공적으로 등록되었습니다!");
            navigate(`/category/${categoryId}`);
        } catch (error) {
            console.error("글 등록 실패:", error);
            alert("게시글 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    <GiCrossedSwords size={26} style={{ color: "#EF4444" }} />
                    대난투 전장 개막 <small>새로운 토론 주제 던지기</small>
                </PostTitle>
            </PostPageHeader>

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputGroup
                    label="토론 제목"
                    id="title"
                    placeholder="예시) 짜장면 vs 짬뽕, 일생일대의 선택은?"
                    errorMessage={errors.title?.message}
                    registerObj={register("title")}
                />

                <TextareaGroup
                    label={"토론 내용"}
                    placeholder="자신의 의견을 지지해줄 근거와 함께 토론 주제를 상세히 적어주세요."
                    errorMessage={errors.content?.message}
                    registerObj={register("content")}
                />

                <FormDivider />

                <VoteSectionTitle>
                    <GiCrossedSwords size={18} /> 실시간 대난투 투표 설정 <small>(선택 사항)</small>
                </VoteSectionTitle>
                <VoteSectionDescription>
                    항목을 입력하면 상세 페이지에 실시간 투표 선택지가 생성됩니다.
                </VoteSectionDescription>

                {errors.option1Text && (
                    <ErrorMessage style={{ display: "block", marginBottom: "16px" }}>
                        {errors.option1Text.message}
                    </ErrorMessage>
                )}

                <VoteFieldsFlex>
                    <InputGroup
                        label="1번 선택지 대안"
                        id="option1"
                        placeholder="예시) 평생 짜장면만 먹기"
                        wrap={true}
                        registerObj={register("option1Text")}
                    />
                    <InputGroup
                        label="2번 선택지 대안"
                        id="option2"
                        placeholder="예시) 평생 짬뽕만 먹기"
                        wrap={true}
                        registerObj={register("option2Text")}
                    />
                </VoteFieldsFlex>

                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button
                        type="button"
                        color="secondary"
                        variant="text"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}>
                        {isSubmitting ? "등록 중..." : "토론 시작하기"}
                    </Button>
                </AdminButtonGroup>
            </FormWrapper>
        </PostContainer>
    );
}

export default CreatePostPage;
