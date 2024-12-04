
// 상품 조건 검색
export const QUERY_S_PRODUCT_DC_PRICE = (type = "all") => {
    let result_str = `
        SELECT
            TP.BRAND_NO,
            TP.PRODUCT_NO,
            TP.PRODUCT_NAME,
            TP.PRICE_IN,
            TP.PRICE_OUT,
            IFNULL(TPD.DISCOUNT_PERCENT, 0) AS DISCOUNT_PERCENT,
            IFNULL(TPD.DISCOUNT_PRICE, 0) AS DISCOUNT_PRICE,
            TP.STATUS
        FROM TBL_PRODUCT TP
                 LEFT JOIN TBL_PRODUCT_DC TPD ON
            TPD.BRAND_NO = TP.BRAND_NO AND
            TPD.PRODUCT_NO = TP.PRODUCT_NO AND
            TPD.SHOP_NO = ?`;

    if(type === "number" || type === "all"){
        result_str += ` WHERE PRODUCT_NO = ?`;
    }
    if(type === "all"){
        result_str += ` AND `;
    }else{
        result_str += ` WHERE `;
    }
    if(type === "text" || type === "all"){
        result_str += `PRODUCT_NAME LIKE ?`;
    }

    return result_str + ";";
};

// 거래처 전체 조회
export const QUERY_L_SHOP = ()=>(`SELECT * FROM TBL_SHOP ORDER BY SHOP_NAME;`);
// 브랜드 전체 조회
export const QUERY_L_BRAND = ()=>(`SELECT * FROM TBL_BRAND ORDER BY BRAND_NAME;`);
// 상품 전체 조회
export const QUERY_L_PRODUCT = ()=>(`SELECT * FROM TBL_PRODUCT ORDER BY ORDER_NO, PRODUCT_NAME;`);

// 상품 할인율 조회
export const QUERY_L_DISCOUNT_PRICE = ()=>(`
        SELECT
        TP.BRAND_NO,
        TP.PRODUCT_NO,
        TP.PRODUCT_NAME,
        TP.PRICE_IN,
        TP.PRICE_OUT,
        IFNULL(TPD.DISCOUNT_PERCENT, 0) AS DISCOUNT_PERCENT,
        IFNULL(TPD.DISCOUNT_PRICE, 0) AS DISCOUNT_PRICE,
        TP.STATUS
        FROM TBL_PRODUCT TP
        LEFT JOIN TBL_PRODUCT_DC TPD ON 
            TPD.BRAND_NO = TP.BRAND_NO AND 
            TPD.PRODUCT_NO = TP.PRODUCT_NO AND 
            TPD.SHOP_NO = ?;`);

// 거래처 추가
export const QUERY_M_SHOP = ()=>(`
        INSERT OR REPLACE INTO TBL_SHOP (
            SHOP_NO,
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
            MEMO,
            LAST_UPDATE_DT
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP);`);

// 브랜드 추가
export const QUERY_M_BRAND = ()=>(`
        INSERT OR REPLACE INTO TBL_BRAND (
            BRAND_NO,
            BRAND_NAME,
            STATUS,
            MEMO,
            LAST_UPDATE_DT
        ) VALUES (?,?,?,?,CURRENT_TIMESTAMP);`);

// 상품추가
export const QUERY_M_PRODUCT = ()=>(`
    INSERT OR REPLACE INTO TBL_PRODUCT (
            BRAND_NO,
            PRODUCT_NO,
            PRODUCT_NAME,
            PRICE_IN,
            PRICE_OUT,
            ORDER_NO,
            STATUS,
            MEMO,
            LAST_UPDATE_DT
        ) VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP);`);

// 할인율/할인가 정보 추가
export const QUERY_M_PRODUCT_DC = ()=>(`
    INSERT OR REPLACE INTO TBL_PRODUCT_DC (
            SHOP_NO,
            BRAND_NO,
            PRODUCT_NO,
            DISCOUNT_PERCENT,
            DISCOUNT_PRICE,
            LAST_UPDATE_DT
        ) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP);`);

// 거래처 삭제
export const QUERY_D_SHOP = ()=>(`DELETE FROM TBL_SHOP WHERE SHOP_NO = ?;`);

// 브랜드 삭제
export const QUERY_D_BRAND = ()=>(`DELETE FROM TBL_BRAND WHERE BRAND_NO = ?;`);

// 상품 삭제
export const QUERY_D_PRODUCT = ()=>(`DELETE FROM TBL_PRODUCT WHERE PRODUCT_NO = ?;`);

// 사업자번호 중복 여부 확인
export const QUERY_C_BUSINESS_LICENSE = ()=>(`SELECT EXISTS (SELECT 1 FROM TBL_SHOP WHERE BUSINESS_LICENSE = ?) AS IS_CHECK;`);

// 메인 프로세스에 sql 쿼리 요청 ( 조회용 )
export async function exec_all(param){
    try {
        console.log(param);
        const result = await window.electron.db_all(param);
        return result;
    }catch (e) {
        console.error('DB 조회 실패:', e.message);
        return false;
    }
}

// 메인 프로세스에 sql 쿼리 요청 ( 조회용 )
export async function exec_check(param){
    try {
        console.log(param);
        const result = await window.electron.db_all(param);
        return result[0];
    }catch (e) {
        console.error('DB 조회 실패:', e.message);
        return false;
    }
}

// 메인 프로세스에 sql 쿼리 요청 ( 추가/수정/삭제용 )
export async function exec_transaction(param){
    try {
        const result = await window.electron.db_transaction(param);
        console.log("db_transaction",result);
        return result;
    }catch (e) {
        console.error('DB 조회 실패:', e.message);
        return false;
    }
}