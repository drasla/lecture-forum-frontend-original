import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import noticeApi from "../../api/user/noticeApi.ts";
import Pagination from "../../components/common/pagination/Pagination.tsx";
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
import type { Notice } from "../../types/notice.type.ts";

function NoticeListPage() {
    // 💡 URL의 ?page=1&size=10 을 읽고 쓰기 위한 훅
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 10; // 공지사항은 보통 10개씩 노출

    const [list, setList] = useState<Notice[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const totalPage = Math.ceil(total / size);

    useEffect(() => {
        const loadNotices = async () => {
            setIsLoading(true);
            try {
                const data = await noticeApi.getNotices(page, size);
                setList(data.list);
                setTotal(data.total);
            } catch (error) {
                console.error("공지사항 목록을 불러오는데 실패했습니다.", error);
                alert("공지사항을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        window.scrollTo({ top: 0, behavior: "smooth" });
        loadNotices().then(() => {});
    }, [page, size]);

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
                    공지사항 <small>새로운 소식을 확인하세요</small>
                </PostTitle>
                {/* 💡 사용자 측이므로 '글쓰기' 버튼은 제거합니다. */}
            </PostPageHeader>

            <BoardWrapper>
                {isLoading ? (
                    <LoadingText>공지사항을 불러오는 중입니다...</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width="10%">번호</BoardTh>
                                <BoardTh $width="70%">제목</BoardTh>
                                <BoardTh $width="20%">등록일</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <BoardTd
                                        colSpan={3}
                                        style={{ textAlign: "center", padding: "100px 0" }}>
                                        등록된 공지사항이 없습니다.
                                    </BoardTd>
                                </tr>
                            ) : (
                                list.map(notice => (
                                    <tr key={notice.id}>
                                        <BoardTd>{notice.id}</BoardTd>
                                        <BoardTd className="title-cell">
                                            {/* 💡 공지사항 상세 보기 페이지로 이동 */}
                                            <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
                                        </BoardTd>
                                        <BoardTd>
                                            {new Date(notice.createdAt).toLocaleDateString(
                                                "ko-KR",
                                                {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                },
                                            )}
                                        </BoardTd>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>

            {total > 0 && (
                <Pagination
                    currentPage={page}
                    totalPage={totalPage}
                    onPageChange={handlePageChange}
                    maxVisiblePages={5}
                />
            )}
        </PostContainer>
    );
}

export default NoticeListPage;
