// api/saveLog/index.js
const { CosmosClient } = require("@azure/cosmos");

// 환경 변수에서 DB 접속 정보를 가져옵니다 (보안)
const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const client = new CosmosClient(connectionString);

module.exports = async function (context, req) {
    try {
        // 1. DB와 컨테이너(테이블) 선택
        const database = client.database("PromptCraftDB");
        const container = database.container("StudyLogs");

        // 2. 프론트엔드에서 보낸 데이터 받기
        const logData = req.body;

        // 3. 데이터에 고유 ID와 날짜 추가
        logData.id = Date.now().toString(); 
        logData.timestamp = new Date().toISOString();

        // 4. 저장 실행
        const { resource: createdItem } = await container.items.create(logData);

        context.res = {
            status: 200,
            body: "로그 저장 성공! ID: " + createdItem.id
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "에러 발생: " + error.message
        };
    }
};
