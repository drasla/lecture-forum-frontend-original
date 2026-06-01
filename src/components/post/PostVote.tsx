import { useState } from "react";
import postApi from "../../api/user/postApi.ts";
import { useAuthStore } from "../../stores/auth/AuthStore.ts";
import type { Post } from "../../types/post.type.ts";
import { GiCrossedSwords } from "react-icons/gi";
import { LuDroplets, LuFlame, LuRotateCcw } from "react-icons/lu";
import {
    BattleGround,
    BattleTitle,
    ResultBar,
    ResultBarWrapper,
    ResultSection,
    ResultText,
    RevoteButton,
    VoteCard,
    VoteSection,
} from "./post.style.tsx";

interface PostVoteProps {
    post: Post;
    postId: number;
    onRefresh: () => Promise<void>; // 부모(PostDetailPage)의 loadPost를 실행하기 위한 함수
}

function PostVote({ post, postId, onRefresh }: PostVoteProps) {
    const { isLoggedIn } = useAuthStore();
    const [isVoting, setIsVoting] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    // 투표 기능이 없는 일반 글이거나 데이터가 없으면 렌더링하지 않음
    const hasVoteSystem = !!post.option1Text && !!post.option2Text;
    if (!hasVoteSystem || !post.vote) return null;

    const totalVotes = post.vote.totalCount || 0;
    const opt1Percent =
        totalVotes > 0 ? Math.round((post.vote.option1Count / totalVotes) * 100) : 50;
    const opt2Percent =
        totalVotes > 0 ? Math.round((post.vote.option2Count / totalVotes) * 100) : 50;

    const handleVote = async (option: number) => {
        if (!isLoggedIn) {
            alert("투표에 참여하려면 로그인이 필요합니다.");
            return;
        }

        setIsVoting(true);
        try {
            await postApi.votePost(postId, option);
            await onRefresh(); // 💡 부모 컴포넌트의 데이터를 새로고침하여 게이지 바 갱신
        } catch (error) {
            console.error("투표 실패 : ", error);
            alert("투표 처리 중 오류가 발생했습니다.");
        } finally {
            setIsVoting(false);
        }
    };

    const handleCancelVote = async () => {
        if (!window.confirm("투표를 취소하고 다시 선택하시겠습니까?")) return;

        setIsCanceling(true);
        try {
            await postApi.cancelVotePost(postId);
            await onRefresh();
        } catch (error) {
            console.error("투표 취소 실패 : ", error);
            alert("투표 취소 처리 중 오류가 발생했습니다.");
        } finally {
            setIsCanceling(false);
        }
    };

    return (
        <BattleGround>
            <BattleTitle>
                <GiCrossedSwords size={24} color={"#EF4444"} />
                당신의 선택은?
            </BattleTitle>

            {post.vote.hasVoted ? (
                <ResultSection>
                    <ResultBarWrapper>
                        <ResultBar $color={"#EF4444"} $width={`${opt1Percent}%`}>
                            <span className={"label"}>
                                <LuFlame /> {post.option1Text}
                            </span>
                            <span className={"percent"}>
                                {opt1Percent}% ({post.vote.option1Count}명)
                            </span>
                        </ResultBar>
                        <ResultBar $color={"#3B82F6"} $width={`${opt2Percent}%`}>
                            <span className={"label"}>
                                <LuDroplets /> {post.option2Text}
                            </span>
                            <span className={"percent"}>
                                {opt2Percent}% ({post.vote.option2Count}명)
                            </span>
                        </ResultBar>
                    </ResultBarWrapper>

                    <ResultText>소중한 한 표가 전황에 반영되었습니다.</ResultText>

                    <RevoteButton onClick={handleCancelVote} disabled={isCanceling}>
                        <LuRotateCcw size={16} /> 다시 투표하기
                    </RevoteButton>
                </ResultSection>
            ) : (
                <VoteSection>
                    <VoteCard $color={"#EF4444"} onClick={() => handleVote(1)} disabled={isVoting}>
                        <LuFlame size={32} />
                        <h3>{post.option1Text}</h3>
                        <p>클릭하여 1번에 투표</p>
                    </VoteCard>
                    <VoteCard $color={"#3B82F6"} onClick={() => handleVote(2)} disabled={isVoting}>
                        <LuDroplets size={32} />
                        <h3>{post.option2Text}</h3>
                        <p>클릭하여 2번에 투표</p>
                    </VoteCard>
                </VoteSection>
            )}
        </BattleGround>
    );
}

export default PostVote;
