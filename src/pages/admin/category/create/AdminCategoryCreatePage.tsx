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
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";

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
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>새 카테고리 추가</AdminTitle>
            </AdminPageHeader>

            <Card>
                <AdminForm onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup
                        id="categoryName"
                        label="카테고리명"
                        placeholder="추가할 카테고리명을 입력하세요 (최대 50자)"
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
                            {isSubmitting ? "추가 중..." : "추가하기"}
                        </Button>
                    </AdminButtonGroup>
                </AdminForm>
            </Card>
        </AdminContainer>
    );
}

export default AdminCategoryCreatePage;