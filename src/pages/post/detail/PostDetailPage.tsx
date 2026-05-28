import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import postApi from "../../../api/user/postApi.ts";
import { useAuthStore } from "../../../stores/auth/AuthStore.ts";
import Button from "../../../components/common/button/Button.tsx";
import type { Post } from "../../../types/post.type.ts";
import { GiCrossedSwords } from "react-icons/gi";
import {
    PostContainer,
    DetailWrapper,
    DetailHeader,
    DetailSubject,
    DetailInfo,
    DetailContent,
    ButtonGroup,
    LoadingText,
} from "../../../components/post/post.style.tsx";
import { LuDroplets, LuFlame } from "react-icons/lu";

function PostDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user: currentUser, isLoggedIn } = useAuthStore();

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVoting, setIsVoting] = useState(false);

    const loadPost = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await postApi.fetchPostById(Number(id));
            setPost(data);
        } catch (error) {
            console.error("게시글 로드 실패:", error);
            alert("존재하지 않거나 삭제된 게시글입니다.");
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        loadPost().then(() => {});
    }, [loadPost]);

    // 💡 투표 핸들러
    const handleVote = async (option: number) => {
        if (!isLoggedIn) {
            alert("투표에 참여하려면 로그인이 필요합니다.");
            return navigate("/login");
        }

        setIsVoting(true);
        try {
            await postApi.votePost(Number(id), option);
            // 투표 성공 시, 데이터를 다시 불러와 게이지 바를 업데이트합니다.
            await loadPost();
        } catch (error) {
            console.error("투표 실패:", error);
            alert("투표 처리 중 오류가 발생했습니다.");
        } finally {
            setIsVoting(false);
        }
    };

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>전장을 불러오는 중입니다...</LoadingText>
            </PostContainer>
        );
    }

    if (!post) return null;

    // 투표 퍼센테이지 계산 로직 (0으로 나누기 방지)
    const hasVoteSystem = !!post.option1Text && !!post.option2Text;
    const totalVotes = post.vote?.totalCount || 0;
    const opt1Percent =
        totalVotes > 0 ? Math.round((post.vote.option1Count / totalVotes) * 100) : 50;
    const opt2Percent = totalVotes > 0 ? 100 - opt1Percent : 50;

    return (
        <PostContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailSubject>{post.title}</DetailSubject>
                    <DetailInfo>
                        <div className="left-info">
                            <span>
                                <b>{post.user.nickname}</b>
                            </span>
                            <span>
                                {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className="right-info">
                            <span>조회 {post.views}</span>
                            {hasVoteSystem && <span>참여 {totalVotes}명</span>}
                        </div>
                    </DetailInfo>
                </DetailHeader>

                {/* 💡 본문 내용 */}
                <DetailContent>{post.content}</DetailContent>

                {/* 💡 대망의 토론(투표) 섹션 */}
                {hasVoteSystem && (
                    <BattleGround>
                        <BattleTitle>
                            <GiCrossedSwords size={24} color="#EF4444" />
                            당신의 선택은?
                        </BattleTitle>

                        {post.vote.hasVoted ? (
                            // ✅ 투표 완료 시: 결과 게이지 바 표시
                            <ResultSection>
                                <ResultBarWrapper>
                                    {/* 1번(Red) 게이지 */}
                                    <ResultBar $color="#EF4444" $width={`${opt1Percent}%`}>
                                        <span className="label">
                                            <LuFlame /> {post.option1Text}
                                        </span>
                                        <span className="percent">
                                            {opt1Percent}% ({post.vote.option1Count}명)
                                        </span>
                                    </ResultBar>
                                    {/* 2번(Blue) 게이지 */}
                                    <ResultBar $color="#3B82F6" $width={`${opt2Percent}%`}>
                                        <span className="percent">
                                            {opt2Percent}% ({post.vote.option2Count}명)
                                        </span>
                                        <span className="label">
                                            {post.option2Text} <LuDroplets />
                                        </span>
                                    </ResultBar>
                                </ResultBarWrapper>
                                <ResultText>소중한 한 표가 전황에 반영되었습니다!</ResultText>
                            </ResultSection>
                        ) : (
                            // ❎ 투표 전 시: 클릭 가능한 양진영 버튼 표시
                            <VoteSection>
                                <VoteCard
                                    $color="#EF4444"
                                    onClick={() => handleVote(1)}
                                    disabled={isVoting}>
                                    <LuFlame size={32} />
                                    <h3>{post.option1Text}</h3>
                                    <p>클릭하여 1번에 투표</p>
                                </VoteCard>

                                <VsBadge>VS</VsBadge>

                                <VoteCard
                                    $color="#3B82F6"
                                    onClick={() => handleVote(2)}
                                    disabled={isVoting}>
                                    <LuDroplets size={32} />
                                    <h3>{post.option2Text}</h3>
                                    <p>클릭하여 2번에 투표</p>
                                </VoteCard>
                            </VoteSection>
                        )}
                    </BattleGround>
                )}

                {/* 하단 제어 버튼 (목록, 수정, 삭제) */}
                <ButtonGroup style={{ marginTop: "48px" }}>
                    <Button
                        color="secondary"
                        variant={"contained"}
                        onClick={() => navigate(`/category/${post.categoryId}`)}>
                        목록으로
                    </Button>

                    {/* 내 글일 때만 수정/삭제 버튼 노출 */}
                    {currentUser?.id === post.userId && (
                        <>
                            <Button color="primary" variant={"text"}>
                                수정
                            </Button>
                            <Button color="error" variant={"contained"}>
                                삭제
                            </Button>
                        </>
                    )}
                </ButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default PostDetailPage;

// ==========================================
// ⚔️ 페이지 전용 커스텀 스타일 (대난투 UI)
// ==========================================

const BattleGround = styled.div`
    margin-top: 60px;
    padding: 32px;
    background-color: ${({ theme }) => theme.colors.background.default};
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.divider};
`;

const BattleTitle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: 32px;
`;

/* 1. 투표 전 UI */
const VoteSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    position: relative;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const VsBadge = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    background-color: ${({ theme }) => theme.colors.background.paper};
    border: 2px solid ${({ theme }) => theme.colors.divider};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 900;
    font-style: italic;
    color: ${({ theme }) => theme.colors.text.default};
    z-index: 2;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        position: static;
        transform: none;
        margin: 10px 0;
    }
`;

const VoteCard = styled.button<{ $color: string }>`
    flex: 1;
    width: 100%;
    padding: 40px 20px;
    background-color: ${({ theme }) => theme.colors.background.paper};
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: ${({ theme }) => theme.colors.text.default};

    svg {
        color: ${({ $color }) => $color};
    }

    h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        word-break: keep-all;
    }

    p {
        margin: 0;
        font-size: 14px;
        color: ${({ theme }) => theme.colors.text.disabled};
    }

    &:hover:not(:disabled) {
        border-color: ${({ $color }) => $color};
        transform: translateY(-4px);
        box-shadow: 0 10px 20px ${({ $color }) => `${$color}20`};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

/* 2. 투표 후 UI */
const ResultSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ResultBarWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 60px;
    border-radius: 30px;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.divider};
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ResultBar = styled.div<{ $color: string; $width: string }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    width: ${({ $width }) => $width};
    background-color: ${({ $color }) => $color};
    color: #ffffff;
    font-weight: 700;
    font-size: 15px;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    overflow: hidden;

    .label {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .percent {
        font-size: 18px;
    }
`;

const ResultText = styled.p`
    text-align: center;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.secondary};
    margin: 8px 0 0 0;
`;
