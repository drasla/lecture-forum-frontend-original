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

function SignInPage() {
    const navigate = useNavigate();

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

            // 💡 3. 발급받은 JWT 토큰을 로컬 스토리지에 저장합니다.
            // 이후 axiosInstance의 인터셉터가 이 토큰을 꺼내서 모든 요청 헤더에 자동으로 실어주게 됩니다.
            localStorage.setItem("accessToken", token);

            // (선택) 유저 정보가 필요하다면 상태 관리 라이브러리(Zustand 등)에 user 객체를 저장합니다.

            alert("로그인에 성공했습니다!");
            navigate("/"); // 로그인 성공 시 메인 페이지 등 원하는 곳으로 이동
        } catch (error) {
            let errorMessage = "로그인 중 오류가 발생했습니다.";

            if (axios.isAxiosError(error)) {
                // 💡 4. 백엔드 컨트롤러에서 던진 401 "아이디 또는 비밀번호가 일치하지 않습니다." 에러 처리
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
