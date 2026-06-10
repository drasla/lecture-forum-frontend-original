import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";

import {
    PostContainer,
    PostPageHeader,
    PostTitle,
    FormWrapper,
    FormDivider,
} from "../../../../components/post/post.style.tsx";
import { type InquiryInputType, inquirySchema } from "../../../../schemas/inquiry/inquirySchema.ts";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function MyInquiryCreatePage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<InquiryInputType>({
        resolver: zodResolver(inquirySchema),
    });

    const onSubmit = async (data: InquiryInputType) => {
        try {
            await inquiryApi.createInquiry(data);
            alert("1:1 문의가 성공적으로 등록되었습니다.");
            navigate("/my/inquiry", { replace: true });
        } catch (error) {
            console.error("문의글 등록 실패:", error);
            alert("문의글 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    1:1 문의 작성 <small>궁금한 점이나 불편하신 점을 남겨주세요.</small>
                </PostTitle>
            </PostPageHeader>

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputGroup
                    id="title"
                    label="문의 제목"
                    placeholder="문의하실 내용의 제목을 입력해주세요."
                    errorMessage={errors.title?.message}
                    registerObj={register("title")}
                />

                <FormDivider />

                <TextareaGroup
                    id="content"
                    label="문의 내용"
                    placeholder="관리자가 정확하게 답변할 수 있도록 문의 내용을 상세히 적어주세요."
                    errorMessage={errors.content?.message}
                    registerObj={register("content")}
                    style={{ minHeight: "300px" }}
                />

                <ButtonGroup>
                    <Button
                        type="button"
                        variant="text"
                        color="secondary"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}>
                        {isSubmitting ? "등록 중..." : "문의 등록하기"}
                    </Button>
                </ButtonGroup>
            </FormWrapper>
        </PostContainer>
    );
}

export default MyInquiryCreatePage;

// --- Styled Components ---

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
`;
