const ADMIN_TOKEN = "";
const API_URL = "http://localhost:8001/admin/user/create";

async function generateUsers(count) {
    for (let i = 1; i <= count; i++) {
        const unique = Date.now().toString().slice(-5) + i;
        const dummyData = {
            username: `user_${unique}`,
            password: "password123!",
            name: `유저${i}`,
            nickname: `닉네임_${unique}`,
            email: `user_${unique}@test.com`,
            gender: i % 2 === 0 ? "FEMALE" : "MALE",
            role: "USER",
        };

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
                body: JSON.stringify(dummyData),
            });
            console.log(`[${i}/${count}] ${res.ok ? "성공" : "실패"}: ${dummyData.username}`);
        } catch (e) {
            console.error("에러 발생:", e);
        }
    }
}

generateUsers(35).then(() => {});
