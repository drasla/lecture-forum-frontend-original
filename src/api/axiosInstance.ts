import * as axios from "axios";
import { useAuthStore } from "../stores/auth/AuthStore.ts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
    baseURL: BASE_URL, // 통신을 진행할 상대의 기본 주소
    timeout: 5000, // 통신 요청을 했을 때 실패되었다고 판단하는 타임아웃 시간 (ms 밀리세컨드 단위. 5초)
    withCredentials: true, // CORS 요청을 허용할지 여부
});

api.interceptors.request.use(
    config => {
        // 💡 Zustand 스토어에서 현재 토큰을 직접 꺼내옵니다!
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

// 응답(Response) 인터셉터
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    },
);

export default api;
