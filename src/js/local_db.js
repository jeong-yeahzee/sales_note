
export async function DB_L_SHOP(){
    const param = {
        type: "all",
        query: "SELECT * FROM SHOP_T;"
    }
    const result = await db_request(param);
    console.log("select",result);
}

export async function DB_I_SHOP(){
    const param = {
        type: "run",
        query: "",
        value: []
    }
    const result = await db_request(param);
    console.log("insert",result);
}

// 메인 프로세스에 sql 쿼리 요청
async function db_request(param){
    try{
        if(param.type === "run"){
            return await window.electron.db_run(param);
        }else{
            return await window.electron.db_all(param);
        }
    }catch (e) {
        console.error('DB 조회 실패:', e.message);
    }
}