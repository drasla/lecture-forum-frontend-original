import { useAuthStore } from "../../../stores/auth/AuthStore.ts";
import type { Reply } from "../../../types/reply.type.ts";
import { ReplyContent, ReplyHeader, StyledReplyItem } from "../reply.style.tsx";

interface ReplyItemProps {
    reply: Reply;
    onDelete: (replyId: number) => Promise<void>;
}

function ReplyItem({ reply, onDelete }: ReplyItemProps) {
    const { user } = useAuthStore();
    const isAuthor = user?.id === reply.userId;

    const handleDelete = async () => {
        if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) return;
        await onDelete(reply.id);
    };

    return (
        <StyledReplyItem>
            <ReplyHeader>
                <div className="author-info">
                    <strong>{reply.user.nickname}</strong>
                    <span className="date">
                        {new Date(reply.createdAt).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
                {/* 본인 댓글일 때만 버튼 그룹 노출 */}
                {isAuthor && (
                    <div className="action-buttons">
                        {/* 💡 나중에 여기에 수정 버튼이 추가될 예정입니다! */}
                        <button className="delete-btn" onClick={handleDelete}>
                            삭제
                        </button>
                    </div>
                )}
            </ReplyHeader>
            <ReplyContent>{reply.content}</ReplyContent>
        </StyledReplyItem>
    );
}

export default ReplyItem;
