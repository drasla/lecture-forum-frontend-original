import { useEffect, useState } from "react";
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
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminLoadingText,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";

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
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>카테고리 수정</AdminTitle>
            </AdminPageHeader>

            <Card>
                {isLoading ? (
                    <AdminLoadingText>데이터를 불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminForm onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup
                            id="categoryName"
                            label="카테고리명"
                            placeholder="수정할 카테고리명을 입력하세요 (최대 50자)"
                            errorMessage={errors.name?.message}
                            registerObj={register("name")}
                        />

                        <AdminButtonGroup>
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
                        </AdminButtonGroup>
                    </AdminForm>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminCategoryUpdatePage;