import {db} from "./main.js";

export function connect_db(){
    const table_obj = {
        "SHOP_T": "",
        "BRAND_T": "CREATE TABLE IF NOT EXISTS BRAND_T ()",
        "PRODUCT_T": "CREATE TABLE IF NOT EXISTS PRODUCT_T ()",
        "PRODUCT_DC_T": "CREATE TABLE IF NOT EXISTS PRODUCT_DC_T ()",
        "ORDER_TABLE": "CREATE TABLE IF NOT EXISTS ORDER_TABLE ()",
        "PAYMENT_TABLE": "CREATE TABLE IF NOT EXISTS PAYMENT_TABLE ()"
    }

    table_obj.SHOP_T = `CREATE TABLE IF NOT EXISTS SHOP_T (
                          SHOP_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                          SHOP_NAME TEXT,
                          STATUS TEXT DEFAULT 1,
                          BUSINESS_LICENSE TEXT,
                          TEL TEXT,
                          MOBILE TEXT,
                          EMAIL TEXT,
                          ADDRESS1 TEXT,
                          ADDRESS2 TEXT,
                          ZIPCODE TEXT,
                          CEO_NAME TEXT,
                          MEMO TEXT,
                          FIRST_CREATE_DT TEXT,
                          LAST_UPDATE_DT TEXT,
                          UNIQUE(SHOP_NO)
                        );`;
    table_obj.BRAND_T = `CREATE TABLE IF NOT EXISTS BRAND_T (
                          BRAND_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                          BRAND_NAME TEXT,
                          STATUS TEXT DEFAULT 1,
                          ORDER_NO INTEGER,
                          MEMO TEXT,
                          FIRST_CREATE_DT TEXT,
                          LAST_UPDATE_DT TEXT,
                          UNIQUE(BRAND_NO)
                        );`;
}