import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import replyApi from "../../api/user/replyApi.ts";
import { useAuthStore } from "../../stores/auth/AuthStore.ts";
import type { Reply } from "../../types/reply.type.ts";
import {
    createReplySchema,
    type CreateReplyInputType,
} from "../../schemas/reply/createReplySchema.ts";
import Button from "../common/button/Button.tsx";
import ReplyPagination from "../common/pagination/ReplyPagination.tsx";
import {
    ReplyContainer,
    ReplyTitle,
    ReplyForm,
    ReplyTextarea,
    FormFooter,
    ErrorMessage,
    ReplyList,
    EmptyMessage,
    ReplyItem,
    ReplyHeader,
    ReplyContent,
} from "./reply.style.tsx";
import { LuMessageSquare } from "react-icons/lu";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
    const { user, isLoggedIn } = useAuthStore();
    const [replies, setReplies] = useState<Reply[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateReplyInputType>({
        resolver: zodResolver(createReplySchema),
        defaultValues: { content: "" },
    });

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

    const onSubmit = async (data: CreateReplyInputType) => {
        if (!isLoggedIn) {
            alert("댓글을 작성하려면 로그인이 필요합니다.");
            return;
        }

        setIsSubmitting(true);
        try {
            await replyApi.createReply(postId, data.content.trim());
            reset();
            await loadReplies(1);
        } catch (error) {
            console.error("댓글 작성 실패:", error);
            alert("댓글 작성 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (replyId: number) => {
        if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) return;

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

            <ReplyForm onSubmit={handleSubmit(onSubmit)}>
                <ReplyTextarea
                    placeholder={
                        isLoggedIn
                            ? "토론에 대한 의견을 남겨주세요."
                            : "로그인 후 댓글을 작성할 수 있습니다."
                    }
                    disabled={!isLoggedIn || isSubmitting}
                    $hasError={!!errors.content}
                    {...register("content")}
                />
                <FormFooter>
                    {errors.content ? (
                        <ErrorMessage>{errors.content.message}</ErrorMessage>
                    ) : (
                        <div />
                    )}
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={!isLoggedIn || isSubmitting}>
                        {isSubmitting ? "등록 중..." : "댓글 등록"}
                    </Button>
                </FormFooter>
            </ReplyForm>

            <ReplyList>
                {isLoading ? (
                    <EmptyMessage>댓글을 불러오는 중입니다...</EmptyMessage>
                ) : replies.length === 0 ? (
                    <EmptyMessage>가장 먼저 토론에 참여해 보세요!</EmptyMessage>
                ) : (
                    replies.map(reply => (
                        <ReplyItem key={reply.id}>
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
                                {user?.id === reply.userId && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(reply.id)}>
                                        삭제
                                    </button>
                                )}
                            </ReplyHeader>
                            <ReplyContent>{reply.content}</ReplyContent>
                        </ReplyItem>
                    ))
                )}
            </ReplyList>

            {/* 💡 공용 페이지네이션 컴포넌트 사용 */}
            <ReplyPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={loadReplies}
            />
        </ReplyContainer>
    );
}

export default PostReply;
