
// 거래처 전체 조회
export async function DB_L_SHOP(){
    const query_str = `SELECT * FROM TBL_SHOP ORDER BY SHOP_NAME;`;
    const param = {
        query: query_str
    };

    return await db_request(param, "all");
}

// 상품 전체 조회
export async function DB_L_PRODUCT(){
    const query_str = `SELECT * FROM TBL_PRODUCT ORDER BY ORDER_NO, PRODUCT_NAME;`;
    const param = {
        query: query_str
    };

    return await db_request(param, "all");
}

// 브랜드 전체 조회
export async function DB_L_BRAND(){
    const query_str = `SELECT * FROM TBL_BRAND ORDER BY BRAND_NAME;`;
    const param = {
        query: query_str
    };

    return await db_request(param, "all");
}

// 브랜드 추가
export async function DB_I_BRAND(data){
    const query_str = `
        INSERT INTO TBL_BRAND (
            BRAND_NAME,
            STATUS,
            MEMO
        ) VALUES (?, ?, ?);`;
    const param = {
        query: query_str,
        value: [data.BRAND_NAME, data.STATUS, data.MEMO]
    };

    return await db_request(param, "run");
}

// 상품 추가
export async function DB_I_PRODUCT(data){
    const query_str = `
        INSERT INTO TBL_PRODUCT (
            BRAND_NO,
            PRODUCT_NAME,
            PRICE_IN,
            PRICE_OUT,
            ORDER_NO,
            STATUS,
            MEMO 
        ) VALUES (?,?,?,?,?,?,?);`;
    const param = {
        query: query_str,
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
    const query_str = `
        INSERT INTO TBL_SHOP (
            SHOP_NAME,
            STATUS,
            BUSINESS_LICENSE,
            TEL,
            MOBILE,
            EMAIL,
            ADDRESS1,
            ADDRESS2,
            ZIPCODE,
            CEO_NAME,
            MEMO
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?);`;
    const param = {
        query: query_str,
        value: [
            data.SHOP_NAME,
            data.STATUS,
            data.BUSINESS_LICENSE,
            data.TEL,
            data.MOBILE,
            data.EMAIL,
            data.ADDRESS1,
            data.ADDRESS2,
            data.ZIPCODE,
            data.CEO_NAME,
            data.MEMO
        ]
    };

    return await db_request(param, "run");
}

// 브랜드 수정
export async function DB_U_BRAND(data){
    const query_str = `
        UPDATE TBL_BRAND SET
            BRAND_NAME = ?,
            STATUS = ?,
            MEMO = ?,
            LAST_UPDATE_DT = CURRENT_TIMESTAMP
        WHERE BRAND_NO = ?`;
    const param = {
        query: query_str,
        value: [
            data.BRAND_NAME,
            data.STATUS,
            data.MEMO,
            data.BRAND_NO
        ]
    };

    return await db_request(param, "run");
}

// 상품 수정
export async function DB_U_PRODUCT(data){
    const query_str = `
        UPDATE TBL_PRODUCT SET 
            BRAND_NO = ?,
            PRODUCT_NAME = ?,
            PRICE_IN = ?,
            PRICE_OUT = ?,
            ORDER_NO = ?,
            STATUS = ?,
            MEMO = ? ,
            LAST_UPDATE_DT = CURRENT_TIMESTAMP
        WHERE PRODUCT_NO = ?;`;
    const param = {
        query: query_str,
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

// 거래처 수정
export async function DB_U_SHOP(data){
    const query_str = `
        UPDATE TBL_SHOP SET 
            SHOP_NAME = ?,
            STATUS = ?,
            BUSINESS_LICENSE = ?,
            TEL = ?,
            MOBILE = ?,
            EMAIL = ?,
            ADDRESS1 = ?,
            ADDRESS2 = ?,
            ZIPCODE = ?,
            CEO_NAME = ?,
            MEMO = ?,
            LAST_UPDATE_DT = CURRENT_TIMESTAMP
        WHERE SHOP_NO = ?;`;
    const param = {
        query: query_str,
        value: [
            data.SHOP_NAME,
            data.STATUS,
            data.BUSINESS_LICENSE,
            data.TEL,
            data.MOBILE,
            data.EMAIL,
            data.ADDRESS1,
            data.ADDRESS2,
            data.ZIPCODE,
            data.CEO_NAME,
            data.MEMO,
            data.SHOP_NO
        ]
    };
    
    return await db_request(param, "run");
}

// 브랜드 삭제
export async function DB_D_BRAND(data){
    const query_str = `DELETE FROM TBL_BRAND WHERE BRAND_NO = ?;`;
    const param = {
        query: query_str,
        value: [data.BRAND_NO]
    };
    return await db_request(param, "run");
}

// 상품 삭제
export async function DB_D_PRODUCT(data){
    const query_str = `DELETE FROM TBL_PRODUCT WHERE PRODUCT_NO = ?;`;
    const param = {
        query: query_str,
        value: [data.PRODUCT_NO]
    };
    return await db_request(param, "run");
}

// 거래처 삭제
export async function DB_D_SHOP(data){
    const query_str = `DELETE FROM TBL_SHOP WHERE SHOP_NO = ?;`;
    const param = {
        query: query_str,
        value: [data.SHOP_NO]
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