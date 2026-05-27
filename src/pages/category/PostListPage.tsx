import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router"; // react-router-dom v6 이상
import postApi from "../../api/user/postApi.ts";
import type { Post } from "../../types/post.type.ts";
import Button from "../../components/common/button/Button.tsx";
import {
    BoardTable,
    BoardTd,
    BoardTh,
    BoardWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../components/post/post.style.tsx";
import { useAuthStore } from "../../stores/auth/AuthStore.ts";
import Pagination from "../../components/common/pagination/Pagination.tsx";

function PostListPage() {
    const { isLoggedIn } = useAuthStore();
    const { categoryId } = useParams<{ categoryId: string }>();

    // 💡 URL의 ?page=1&size=10 을 읽고 쓰기 위한 훅
    const [searchParams, setSearchParams] = useSearchParams();

    // 쿼리 스트링에서 값을 꺼내고, 없으면 기본값(1페이지, 10개씩)을 지정합니다.
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 20;

    const [list, setList] = useState<Post[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const totalPage = Math.ceil(total / size);

    useEffect(() => {
        const loadPosts = async () => {
            if (!categoryId) return;

            setIsLoading(true);
            try {
                // 파라미터로 받은 categoryId를 숫자로 변환하여 API 호출
                const data = await postApi.fetchPostListByCategory(Number(categoryId), page, size);
                setList(data.list);
                setTotal(data.total);
            } catch (error) {
                console.error("게시글 목록을 불러오는데 실패했습니다.", error);
                alert("게시글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        window.scrollTo({ top: 0, behavior: "smooth" });
        loadPosts().then(() => {});
    }, [categoryId, page, size]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({
            page: String(newPage),
            size: String(size),
        });
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    게시판 <small>총 {total}개의 글</small>
                </PostTitle>
                {isLoggedIn && (
                    <Button
                        color="primary"
                        variant="contained"
                        as={Link}
                        to={`/post/create/${categoryId}`}>
                        글쓰기
                    </Button>
                )}
            </PostPageHeader>

            <BoardWrapper>
                {isLoading ? (
                    <LoadingText>게시글을 불러오는 중입니다...</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width="10%">번호</BoardTh>
                                <BoardTh $width="50%">제목</BoardTh>
                                <BoardTh $width="15%">작성자</BoardTh>
                                <BoardTh $width="15%">작성일</BoardTh>
                                <BoardTh $width="10%">조회수</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <BoardTd
                                        colSpan={5}
                                        style={{ textAlign: "center", padding: "100px 0" }}>
                                        아직 작성된 게시글이 없습니다. 첫 글을 남겨보세요!
                                    </BoardTd>
                                </tr>
                            ) : (
                                list.map(post => (
                                    <tr key={post.id}>
                                        <BoardTd>{post.id}</BoardTd>
                                        <BoardTd className="title-cell">
                                            {/* 게시글 제목 클릭 시 상세 보기 페이지로 이동 */}
                                            <Link to={`/post/${post.id}`}>{post.title}</Link>
                                        </BoardTd>
                                        <BoardTd>{post.user.nickname}</BoardTd>
                                        <BoardTd>
                                            {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </BoardTd>
                                        <BoardTd>{post.views}</BoardTd>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>

            {/* 💡 하단 페이지네이션 영역 */}
            {total > 0 && (
                <Pagination
                    currentPage={page}
                    totalPage={totalPage}
                    onPageChange={handlePageChange}
                    maxVisiblePages={5} // 필요에 따라 10으로 늘려도 됩니다.
                />
            )}
        </PostContainer>
    );
}

export default PostListPage;
