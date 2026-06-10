import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import { isAxiosError } from "axios";

import userApi from "../../../api/user/userApi.ts";
import {
    type UpdatePasswordInputType,
    updatePasswordSchema,
} from "../../../schemas/user/updatePasswordSchema.ts";

import InputGroup from "../../../components/common/input/InputGroup.tsx";
import Button from "../../../components/common/button/Button.tsx";
import Card from "../../../components/common/card/Card.tsx";
import { PostContainer, PostPageHeader, PostTitle } from "../../../components/post/post.style.tsx";

function MyPasswordPage() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
    });

    const onSubmit = async (data: UpdatePasswordInputType) => {
        try {
            await userApi.updatePassword(data);
            alert("비밀번호가 성공적으로 변경되었습니다. 다음 로그인부터 적용됩니다.");
            reset(); // 성공 시 입력칸 비우기
        } catch (error) {
            console.error(error);
            let errorMessage = "비밀번호 변경 중 오류가 발생했습니다.";
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            alert(errorMessage);
        }
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    비밀번호 변경 <small>안전한 서비스 이용을 위해 비밀번호를 관리하세요</small>
                </PostTitle>
            </PostPageHeader>

            <Card padding="32px">
                <SectionTitle>비밀번호 변경</SectionTitle>
                <SectionDescription>
                    현재 사용 중인 비밀번호와 새롭게 변경할 비밀번호를 입력해 주세요.
                </SectionDescription>

                <PasswordForm onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup
                        id="currentPassword"
                        label="현재 비밀번호"
                        type="password"
                        placeholder="현재 사용 중인 비밀번호를 입력하세요"
                        errorMessage={errors.currentPassword?.message}
                        registerObj={register("currentPassword")}
                    />
                    <InputGroup
                        id="newPassword"
                        label="새 비밀번호"
                        type="password"
                        placeholder="6자리 이상의 새 비밀번호를 입력하세요"
                        errorMessage={errors.newPassword?.message}
                        registerObj={register("newPassword")}
                    />
                    <InputGroup
                        id="newPasswordConfirm"
                        label="새 비밀번호 확인"
                        type="password"
                        placeholder="새 비밀번호를 다시 한 번 입력하세요"
                        errorMessage={errors.newPasswordConfirm?.message}
                        registerObj={register("newPasswordConfirm")}
                    />

                    <ButtonGroup>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}>
                            {isSubmitting ? "변경 중..." : "비밀번호 변경"}
                        </Button>
                    </ButtonGroup>
                </PasswordForm>
            </Card>
        </PostContainer>
    );
}

export default MyPasswordPage;

// --- Styled Components ---

const SectionTitle = styled.h3`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: 8px;
`;

const SectionDescription = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const PasswordForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 500px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
`;
