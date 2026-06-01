import styled from "styled-components";

interface PostReplyProps {
    postId: number;
}

function PostReply({ postId }: PostReplyProps) {
    return (
        <ReplyContainer>
            <ReplyTitle>💬 댓글</ReplyTitle>

            {/* TODO: 여기에 댓글 작성 폼과 댓글 리스트가 들어갈 예정입니다. */}
            <div style={{ padding: "40px 0", textAlign: "center", color: "#888" }}>
                댓글 기능이 곧 추가됩니다! (Post ID: {postId})
            </div>
        </ReplyContainer>
    );
}

export default PostReply;

const ReplyContainer = styled.div`
    margin-top: 40px;
    padding-top: 32px;
    border-top: 2px solid ${({ theme }) => theme.colors.divider};
`;

const ReplyTitle = styled.h3`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
    margin: 0 0 24px 0;
`;
