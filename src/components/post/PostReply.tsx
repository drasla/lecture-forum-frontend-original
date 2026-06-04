import { useCallback, useEffect, useState } from "react";
import replyApi from "../../api/user/replyApi.ts";
import type { Reply } from "../../types/reply.type.ts";
import ReplyPagination from "../common/pagination/ReplyPagination.tsx";
import { LuMessageSquare } from "react-icons/lu";
import { ReplyContainer, ReplyTitle, ReplyList, EmptyMessage } from "./reply.style.tsx";
import ReplyForm from "./reply/ReplyForm.tsx";
import ReplyItem from "./reply/ReplyItem.tsx";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
    const [replies, setReplies] = useState<Reply[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const loadReplies = useCallback(
        async (page: number) => {
            setIsLoading(true);
            try {
                const result = await replyApi.getReplies(postId, page, pageSize);
                setReplies(result.list);
                setTotalCount(result.total);
                setCurrentPage(page);
            } catch (error) {
                console.error("댓글 불러오기 실패:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [postId],
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadReplies(1).then(() => {});
    }, [loadReplies]);

    const handleDelete = async (replyId: number) => {
        try {
            await replyApi.deleteReply(replyId);
            await loadReplies(currentPage);
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
            alert("댓글 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <ReplyContainer>
            <ReplyTitle>
                <LuMessageSquare size={20} /> 댓글 <span className="count">{totalCount}</span>
            </ReplyTitle>

            {/* 💡 1. 분리된 작성 폼 렌더링 */}
            <ReplyForm postId={postId} onSuccess={() => loadReplies(1)} />

            <ReplyList>
                {isLoading ? (
                    <EmptyMessage>댓글을 불러오는 중입니다...</EmptyMessage>
                ) : replies.length === 0 ? (
                    <EmptyMessage>가장 먼저 토론에 참여해 보세요!</EmptyMessage>
                ) : (
                    /* 💡 2. 분리된 개별 댓글 아이템 렌더링 */
                    replies.map(reply => (
                        <ReplyItem key={reply.id} reply={reply} onDelete={handleDelete} />
                    ))
                )}
            </ReplyList>

            <ReplyPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={loadReplies}
            />
        </ReplyContainer>
    );
}

export default PostReply;
