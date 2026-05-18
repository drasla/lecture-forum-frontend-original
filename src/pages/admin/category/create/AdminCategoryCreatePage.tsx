import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as axios from "axios";
import { useNavigate, Link } from "react-router";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import {
    type AdminCreateCategoryInputType,
    adminCreateCategorySchema,
} from "../../../../schemas/admin/category/adminCreateCategorySchema.ts";
import adminCategoryApi from "../../../../api/admin/adminCategoryApi.ts";

function AdminCategoryCreatePage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AdminCreateCategoryInputType>({
        resolver: zodResolver(adminCreateCategorySchema),
    });

    const onSubmit = async (data: AdminCreateCategoryInputType) => {
        try {
            await adminCategoryApi.createCategory(data.name);
            alert("카테고리가 성공적으로 추가되었습니다.");
            navigate("/admin/category");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setError("name", { message: "이미 존재하는 카테고리명입니다." });
            } else {
                alert("카테고리 생성 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <Container>
            <PageHeader>
                <Title>새 카테고리 추가</Title>
            </PageHeader>

            <Card>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup
                        id="categoryName"
                        label="카테고리명"
                        placeholder="추가할 카테고리명을 입력하세요 (최대 50자)"
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
                            {isSubmitting ? "추가 중..." : "추가하기"}
                        </Button>
                    </ButtonGroup>
                </Form>
            </Card>
        </Container>
    );
}

export default AdminCategoryCreatePage;

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
