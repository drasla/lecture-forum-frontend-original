import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import postApi from "../../../api/user/postApi.ts";
import { useAuthStore } from "../../../stores/auth/AuthStore.ts";
import type { Post } from "../../../types/post.type.ts";
import Button from "../../../components/common/button/Button.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../components/post/post.style.tsx";
import PostVote from "../../../components/post/PostVote.tsx";
import PostReply from "../../../components/post/PostReply.tsx";

function PostDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuthStore();

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadPost = useCallback(async () => {
        try {
            const data = await postApi.fetchPostById(Number(id));
            setPost(data);
        } catch (error) {
            console.error(error);
            alert("게시글을 불러오는 중 오류가 발생했습니다.");
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        loadPost().then(() => {});
    }, [loadPost]);

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>글 내용을 불러오는 중입니다...</LoadingText>
            </PostContainer>
        );
    }

    if (!post) return null;

    return (
        <PostContainer>
            <DetailWrapper>
                {/* 1. 게시글 헤더 영역 */}
                <DetailHeader>
                    <DetailTitle>{post.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>
                                <b>{post.user.nickname}</b>
                            </span>
                            <span>
                                {new Date(post.createdAt).toLocaleString("ko-KR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className={"right-info"}>
                            <span>조회 {post.views}</span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                {/* 2. 게시글 본문 영역 */}
                <DetailContent>{post.content}</DetailContent>

                {/* 💡 3. 분리된 투표 영역 컴포넌트 마운트 */}
                <PostVote post={post} postId={Number(id)} onRefresh={loadPost} />

                {/* 4. 하단 제어 버튼 그룹 */}
                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>

                    {user?.id === post.user.id && (
                        <>
                            <Button color={"warning"} variant={"contained"}>
                                수정
                            </Button>
                            <Button color={"error"} variant={"contained"}>
                                삭제
                            </Button>
                        </>
                    )}
                </AdminButtonGroup>

                {/* 💡 5. 분리된 댓글 영역 컴포넌트 마운트 */}
                <PostReply postId={Number(id)} />
            </DetailWrapper>
        </PostContainer>
    );
}

export default PostDetailPage;
