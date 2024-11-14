import {db} from "./main.js";

const shop_query = `CREATE TABLE IF NOT EXISTS SHOP_T (
                          SHOP_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                          SHOP_NAME TEXT NOT NULL,
                          STATUS INTEGER NOT NULL DEFAULT 1,
                          BUSINESS_LICENSE TEXT NOT NULL,
                          TEL TEXT,
                          MOBILE TEXT,
                          EMAIL TEXT,
                          ADDRESS1 TEXT,
                          ADDRESS2 TEXT,
                          ZIPCODE TEXT,
                          CEO_NAME TEXT,
                          MEMO TEXT,
                          FIRST_CREATE_DT TEXT NOT NULL,
                          LAST_UPDATE_DT TEXT NOT NULL
                        );`;

const brand_query = `CREATE TABLE IF NOT EXISTS BRAND_T (
                          BRAND_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                          BRAND_NAME TEXT NOT NULL,
                          STATUS INTEGER NOT NULL DEFAULT 1,
                          ORDER_NO INTEGER,
                          MEMO TEXT,
                          FIRST_CREATE_DT TEXT NOT NULL,
                          LAST_UPDATE_DT TEXT NOT NULL
                        );`;

const product_query = `CREATE TABLE IF NOT EXISTS PRODUCT_T (
                        BRAND_NO INTEGER,
                        PRODUCT_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                        PRODUCT_NAME TEXT NOT NULL,
                        MEMO TEXT,
                        PRICE_IN INTEGER NOT NULL DEFAULT 0,
                        PRICE_OUT INTEGER NOT NULL DEFAULT 0,
                        ORDER_NO TEXT,
                        STATUS INTEGER NOT NULL DEFAULT 1,
                        FIRST_CREATE_DT TEXT NOT NULL,
                        LAST_UPDATE_DT TEXT NOT NULL
                        );`;
const dc_query = `CREATE TABLE IF NOT EXISTS PRODUCT_DC_T (
                        BRAND_NO INTEGER NOT NULL,
                        PRODUCT_NO INTEGER NOT NULL,
                        SHOP_NO INTEGER NOT NULL,
                        DISCOUNT_PERCENT INTEGER NOT NULL DEFAULT 0,
                        DISCOUNT_PRICE INTEGER NOT NULL DEFAULT 0,
                        STATUS INTEGER NOT NULL DEFAULT 0,
                        FIRST_CREATE_DT TEXT NOT NULL,
                        LAST_UPDATE_DT TEXT NOT NULL
                        PRIMARY KEY (BRAND_NO,PRODUCT_NO,SHOP_NO)
                        );`;

const sales_query = `CREATE TABLE IF NOT EXISTS SALES_T (
                        MASTER_NO INTEGER NOT NULL,
                        SALES_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                        SHOP_NO INTEGER NOT NULL,
                        SHOP_NAME TEXT NOT NULL,
                        BRAND_NO INTEGER NOT NULL,
                        BRAND_NAME TEXT NOT NULL,
                        PRODUCT_NO INTEGER NOT NULL,
                        PRODUCT_NAME TEXT NOT NULL,
                        SALES_COUNT INTEGER NOT NULL,
                        DISCOUNT_PERCENT INTEGER NOT NULL DEFAULT 0,
                        DISCOUNT_PRICE INTEGER NOT NULL DEFAULT 0,
                        SALES_PRICE_OUT INTEGER NOT NULL,
                        SALES_DC_PRICE_OUT INTEGER NOT NULL,
                        TOTAL_SALES_PRICE_OUT INTEGER NOT NULL,
                        TOTAL_SALES_DC_PRICE_OUT INTEGER NOT NULL,
                        SALES_TYPE INTEGER NOT NULL DEFAULT 1,
                        SALES_DT TEXT NOT NULL,
                        FIRST_CREATE_DT TEXT NOT NULL,
                        LAST_UPDATE_DT TEXT NOT NULL
                        );`;

const payment_query = `CREATE TABLE IF NOT EXISTS PAYMENT_T (
                        PAY_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                        PAY_TYPE INTEGER NOT NULL DEFAULT 1,
                        SHOP_NO INTEGER NOT NULL,
                        CASH_AMOUNT INTEGER,
                        CARD_AMOUNT INTEGER,
                        DISCOUNT_AMOUNT INTEGER,
                        PAYMENT_AMOUNT INTEGER,
                        ADMIN_AMOUNT INTEGER,
                        MEMO TEXT,
                        PAY_DT TEXT NOT NULL,
                        FIRST_CREATE_DT TEXT NOT NULL,
                        LAST_UPDATE_DT TEXT NOT NULL
                        );`;

export function connect_db(){
    const table_obj = {
        "SHOP_T": shop_query,
        "BRAND_T": brand_query,
        "PRODUCT_T": product_query,
        "PRODUCT_DC_T": dc_query,
        "SALES_T": sales_query,
        "PAYMENT_T": payment_query
    };
}