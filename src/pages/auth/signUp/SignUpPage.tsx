import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { type SignUpInputType, signUpSchema } from "../../../schemas/auth/signUpSchema.ts";
import * as axios from "axios";
import axiosInstance from "../../../api/axiosInstance.ts";
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
import SelectGroup from "../../../components/common/select/SelectGroup.tsx";

function SignUpPage() {
    const navigate = useNavigate();

    // 1. React Hook Form 설정 (zod 스키마 연결)
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignUpInputType>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur", // 입력칸을 벗어날 때 유효성 검사 실행
    });

    // 2. 폼 제출 핸들러
    const onSubmit = async (data: SignUpInputType) => {
        try {
            // 백엔드로 보낼 때는 passwordConfirm은 제외하고 보냅니다.
            const { passwordConfirm, ...submitData } = data;
            await axiosInstance.post("/user/create", submitData);
            alert("회원가입이 완료되었습니다! 로그인해주세요.");
            navigate("/auth/signIn");
        } catch (error) {
            console.log(error);

            // 기본 에러 메세지를 미리 넣어서 errorMessage 마련
            let errorMessage = "회원가입 중 오류가 발생했습니다.";

            // 지금 catch된 error가 axios의 에러인지 판별
            if (axios.isAxiosError(error)) {
                // axios에서 발생된 에러라면, 백엔드에서 제공을 한 내용이 error.response.data.message에 존재
                // 그 백엔드에서 전달해준 내용을 errorMessage에 저장
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                // axios에서 발생한 에러가 아닌, 자바스크립트 표준 에러 객체라면
                // error.message에 담긴 에러 내용을 errorMessage에 저장
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <AuthPageContainer>
            <AuthFormCard>
                <AuthTitle>회원가입</AuthTitle>
                <AuthSubTitle>토론대난투에 오신 것을 환영합니다!</AuthSubTitle>

                <AuthForm onSubmit={handleSubmit(onSubmit)}>
                    {/* 1. 아이디 */}
                    <InputGroup
                        id={"username"}
                        label={"아이디"}
                        placeholder={"4자 이상 10자 이하"}
                        errorMessage={errors.username?.message}
                        registerObj={register("username")}
                    />

                    {/* 2. 비밀번호 */}
                    <InputGroup
                        id={"password"}
                        label={"비밀번호"}
                        type={"password"}
                        placeholder={"특수문자 포함 8자 이상"}
                        errorMessage={errors.password?.message}
                        registerObj={register("password")}
                    />

                    {/* 3. 비밀번호 확인 */}
                    <InputGroup
                        id={"passwordConfirm"}
                        label={"비밀번호 확인"}
                        type={"password"}
                        placeholder={"비밀번호를 한 번 더 입력해주세요"}
                        errorMessage={errors.passwordConfirm?.message}
                        registerObj={register("passwordConfirm")}
                    />

                    {/* 4. 이름 */}
                    <InputGroup
                        id={"name"}
                        label={"이름"}
                        errorMessage={errors.name?.message}
                        registerObj={register("name")}
                    />

                    {/* 5. 닉네임 */}
                    <InputGroup
                        id={"nickname"}
                        label={"닉네임"}
                        errorMessage={errors.nickname?.message}
                        registerObj={register("nickname")}
                    />

                    {/* 6. 이메일 */}
                    <InputGroup
                        id={"email"}
                        label={"이메일"}
                        errorMessage={errors.email?.message}
                        registerObj={register("email")}
                    />

                    <InputGroup
                        id={"phoneNumber"}
                        label={"전화번호"}
                        errorMessage={errors.phoneNumber?.message}
                        registerObj={register("phoneNumber")}
                        type={"tel"}
                    />

                    <InputGroup
                        id={"birthdate"}
                        label={"생년월일"}
                        errorMessage={errors.birthdate?.message}
                        registerObj={register("birthdate")}
                        type={"date"}
                    />

                    <SelectGroup
                        id="gender"
                        label="성별"
                        errorMessage={errors.gender?.message}
                        registerObj={register("gender")}>
                        <option value="">성별을 선택해주세요</option>
                        <option value="MALE">남성</option>
                        <option value="FEMALE">여성</option>
                    </SelectGroup>

                    {errors.root && (
                        <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>
                    )}

                    <Button
                        fullWidth={true}
                        variant={"contained"}
                        color={"primary"}
                        type={"submit"}
                        disabled={isSubmitting}>
                        {isSubmitting ? "가입하는 중..." : "회원가입"}
                    </Button>
                </AuthForm>
            </AuthFormCard>
        </AuthPageContainer>
    );
}

export default SignUpPage;
