export const QR_S_TOTAL_STATISTIC = () => (`SELECT
    IFNULL((SELECT SUM(TOTAL_SALES_OUTSTANDING) FROM TBL_SHOP), 0) AS SUM_OUTSTANDING,
    IFNULL((SELECT SUM(TOTAL_SALES_PRICE_OUT) FROM TBL_SALES WHERE strftime('%Y-%m', SALES_DT) = strftime('%Y-%m', 'now')), 0) AS SUM_PRICE_OUT,
    IFNULL((SELECT SUM(TOTAL_SALES_DC_PRICE_OUT) FROM TBL_SALES WHERE strftime('%Y-%m', SALES_DT) = strftime('%Y-%m', 'now')), 0) AS SUM_DC_PRICE_OUT,
    IFNULL((SELECT SUM(CARD_AMOUNT) FROM TBL_PAYMENT WHERE strftime('%Y-%m', PAY_DT) = strftime('%Y-%m', 'now')), 0) AS SUM_CARD_AMOUNT,
    IFNULL((SELECT SUM(CASH_AMOUNT) FROM TBL_PAYMENT WHERE strftime('%Y-%m', PAY_DT) = strftime('%Y-%m', 'now')), 0) AS SUM_CASH_AMOUNT,
    IFNULL((SELECT SUM(DISCOUNT_AMOUNT) FROM TBL_PAYMENT WHERE strftime('%Y-%m', PAY_DT) = strftime('%Y-%m', 'now')), 0) AS SUM_DISCOUNT_AMOUNT,
    IFNULL((SELECT SUM(TOTAL_SALES_PRICE_OUT) FROM TBL_SALES WHERE strftime('%Y-%m', SALES_DT) = strftime('%Y-%m', 'now', '-1 month')), 0) AS PREV_SUM_PRICE_OUT,
    IFNULL((SELECT SUM(TOTAL_SALES_DC_PRICE_OUT) FROM TBL_SALES WHERE strftime('%Y-%m', SALES_DT) = strftime('%Y-%m', 'now', '-1 month')), 0) AS PREV_SUM_DC_PRICE_OUT,
    IFNULL((SELECT SUM(CARD_AMOUNT) FROM TBL_PAYMENT WHERE strftime('%Y-%m', PAY_DT) = strftime('%Y-%m', 'now', '-1 month')), 0) AS PREV_SUM_CARD_AMOUNT,
    IFNULL((SELECT SUM(CASH_AMOUNT) FROM TBL_PAYMENT WHERE strftime('%Y-%m', PAY_DT) = strftime('%Y-%m', 'now', '-1 month')), 0) AS PREV_SUM_CASH_AMOUNT,
    IFNULL((SELECT SUM(DISCOUNT_AMOUNT) FROM TBL_PAYMENT WHERE strftime('%Y-%m', PAY_DT) = strftime('%Y-%m', 'now', '-1 month')), 0) AS PREV_SUM_DISCOUNT_AMOUNT;`
);
// 상품 조건 검색
export const QR_S_PRODUCT_DC_PRICE = () => (`
        SELECT
            TP.BRAND_NO,
            TB.BRAND_NAME,
            TP.PRODUCT_NO,
            TP.PRODUCT_NAME,
            TP.PRICE_OUT AS SALES_PRICE_OUT,
            IFNULL(TPD.DISCOUNT_PERCENT, 0) AS DISCOUNT_PERCENT,
            IFNULL(TPD.DISCOUNT_PRICE, 0) AS DISCOUNT_PRICE,
            TP.STATUS
        FROM TBL_PRODUCT TP
                 LEFT JOIN TBL_BRAND TB ON TB.BRAND_NO = TP.BRAND_NO
                 LEFT JOIN TBL_PRODUCT_DC TPD ON
                    TPD.PRODUCT_NO = TP.PRODUCT_NO AND
                    TPD.SHOP_NO = ?
            WHERE TP.PRODUCT_NAME LIKE CONCAT('%', ?, '%');`);

// 판매 마스터번호 조회
export const QR_S_SALES_MASTER_NO = ()=>(`SELECT COALESCE((SELECT SEQ+1 FROM sqlite_sequence WHERE name='TBL_SALES'), 0) AS MASTER_NO;`);

// 납부내역 조회
export const QR_S_PAYMENT = ()=>(`SELECT * FROM TBL_PAYMENT WHERE PAY_NO = ?;`);

// 거래처 전체 조회
export const QR_L_SHOP = ()=>(`SELECT * FROM TBL_SHOP ORDER BY SHOP_NAME;`);
// 브랜드 전체 조회
export const QR_L_BRAND = ()=>(`SELECT * FROM TBL_BRAND ORDER BY BRAND_NAME;`);
// 상품 전체 조회
export const QR_L_PRODUCT = ()=>(`SELECT * FROM TBL_PRODUCT ORDER BY ORDER_NO, PRODUCT_NAME;`);

// 상품 할인율 조회
export const QR_L_PRODUCT_DC = ()=>(`
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
            TPD.PRODUCT_NO = TP.PRODUCT_NO AND 
            TPD.SHOP_NO = ?;`);

// 판매 조회
export const QR_L_SALES = ()=>(`
    SELECT *
    FROM TBL_SALES
    WHERE (SHOP_NO = ? OR ? IS NULL)
      AND SALES_DT BETWEEN ? AND ?;`);

// 납부/판매 조회
export const QR_L_SALES_PAYMENT = ()=>(`
    SELECT
        MAX(TS.SALES_DT) AS SHOW_DT,
        SUM(TS.TOTAL_SALES_DC_PRICE_OUT) AS TOTAL_SALES_AMOUNT,
        CASE
            WHEN MAX(TS.SALES_TYPE) = '1' THEN '판매'
            WHEN MAX(TS.SALES_TYPE) = '2' THEN '반품'
        END AS SALES_TYPE,
        '1' AS TYPE,
        NULL
    FROM TBL_SALES TS 
    WHERE SHOP_NO = ? AND SALES_DT BETWEEN ? AND ? 
    GROUP BY MASTER_NO
    UNION ALL
    SELECT
        TP.PAY_DT AS SHOW_DT,
        TP.PAYMENT_AMOUNT AS TOTAL_PAYMENT_AMOUNT,
        CASE
            WHEN TP.PAY_TYPE = '1' THEN '납부'
            WHEN TP.PAY_TYPE = '2' THEN '관리자 수정'
        END AS SALES_TYPE,
        CASE
            WHEN TP.PAY_TYPE = '1' THEN '2'
            WHEN TP.PAY_TYPE = '2' THEN '3'
        END AS TYPE,
        TP.PAY_NO
    FROM TBL_PAYMENT TP 
    WHERE SHOP_NO = ? AND PAY_DT BETWEEN ? AND ?
    ORDER BY SHOW_DT DESC;`);

// 거래처 삭제 내역 전체 조회
export const QR_BACKUP_L_SHOP = ()=>(`SELECT * FROM BACKUP_TBL_SHOP ORDER BY DELETE_DT DESC, SHOP_NAME;`);
// 브랜드 삭제 내역 전체 조회
export const QR_BACKUP_L_BRAND = ()=>(`SELECT * FROM BACKUP_TBL_BRAND ORDER BY DELETE_DT DESC, BRAND_NAME;`);
// 상품 삭제 내역 전체 조회
export const QR_BACKUP_L_PRODUCT = ()=>(`SELECT * FROM BACKUP_TBL_PRODUCT ORDER BY DELETE_DT DESC, PRODUCT_NAME;`);
// 판매 삭제 내역  조회
export const QR_BACKUP_L_SALES = ()=>(`
    SELECT *
    FROM BACKUP_TBL_SALES
    WHERE (SHOP_NO = ? OR ? IS NULL)
    ORDER BY DELETE_DT DESC, SALES_DT DESC;`);

// 거래처 추가/수정
export const QR_M_SHOP = ()=>(`
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

// 브랜드 추가/수정
export const QR_M_BRAND = ()=>(`
        INSERT OR REPLACE INTO TBL_BRAND (
            BRAND_NO,
            BRAND_NAME,
            STATUS,
            MEMO,
            LAST_UPDATE_DT
        ) VALUES (?,?,?,?,CURRENT_TIMESTAMP);`);

// 상품추가/수정
export const QR_M_PRODUCT = ()=>(`
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

// 할인율/할인가 정보 추가/수정
export const QR_M_PRODUCT_DC = ()=>(`
    INSERT OR REPLACE INTO TBL_PRODUCT_DC (
            SHOP_NO,
            BRAND_NO,
            PRODUCT_NO,
            DISCOUNT_PERCENT,
            DISCOUNT_PRICE,
            LAST_UPDATE_DT
        ) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP);`);

// 납부정보 정보 추가/수정
export const QR_M_PAYMENT = ()=>(`
    INSERT OR REPLACE INTO TBL_PAYMENT (
            PAY_NO,
            PAY_TYPE,
            SHOP_NO,
            CASH_AMOUNT,
            CARD_AMOUNT,
            DISCOUNT_AMOUNT,
            PAYMENT_AMOUNT,
            ADMIN_AMOUNT,
            TOTAL_CALC_AMOUNT,
            MEMO,
            PAY_DT,
            LAST_UPDATE_DT
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP);`);

// 판매 추가
export const QR_I_SALES = ()=>(`
    INSERT INTO TBL_SALES (
            MASTER_NO,
            SHOP_NO,
            SHOP_NAME,
            BRAND_NO,
            BRAND_NAME,
            PRODUCT_NO,
            PRODUCT_NAME,
            SALES_COUNT,
            DISCOUNT_PERCENT,
            DISCOUNT_PRICE,
            SALES_PRICE_OUT,
            SALES_DC_PRICE_OUT,
            TOTAL_SALES_PRICE_OUT,
            TOTAL_SALES_DC_PRICE_OUT,
            SALES_TYPE,
            SALES_DT
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`);

// 판매 수정
export const QR_U_SALES = ()=>(`
    UPDATE TBL_SALES SET
         SALES_COUNT = ?
        ,DISCOUNT_PERCENT = ?
        ,DISCOUNT_PRICE = ?
        ,SALES_PRICE_OUT = ?
        ,SALES_DC_PRICE_OUT = ?
        ,TOTAL_SALES_PRICE_OUT = ?
        ,TOTAL_SALES_DC_PRICE_OUT = ?
        ,SALES_DT = ?
    WHERE SALES_NO = ?;`);

// 거래처 삭제
export const QR_D_SHOP = ()=>(`DELETE FROM TBL_SHOP WHERE SHOP_NO = ?;`);

// 브랜드 삭제
export const QR_D_BRAND = ()=>(`DELETE FROM TBL_BRAND WHERE BRAND_NO = ?;`);

// 상품 삭제
export const QR_D_PRODUCT = ()=>(`DELETE FROM TBL_PRODUCT WHERE PRODUCT_NO = ?;`);

// 판매 삭제
export const QR_D_SALES = ()=>(`DELETE FROM TBL_SALES WHERE SALES_NO = ?;`);

// 납부 삭제
export const QR_D_PAYMENT = ()=>(`DELETE FROM TBL_PAYMENT WHERE PAY_NO = ?;`);

// 사업자번호 중복 여부 확인
export const QR_C_BUSINESS_LICENSE = ()=>(`SELECT EXISTS (SELECT 1 FROM TBL_SHOP WHERE BUSINESS_LICENSE = ?) AS IS_CHECK;`);

// 메인 프로세스에 sql 쿼리 요청 ( 조회용 )
export async function exec_all(data){
    try {
        console.log("data", data);
        const param = make_param(data);
        console.log("param", param);
        const result = await window.electron.db_all(param);
        console.log("db_all",result);
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
        console.log("db_all",result);
        return result[0];
    }catch (e) {
        console.error('DB 조회 실패:', e.message);
        return false;
    }
}

// 메인 프로세스에 sql 쿼리 요청 ( 추가/수정/삭제용 )
export async function exec_transaction(data){
    try {
        console.log("data", data);
        const param = array_make_param(data);
        console.log("param", param);
        const result = await window.electron.db_transaction(param);
        console.log("db_transaction",result);
        return result;
    }catch (e) {
        console.error('DB 조회 실패:', e.message);
        return false;
    }
}

function make_param(data){
    const param = {
        query: data.query,
        value: []
    }

    for(const key in data){
        if(key.indexOf("in") > -1){
            param.value.push(data[key]);
        }
    }

    return param;
}

function array_make_param(data){
    const param = {
        query: "",
        value: []
    }

    // 단건 저장일때 체크
    if(!Array.isArray(data)) data = [data];

    for(const value of data){
        const new_arr = [];

        if (param.query == "") param.query = value.query;

        for(const key in value){
            if(key.indexOf("in") > -1){
                new_arr.push(value[key]);
            }
        }

        param.value.push(new_arr);
    }

    return param;
}