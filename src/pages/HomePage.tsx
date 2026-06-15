import { useEffect, useState } from "react";
import type { RecentPost } from "../types/post.type.ts";
import postApi from "../api/user/postApi.ts";
import { isAxiosError } from "axios";
import {
    BoardTable,
    BoardTd,
    BoardTh,
    BoardWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../components/post/post.style.tsx";
import Badge from "../components/common/badge/Badge.tsx";
import { Link } from "react-router";

function HomePage() {
    const [posts, setPosts] = useState<RecentPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRecentPosts = async () => {
            try {
                // 💡 최신 글로벌 게시글 10개 조회
                const data = await postApi.fetchRecentPostList(10);
                setPosts(data);
            } catch (error) {
                console.error(error);
                let errorMessage = "최신 토론 목록을 불러오는 중 에러가 발생했습니다.";
                if (isAxiosError(error)) {
                    errorMessage = error.response?.data?.message || errorMessage;
                }
                alert(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadRecentPosts().then(() => {});
    }, []);

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    🔥 실시간 토론 대난투{" "}
                    <small>카테고리 구분 없이 지금 가장 뜨겁게 올라온 주제들입니다.</small>
                </PostTitle>
            </PostPageHeader>

            <BoardWrapper>
                {isLoading ? (
                    <LoadingText>최신 토론 주제들을 가져오는 중입니다...</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width="15%">분류</BoardTh>
                                <BoardTh $width="55%">토론 주제</BoardTh>
                                <BoardTh $width="15%">작성자</BoardTh>
                                <BoardTh $width="15%">등록 시간</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length === 0 ? (
                                <tr>
                                    <BoardTd colSpan={4} style={{ padding: "80px 0" }}>
                                        현재 등록된 실시간 토론이 없습니다.
                                    </BoardTd>
                                </tr>
                            ) : (
                                posts.map(post => (
                                    <tr key={post.id}>
                                        <BoardTd>
                                            <Badge color="primary">{post.category.name}</Badge>
                                        </BoardTd>
                                        <BoardTd style={{ textAlign: "left" }}>
                                            <Link to={`/post/${post.id}`}>
                                                {post.title}
                                            </Link>
                                        </BoardTd>
                                        <BoardTd>{post.user.nickname}</BoardTd>
                                        <BoardTd>
                                            {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </BoardTd>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>
        </PostContainer>
    );
}

export default HomePage;
