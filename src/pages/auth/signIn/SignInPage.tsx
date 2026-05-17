import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { type SignInInputType, signInSchema } from "../../../schemas/auth/signInSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../api/axiosInstance.ts";
import axios from "axios";
import {
    AuthForm,
    AuthFormCard,
    AuthPageContainer,
    AuthRootErrorMessage,
    AuthSubTitle,
    AuthTitle,
} from "../../../components/auth/auth.style.tsx";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import Button from "../../../components/common/button/Button.tsx";
import { useAuthStore } from "../../../stores/auth/AuthStore.ts";

function SignInPage() {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInInputType>({
        resolver: zodResolver(signInSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: SignInInputType) => {
        try {
            // 💡 1. 백엔드 라우터 구조에 맞춰 /users/login 으로 POST 요청을 보냅니다.
            const response = await axiosInstance.post("/users/login", data);

            // 💡 2. 컨트롤러에서 res.status(200).json({ message, data: { user, token } }) 형태로 보낸 데이터 추출
            const { token, user } = response.data.data;
            login(user, token);

            alert("로그인에 성공했습니다!");
            navigate("/");
        } catch (error) {
            let errorMessage = "로그인 중 오류가 발생했습니다.";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            // 실패 시 최상단 에러로 등록하여 폼 하단에 표시
            setError("root", { message: errorMessage });
        }
    };

    return (
        <AuthPageContainer>
            <AuthFormCard>
                <AuthTitle>로그인</AuthTitle>
                <AuthSubTitle>다시 오신 것을 환영합니다!</AuthSubTitle>

                <AuthForm onSubmit={handleSubmit(onSubmit)}>
                    {/* 1. 아이디 */}
                    <InputGroup
                        id={"username"}
                        label={"아이디"}
                        errorMessage={errors.username?.message}
                        registerObj={register("username")}
                    />

                    {/* 2. 비밀번호 */}
                    <InputGroup
                        id={"password"}
                        label={"비밀번호"}
                        errorMessage={errors.password?.message}
                        registerObj={register("password")}
                        type={"password"}
                    />

                    {/* 💡 서버 에러 (401 불일치 등) 표시 영역 */}
                    {errors.root && (
                        <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant={"contained"}
                        fullWidth={true}>
                        {isSubmitting ? "로그인 중..." : "로그인"}
                    </Button>
                </AuthForm>
            </AuthFormCard>
        </AuthPageContainer>
    );
}

export default SignInPage;
