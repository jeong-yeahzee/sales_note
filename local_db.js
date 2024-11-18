

// 메인 프로세스에 sql 쿼리 요청
async function db_request(query){
    try{
        return await window.electron.db_query(query);
    }catch (e) {
        console.error('DB 조회 실패:', error);
    }
}