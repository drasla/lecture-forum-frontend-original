import { type User } from "./user.type.ts"; // User 타입 임포트

export interface Post {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    content: string;
    views: number;
    userId: number;
    categoryId: number;
    user: Pick<User, "id" | "nickname" | "email">;

    option1Text?: string | null;
    option2Text?: string | null;

    // 💡 서비스에서 새로 추가해준 집계 및 투표 여부 데이터
    vote: {
        option1Count: number;
        option2Count: number;
        totalCount: number;
        hasVoted: boolean; // 로그인 유저의 투표 참여 여부
    };
}
