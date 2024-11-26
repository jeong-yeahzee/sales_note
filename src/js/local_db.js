
// 거래처 전체 조회
export async function DB_L_SHOP(){
    const param = {
        query: "SELECT * FROM SHOP_T WHERE STATUS IN (0,1) ORDER BY SHOP_NAME;"
    };
    return await db_request(param, "all");
}

// 상품 전체 조회
export async function DB_L_PRODUCT(){
    const param = {
        query: "SELECT * FROM PRODUCT_T WHERE STATUS IN (0,1) ORDER BY ORDER_NO, PRODUCT_NAME;"
    };
    return await db_request(param, "all");
}

// 브랜드 전체 조회
export async function DB_L_BRAND(){
    const param = {
        query: "SELECT * FROM BRAND_T WHERE STATUS IN (0,1) ORDER BY BRAND_NAME;"
    };
    return await db_request(param, "all");
}

// 브랜드 추가
export async function DB_I_BRAND(data){
    const param = {
        query: "INSERT INTO BRAND_T (BRAND_NAME,STATUS,MEMO) VALUES (?,?,?);",
        value: [data.BRAND_NAME, data.STATUS, data.MEMO]
    };
    return await db_request(param, "run");
}

// 상품 추가
export async function DB_I_PRODUCT(data){
    const param = {
        query: "INSERT INTO PRODUCT_T " +
            "(BRAND_NO," +
            "PRODUCT_NAME," +
            "PRICE_IN," +
            "PRICE_OUT," +
            "ORDER_NO," +
            "STATUS," +
            "MEMO) " +
            "VALUES (?,?,?,?,?,?,?);",
        value: [
            data.BRAND_NO,
            data.PRODUCT_NAME,
            data.PRICE_IN,
            data.PRICE_OUT,
            data.ORDER_NO,
            data.STATUS,
            data.MEMO
        ]
    };
    return await db_request(param, "run");
}

// 상품 추가
export async function DB_I_SHOP(){
    const param = {
        query: "",
        value: []
    };
    return await db_request(param, "run");
}

// 브랜드 수정
export async function DB_U_BRAND(data){
    const param = {
        query: "UPDATE BRAND_T SET " +
            "BRAND_NAME = ?," +
            "STATUS = ?," +
            "MEMO = ? " +
            "WHERE BRAND_NO = ?;",
        value: [
            data.BRAND_NAME,
            data.STATUS,
            data.MEMO,
            data.BRAND_NO
        ]
    };
    return await db_request(param, "run");
}

// 브랜드 수정
export async function DB_U_PRODUCT(data){
    const param = {
        query: "UPDATE PRODUCT_T SET " +
            "BRAND_NO = ?," +
            "PRODUCT_NAME = ?," +
            "PRICE_IN = ?," +
            "PRICE_OUT = ?," +
            "ORDER_NO = ?," +
            "STATUS = ?," +
            "MEMO = ? " +
            "WHERE PRODUCT_NO = ?;",
        value: [
            data.BRAND_NO,
            data.PRODUCT_NAME,
            data.PRICE_IN,
            data.PRICE_OUT,
            data.ORDER_NO,
            data.STATUS,
            data.MEMO,
            data.PRODUCT_NO
        ]
    };
    return await db_request(param, "run");
}

// 브랜드 삭제 ( 실제로 삭제는 안하고 상태값만 변경 )
export async function DB_D_BRAND(data){
    const param = {
        query: "UPDATE BRAND_T SET STATUS = -1 WHERE BRAND_NO = ?;",
        value: [data.BRAND_NO]
    };
    return await db_request(param, "run");
}

// 상품 삭제 ( 실제로 삭제는 안하고 상태값만 변경 )
export async function DB_D_PRODUCT(data){
    const param = {
        query: "UPDATE PRODUCT_T SET STATUS = -1 WHERE PRODUCT_NO = ?;",
        value: [data.PRODUCT_NO]
    };
    return await db_request(param, "run");
}

// 메인 프로세스에 sql 쿼리 요청
async function db_request(param, type = ""){
    let result;
    try{
        if(type === "run"){
            result = await window.electron.db_run(param);
        }else if(type === "all"){
            result = await window.electron.db_all(param.query);
        }else if(type === "trans"){

        }
    }catch (e) {
        console.error('DB 조회 실패:', e.message);
        result = false;
    }finally {
        console.log("result",result);
        return result;
    }
}