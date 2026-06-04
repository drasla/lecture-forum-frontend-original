import { BASE_URL, ADMIN_TOKEN, fetchCategories } from "./config.js";

const POST_CREATE_URL = `${BASE_URL}/post/create`;

const debateTopics = [
    { title: "탕수육 먹을 때 소스는?", opt1: "무조건 부먹", opt2: "바삭하게 찍먹" },
    {
        title: "아이스 아메리카노 vs 따뜻한 아메리카노",
        opt1: "얼죽아 (아아)",
        opt2: "쪄죽따 (뜨아)",
    },
    { title: "치킨 먹을 때 닭다리 양보", opt1: "사랑한다면 가능", opt2: "부모님도 안 됨" },
    {
        title: "민트초코에 대한 당신의 견해는?",
        opt1: "신의 음식 (극호)",
        opt2: "치약 맛 오물 (불호)",
    },
    {
        title: "평생 한 가지만 먹어야 한다면?",
        opt1: "평생 짜장면만 먹기",
        opt2: "평생 짬뽕만 먹기",
    },
    {
        title: "깻잎 논쟁, 내 연인이 친구의 깻잎을 떼어준다면?",
        opt1: "매너일 뿐 괜찮다",
        opt2: "절대 안 됨 난리 남",
    },
    {
        title: "새우 논쟁, 내 연인이 친구의 새우를 까준다면?",
        opt1: "새우 정도야 쿨하게",
        opt2: "이혼/결별 사유임",
    },
    {
        title: "출근 시간 정시 도착의 기준은?",
        opt1: "9시 정각 문 통과",
        opt2: "8시 50분 착석 완료",
    },
];

async function generatePosts(categoryId, count) {
    for (let i = 0; i < count; i++) {
        try {
            const unique = Math.random().toString(36).slice(-3);
            const topic = debateTopics[i % debateTopics.length];

            const dummyData = {
                title: `${topic.title} [전장 코드: ${unique}]`,
                content:
                    `이 게시글은 토론대난투 시스템을 검증하기 위해 생성된 자동화 테스트 전장입니다.\n\n` +
                    `과연 여러분의 선택은 어느 쪽인가요?\n` +
                    `1번 [${topic.opt1}] 과 2번 [${topic.opt2}] 중 마음에 드는 진영에 투표하고,\n` +
                    `아래 댓글 창에서 치열하게 논리 제압을 시작해 주세요!\n\n` +
                    `※ 경고: 지나친 비방은 전장에서 퇴장당할 수 있습니다. (랜덤키: ${unique})`,
                categoryId: categoryId, // 💡 동적으로 넘겨받은 카테고리 ID 주입
                option1Text: topic.opt1,
                option2Text: topic.opt2,
            };

            const response = await fetch(POST_CREATE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
                body: JSON.stringify(dummyData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log(
                    `   [${i + 1}/${count}] 🎉 생성 성공 | 주제: ${topic.opt1} VS ${topic.opt2} (${unique})`,
                );
            } else {
                console.log(
                    `   [${i + 1}/${count}] ❌ 생성 실패 | 사유: ${result.message || "알 수 없음"}`,
                );
            }
        } catch (error) {
            console.error(`   [${i + 1}/${count}] 💥 네트워크 에러 발생:`, error.message);
        }
    }
}

/**
 * 💡 2. 메인 시더 실행 프로세스
 */
async function runSeeder() {
    // 백엔드로부터 실시간 카테고리 목록을 먼저 가져옴
    const categories = await fetchCategories();

    if (!categories || categories.length === 0) {
        console.log("❌ 생성된 카테고리가 존재하지 않습니다. 카테고리를 먼저 생성해 주세요.");
        return;
    }

    console.log(`총 ${categories.length}개의 카테고리를 발견했습니다.`);

    // 💡 발견한 모든 카테고리를 순회하면서 카테고리당 15개씩 글을 밀어넣음
    const postsPerCategory = 15;

    for (const category of categories) {
        console.log(`\n📂 [카테고리: ${category.name} (ID: ${category.id})] 전장 생성 시작!`);
        await generatePosts(category.id, postsPerCategory);
    }

    console.log("모든 카테고리에 대한 게시글 시딩 작업이 완전히 종료되었습니다!");
}

runSeeder().then(() => {});
