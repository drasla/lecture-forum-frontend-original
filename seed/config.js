import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ES module 환경용 __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 최상단 루트 폴더의 .env 파일 로드
dotenv.config({ path: path.join(__dirname, "../.env") });

// 서비스 운영에 필요한 핵심 환경변수만 깔끔하게 export
export const BASE_URL = process.env.VITE_API_BASE_URL;
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const CATEGORY_LIST_URL = `${BASE_URL}/category`;

export async function fetchCategories() {
    try {
        const response = await fetch(CATEGORY_LIST_URL);
        if (!response.ok) throw new Error("카테고리 목록을 불러오는데 실패했습니다.");

        const result = await response.json();
        return result.data; // { data: Category[] } 스펙에 맞춰 추출
    } catch (error) {
        console.error("💥 카테고리 조회 중 에러 발생:", error.message);
        return [];
    }
}
