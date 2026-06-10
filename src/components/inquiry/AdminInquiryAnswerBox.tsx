import styled from "styled-components";
import { AdminButtonGroup, AdminDetailContent } from "../admin/admin.style.tsx";
import Button from "../common/button/Button.tsx";

interface AdminInquiryAnswerBoxProps {
    answer: string;
    answeredAt: string | null;
    onEdit: () => void;
    onDelete: () => Promise<void>;
}

function AdminInquiryAnswerBox({
    answer,
    answeredAt,
    onEdit,
    onDelete,
}: AdminInquiryAnswerBoxProps) {
    return (
        <AnswerDisplay>
            <AnswerHeader>
                <h4>관리자 답변</h4>
                <small>
                    답변일시: {answeredAt && new Date(answeredAt).toLocaleString("ko-KR")}
                </small>
            </AnswerHeader>
            <AdminDetailContent className="answer-content">{answer}</AdminDetailContent>

            <AdminButtonGroup $align="right" style={{ marginTop: "24px" }}>
                <Button variant={"contained"} color="primary" onClick={onEdit}>
                    답변 수정
                </Button>
                <Button variant="contained" color="error" onClick={onDelete}>
                    답변 삭제
                </Button>
            </AdminButtonGroup>
        </AnswerDisplay>
    );
}

export default AdminInquiryAnswerBox;

// --- Styled Components ---

const AnswerDisplay = styled.div`
    display: flex;
    flex-direction: column;

    .answer-content {
        padding: 16px 0 0 0;
    }
`;

const AnswerHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed ${({ theme }) => theme.colors.divider};
    padding-bottom: 16px;

    h4 {
        margin: 0;
        font-size: 18px;
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 700;
    }

    small {
        color: ${({ theme }) => theme.colors.secondary};
        font-size: 14px;
    }
`;
