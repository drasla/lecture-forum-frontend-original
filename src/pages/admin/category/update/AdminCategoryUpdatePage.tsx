import { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as axios from "axios";
import { useNavigate, useParams, Link } from "react-router";
import {
    type AdminUpdateCategoryInputType,
    adminUpdateCategorySchema,
} from "../../../../schemas/admin/category/adminUpdateCategorySchema.ts";
import adminCategoryApi from "../../../../api/admin/adminCategoryApi.ts";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function AdminCategoryUpdatePage() {
    const { id } = useParams<{ id: string }>(); // URL에서 ID 추출
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setValue, // 💡 초기값을 셋팅하기 위한 함수
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AdminUpdateCategoryInputType>({
        resolver: zodResolver(adminUpdateCategorySchema),
    });

    // 💡 화면 진입 시 기존 카테고리 데이터 불러오기
    useEffect(() => {
        const loadInitialData = async () => {
            if (!id) return;
            try {
                const targetCategory = await adminCategoryApi.fetchCategoryById(Number(id));
                setValue("name", targetCategory.name);
            } catch (error) {
                console.error(error);
                alert("존재하지 않거나 삭제된 카테고리입니다.");
                navigate("/admin/category");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData().then(() => {});
    }, [id, setValue, navigate]);

    // 💡 폼 제출(수정) 핸들러
    const onSubmit = async (data: AdminUpdateCategoryInputType) => {
        try {
            await adminCategoryApi.updateCategory(Number(id), data.name);
            alert("카테고리가 성공적으로 수정되었습니다.");
            navigate("/admin/category"); // 성공 시 목록으로 이동
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setError("name", { message: "이미 존재하는 카테고리명입니다." });
            } else {
                alert("카테고리 수정 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <Container>
            <PageHeader>
                <Title>카테고리 수정</Title>
            </PageHeader>

            <Card>
                {isLoading ? (
                    <LoadingText>데이터를 불러오는 중...</LoadingText>
                ) : (
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup
                            id="categoryName"
                            label="카테고리명"
                            placeholder="수정할 카테고리명을 입력하세요 (최대 50자)"
                            errorMessage={errors.name?.message}
                            registerObj={register("name")}
                        />

                        <ButtonGroup>
                            <Button
                                type="button"
                                variant="text"
                                color="secondary"
                                as={Link}
                                to="/admin/category">
                                취소
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}>
                                {isSubmitting ? "수정 중..." : "수정 완료"}
                            </Button>
                        </ButtonGroup>
                    </Form>
                )}
            </Card>
        </Container>
    );
}

export default AdminCategoryUpdatePage;

// --- Styled Components ---

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

const PageHeader = styled.div`
    margin-bottom: 8px;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
`;

const Card = styled.div`
    background-color: ${({ theme }) => theme.colors.background.paper};
    border: 1px solid ${({ theme }) => theme.colors.divider};
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;

const LoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.text.disabled};
`;
