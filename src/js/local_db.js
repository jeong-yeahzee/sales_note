
export async function DB_L_SHOP(){
    const param = {
        type: "all",
        query: "SELECT * FROM SHOP_T;"
    };
    return await db_request(param);
}

export async function DB_L_PRODUCT(){
    const param = {
        type: "all",
        query: "SELECT * FROM PRODUCT_T;"
    };
    return await db_request(param);
}

export async function DB_L_BRAND(){
    const param = {
        type: "all",
        query: "SELECT * FROM BRAND_T ORDER BY BRAND_NAME;"
    };
    return await db_request(param);
}

export async function DB_I_BRAND(data){
    const param = {
        type: "run",
        query: "INSERT INTO BRAND_T (BRAND_NAME,STATUS,MEMO) VALUES (?,?,?);",
        value: [data.BRAND_NAME, data.STATUS, data.MEMO]
    };
    return await db_request(param);
}

export async function DB_I_SHOP(){
    const param = {
        type: "run",
        query: "",
        value: []
    };
    return await db_request(param);
}

// 메인 프로세스에 sql 쿼리 요청
async function db_request(param){
    try{
        if(param.type === "run"){
            return await window.electron.db_run(param);
        }else{
            console.log(param);
            return await window.electron.db_all(param.query);
        }
    }catch (e) {
        console.error('DB 조회 실패:', e.message);
    }
}