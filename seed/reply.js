import { BASE_URL, ADMIN_TOKEN, fetchCategories } from "./config.js"; // 💡 공통 함수 임포트

const REPLY_CREATE_URL = `${BASE_URL}/reply/create`;

const replyTemplates = [
    "이건 솔직히 논란의 여지가 없다 ㅋㅋㅋ 무조건 1번이지!",
    "2번 고른 사람들 진짜 맛알못인가... 진지하게 이해가 안 가네.",
    "진지하게 과학적 근거를 대자면 1번이 맞음. 반박 시 내 말이 다 맞음.",
    "아니 2번이 진리인데 왜 표가 이거밖에 안 나옴? 집단 지성 다 죽었냐?",
    "와 실시간으로 투표 결과 박빙인 거 봐라 ㅋㅋㅋ 전장 웅장해진다.",
    "오늘도 평화로운 대난투 전장... 난 외롭게 2번에 한 표 던진다.",
];

/**
 * 💡 각 카테고리에 속한 게시글 목록을 가져오는 함수
 */
async function fetchPostsByCategory(categoryId) {
    try {
        // 이전에 설계했던 백엔드 목록 조회 스펙 (한 번에 50개씩 가져오도록 세팅)
        const response = await fetch(`${BASE_URL}/post/list/${categoryId}?page=1&size=50`);
        if (!response.ok) return [];
        const result = await response.json();

        // PaginationResponseType 구조에 맞게 list 추출 (백엔드 스펙에 따라 구조가 다르면 수정)
        return result.data.list || result.data;
    } catch (error) {
        console.error(`💥 [Category ID: ${categoryId}] 글 조회 실패:`, error.message);
        return [];
    }
}

/**
 * 특정 게시글에 무작위 댓글을 다는 함수
 */
async function generateReplies(postId, count) {
    for (let i = 0; i < count; i++) {
        try {
            const unique = Math.random().toString(36).slice(-3);
            const randomTemplate =
                replyTemplates[Math.floor(Math.random() * replyTemplates.length)];

            const dummyData = {
                postId: postId,
                content: `${randomTemplate} (${unique})`,
            };

            await fetch(REPLY_CREATE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
                body: JSON.stringify(dummyData),
            });
        } catch (error) {
            console.error("💥 댓글 생성 실패:", error.message);
        }
    }
}

/**
 * 💡 전체 카테고리와 게시글을 훑으며 100% 동적으로 작동하는 메인 프로세스
 */
async function runSeeder() {
    // 1. 공통 파일에서 카테고리 목록 들고오기
    const categories = await fetchCategories();

    if (!categories || categories.length === 0) {
        console.log("❌ 조회할 카테고리가 없습니다.");
        return;
    }

    console.log(`🚀 전체 ${categories.length}개 카테고리를 대상으로 자동 댓글 장전을 시작합니다.`);

    for (const category of categories) {
        // 2. 해당 카테고리에 속한 글 목록 동적 조회
        const posts = await fetchPostsByCategory(category.id);
        console.log(`\n📂 [카테고리: ${category.name}] 내에서 발견된 게시글 수: ${posts.length}개`);

        // 3. 발견된 모든 글을 순회하며 글당 5개씩 댓글 폭격
        for (const post of posts) {
            console.log(
                `   📝 [Post ID: ${post.id}] "${post.title.slice(0, 15)}..." 번 글에 댓글 작성 중...`,
            );
            await generateReplies(post.id, 5);
        }
    }

    console.log("\n🌟 [완료] 시스템에 존재하는 모든 게시글에 생명이 불어넣어졌습니다!");
}

runSeeder().then(() => {});
