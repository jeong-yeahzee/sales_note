const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const static = require("node-static");
const http = require("http");
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let main_window;
// SQLite 데이터베이스 파일 경로
const db_path = (process.env.NODE_ENV === "development") ? path.join(__dirname, "sales_note_db.sqlite") : path.join(app.getPath("userData"), "sales_note_db.sqlite");
// 데이터베이스 연결 (없으면 자동 생성됨)
const db = new sqlite3.Database(db_path);
let server;

app.on("ready", async ()=>{
  main_window = new BrowserWindow({
    width: 1200,
    height: 768,
    icon: path.join(__dirname, "favicon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // 메뉴바 없애기
  Menu.setApplicationMenu(null);

  // 데이터베이스 초기화
  await init_db();

  // 보여줄 화면
  if (process.env.NODE_ENV === "development") main_window.webContents.openDevTools();
  else {
    // 정적 파일 서버를 위한 객체 생성
    const file = new static.Server(path.join(__dirname, "dist"));

    server = http.createServer(function (req, res) {
      // 요청에 대해 파일을 서빙
      file.serve(req, res);
    }).listen(3000, () => {});
  }

  await main_window.loadURL("http://localhost:3000");
});

app.on("window-all-closed", () => {
  if (process.platform !== 'darwin'){
    if(server){
      server.close();
    }
    db.close();
    app.quit();
  }
});

// DB 쿼리 결과를 렌더러로 전달하는 IPC 핸들러 ( 조회 )
ipcMain.handle('db-all', (event, param) => {
  return new Promise((resolve, reject) => {
    db.all(param.query, param.value, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});
// DB 쿼리 결과를 렌더러로 전달하는 IPC 핸들러 ( 추가,수정,삭제 )
ipcMain.handle('db-run', (event, param) => {
  return new Promise((resolve, reject) => {
    db.run(param.query, param.value, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
});
// DB 쿼리 결과를 렌더러로 전달하는 IPC 핸들러 ( 추가,수정,삭제 다건 실행 )
ipcMain.handle('db-transaction', (event, param) => {
  return new Promise((resolve, reject) => {


    db.serialize(() => {

      db.run("BEGIN TRANSACTION"); // 트랜잭션 시작

      let rollback = false; // 오류 여부 rollback/commit

      // 여러 쿼리를 실행
      param.value.forEach((data) => {
        db.run(param.query, data, function(err) {
            if (err) {
              rollback = true; // 오류 발생
              console.error("Error executing query:", err);
              return; // 오류가 발생하면 더 이상 실행하지 않음
            }
          }
        );
      });

      // 오류가 발생한 경우 롤백
      if (rollback) {

        db.run("ROLLBACK", (err) => {
          if (err) {
            reject(false);
          } else {
            reject(false);
          }
        });

      } else {

        db.run("COMMIT", (err) => {
          if (err) {
            reject(false);
          } else {
            resolve(true);
          }
        });

      }

    });
  });
});

// 데이터베이스 초기화 (테이블 생성/트리거 생성)
async function init_db(){
  const table = create_table_query();
  const trigger = create_trigger_query();

  // 여러 테이블을 한 번에 생성
  return new Promise((resolve, reject) => {
    db.exec(table, (err) => {
      if (err) {
        console.error("[TABLE_CREATE_FAIL]", err);
        reject(err);
      } else {
        console.log("[TABLE_CREATE_SUCCESS]");

        // 여러 트리거 한 번에 생성
        db.exec(trigger, (err) => {
          if (err) {
            console.error("[TRIGGER_CREATE_FAIL]", err);
            reject(err);
          } else {
            console.log("[TRIGGER_CREATE_SUCCESS]");
            resolve(); // 데이터베이스 초기화 완료
          }
        });
      }
    });
  });
}

// 테이블 생성하는 쿼리
function create_table_query(){
  const shop = `CREATE TABLE IF NOT EXISTS TBL_SHOP (
                  SHOP_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                  SHOP_NAME TEXT NOT NULL,
                  STATUS TEXT NOT NULL DEFAULT '1',
                  BUSINESS_LICENSE TEXT NOT NULL,
                  TEL TEXT,
                  MOBILE TEXT,
                  EMAIL TEXT,
                  ADDRESS1 TEXT,
                  ADDRESS2 TEXT,
                  ZIPCODE TEXT,
                  CEO_NAME TEXT,
                  MEMO TEXT,
                  TOTAL_SALES_OUTSTANDING INTEGER NOT NULL DEFAULT 0,
                  FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );`;

const brand = `CREATE TABLE IF NOT EXISTS TBL_BRAND (
                BRAND_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                BRAND_NAME TEXT NOT NULL,
                STATUS TEXT NOT NULL DEFAULT '1',
                ORDER_NO INTEGER,
                MEMO TEXT,
                FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
              );`;

const product = `CREATE TABLE IF NOT EXISTS TBL_PRODUCT (
                  BRAND_NO INTEGER,
                  PRODUCT_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                  PRODUCT_NAME TEXT NOT NULL,
                  MEMO TEXT,
                  PRICE_IN INTEGER NOT NULL DEFAULT 0,
                  PRICE_OUT INTEGER NOT NULL DEFAULT 0,
                  ORDER_NO INTEGER,
                  STATUS TEXT NOT NULL DEFAULT '1',
                  FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                  );`;

const dc = `CREATE TABLE IF NOT EXISTS TBL_PRODUCT_DC (
              BRAND_NO INTEGER,
              PRODUCT_NO INTEGER NOT NULL,
              SHOP_NO INTEGER NOT NULL,
              DISCOUNT_PERCENT INTEGER NOT NULL DEFAULT 0,
              DISCOUNT_PRICE INTEGER NOT NULL DEFAULT 0,
              FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
              LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (PRODUCT_NO,SHOP_NO)
              );`;

const sales = `CREATE TABLE IF NOT EXISTS TBL_SALES (
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
                SALES_TYPE TEXT NOT NULL DEFAULT '1',
                SALES_DT TEXT NOT NULL,
                FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );`;

const payment = `CREATE TABLE IF NOT EXISTS TBL_PAYMENT (
                  PAY_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                  PAY_TYPE TEXT NOT NULL DEFAULT '1',
                  SHOP_NO INTEGER NOT NULL,
                  CASH_AMOUNT INTEGER,
                  CARD_AMOUNT INTEGER,
                  DISCOUNT_AMOUNT INTEGER,
                  PAYMENT_AMOUNT INTEGER,
                  ADMIN_AMOUNT INTEGER,
                  TOTAL_CALC_AMOUNT INTEGER,
                  MEMO TEXT,
                  PAY_DT TEXT NOT NULL,
                  FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                  );`;

const backup_shop = `CREATE TABLE IF NOT EXISTS BACKUP_TBL_SHOP (
                      DELETE_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                      SHOP_NO INTEGER NOT NULL,
                      SHOP_NAME TEXT NOT NULL,
                      STATUS TEXT NOT NULL,
                      BUSINESS_LICENSE TEXT NOT NULL,
                      TEL TEXT,
                      MOBILE TEXT,
                      EMAIL TEXT,
                      ADDRESS1 TEXT,
                      ADDRESS2 TEXT,
                      ZIPCODE TEXT,
                      CEO_NAME TEXT,
                      MEMO TEXT,
                      TOTAL_SALES_OUTSTANDING INTEGER NOT NULL DEFAULT 0,
                      FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      DELETE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                    );`;

const backup_brand = `CREATE TABLE IF NOT EXISTS BACKUP_TBL_BRAND (
                        DELETE_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                        BRAND_NO INTEGER NOT NULL,
                        BRAND_NAME TEXT NOT NULL,
                        STATUS TEXT NOT NULL,
                        ORDER_NO INTEGER,
                        MEMO TEXT,
                        FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        DELETE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                      );`;

const backup_product = `CREATE TABLE IF NOT EXISTS BACKUP_TBL_PRODUCT (
                          DELETE_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                          BRAND_NO INTEGER,
                          PRODUCT_NO INTEGER NOT NULL,
                          PRODUCT_NAME TEXT NOT NULL,
                          MEMO TEXT,
                          PRICE_IN INTEGER NOT NULL,
                          PRICE_OUT INTEGER NOT NULL,
                          ORDER_NO INTEGER,
                          STATUS TEXT NOT NULL,
                          FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          DELETE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                        );`;

const backup_sales = `CREATE TABLE IF NOT EXISTS BACKUP_TBL_SALES (
                        DELETE_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                        MASTER_NO INTEGER NOT NULL,
                        SALES_NO INTEGER NOT NULL,
                        SHOP_NO INTEGER NOT NULL,
                        SHOP_NAME TEXT NOT NULL,
                        BRAND_NO INTEGER NOT NULL,
                        BRAND_NAME TEXT NOT NULL,
                        PRODUCT_NO INTEGER NOT NULL,
                        PRODUCT_NAME TEXT NOT NULL,
                        SALES_COUNT INTEGER NOT NULL,
                        DISCOUNT_PERCENT INTEGER NOT NULL,
                        DISCOUNT_PRICE INTEGER NOT NULL,
                        SALES_PRICE_OUT INTEGER NOT NULL,
                        SALES_DC_PRICE_OUT INTEGER NOT NULL,
                        TOTAL_SALES_PRICE_OUT INTEGER NOT NULL,
                        TOTAL_SALES_DC_PRICE_OUT INTEGER NOT NULL,
                        SALES_TYPE TEXT NOT NULL,
                        SALES_DT TEXT NOT NULL,
                        FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        DELETE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                      );`;

  return shop+brand+product+dc+sales+payment+backup_shop+backup_brand+backup_product+backup_sales;
}

// 트리거 생성하는 쿼리
function create_trigger_query(){
  const trigger_delete = `
    CREATE TRIGGER IF NOT EXISTS TRIG_TLB_SHOP
    BEFORE DELETE ON TBL_SHOP
    FOR EACH ROW
    BEGIN
        INSERT INTO BACKUP_TBL_SHOP (
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
          TOTAL_SALES_OUTSTANDING,
          FIRST_CREATE_DT,
          LAST_UPDATE_DT
        )
        VALUES (
          OLD.SHOP_NO,
          OLD.SHOP_NAME,
          OLD.STATUS,
          OLD.BUSINESS_LICENSE,
          OLD.TEL,
          OLD.MOBILE,
          OLD.EMAIL,
          OLD.ADDRESS1,
          OLD.ADDRESS2,
          OLD.ZIPCODE,
          OLD.CEO_NAME,
          OLD.MEMO,
          OLD.TOTAL_SALES_OUTSTANDING,
          OLD.FIRST_CREATE_DT,
          OLD.LAST_UPDATE_DT
        );
    END;
    CREATE TRIGGER IF NOT EXISTS TRIG_TLB_BRAND
    BEFORE DELETE ON TBL_BRAND
    FOR EACH ROW
    BEGIN
        INSERT INTO BACKUP_TBL_BRAND (
          BRAND_NO,
          BRAND_NAME,
          STATUS,
          ORDER_NO,
          MEMO,
          FIRST_CREATE_DT,
          LAST_UPDATE_DT
        )
        VALUES (
          OLD.BRAND_NO,
          OLD.BRAND_NAME,
          OLD.STATUS,
          OLD.ORDER_NO,
          OLD.MEMO,
          OLD.FIRST_CREATE_DT,
          OLD.LAST_UPDATE_DT
        );
    END;
    CREATE TRIGGER IF NOT EXISTS TRIG_TBL_PRODUCT
    BEFORE DELETE ON TBL_PRODUCT
    FOR EACH ROW
    BEGIN
        INSERT INTO BACKUP_TBL_PRODUCT (
          BRAND_NO,
          PRODUCT_NO,
          PRODUCT_NAME,
          MEMO,
          PRICE_IN,
          PRICE_OUT,
          ORDER_NO,
          STATUS,
          FIRST_CREATE_DT,
          LAST_UPDATE_DT
        )
        VALUES (
          OLD.BRAND_NO,
          OLD.PRODUCT_NO,
          OLD.PRODUCT_NAME,
          OLD.MEMO,
          OLD.PRICE_IN,
          OLD.PRICE_OUT,
          OLD.ORDER_NO,
          OLD.STATUS,
          OLD.FIRST_CREATE_DT,
          OLD.LAST_UPDATE_DT
        );
    END;
    CREATE TRIGGER IF NOT EXISTS TRIG_TBL_SALES
    BEFORE DELETE ON TBL_SALES
    FOR EACH ROW
    BEGIN
        INSERT INTO BACKUP_TBL_SALES (
          MASTER_NO,
          SALES_NO,
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
          SALES_DT,
          FIRST_CREATE_DT,
          LAST_UPDATE_DT
        )
        VALUES (
          OLD.MASTER_NO,
          OLD.SALES_NO,
          OLD.SHOP_NO,
          OLD.SHOP_NAME,
          OLD.BRAND_NO,
          OLD.BRAND_NAME,
          OLD.PRODUCT_NO,
          OLD.PRODUCT_NAME,
          OLD.SALES_COUNT,
          OLD.DISCOUNT_PERCENT,
          OLD.DISCOUNT_PRICE,
          OLD.SALES_PRICE_OUT,
          OLD.SALES_DC_PRICE_OUT,
          OLD.TOTAL_SALES_PRICE_OUT,
          OLD.TOTAL_SALES_DC_PRICE_OUT,
          OLD.SALES_TYPE,
          OLD.SALES_DT,
          OLD.FIRST_CREATE_DT,
          OLD.LAST_UPDATE_DT
        );
    END;`;
  const trigger_calc = `
    CREATE TRIGGER IF NOT EXISTS TRIG_OUTSTANDING_SALES_CALC_INSERT
        AFTER INSERT ON TBL_SALES
        FOR EACH ROW
    BEGIN
        UPDATE TBL_SHOP
        SET TOTAL_SALES_OUTSTANDING = TOTAL_SALES_OUTSTANDING + NEW.TOTAL_SALES_DC_PRICE_OUT
        WHERE SHOP_NO = NEW.SHOP_NO;
    END;
    
    CREATE TRIGGER IF NOT EXISTS TRIG_OUTSTANDING_SALES_CALC_UPDATE
        AFTER UPDATE ON TBL_SALES
        FOR EACH ROW
    BEGIN
        UPDATE TBL_SHOP
        SET TOTAL_SALES_OUTSTANDING = TOTAL_SALES_OUTSTANDING + (NEW.TOTAL_SALES_DC_PRICE_OUT - OLD.TOTAL_SALES_DC_PRICE_OUT)
        WHERE SHOP_NO = NEW.SHOP_NO;
    END;
    
    CREATE TRIGGER IF NOT EXISTS TRIG_OUTSTANDING_SALES_CALC_DELETE
        AFTER DELETE ON TBL_SALES
        FOR EACH ROW
    BEGIN
        UPDATE TBL_SHOP
        SET TOTAL_SALES_OUTSTANDING = TOTAL_SALES_OUTSTANDING - NEW.TOTAL_SALES_DC_PRICE_OUT
        WHERE SHOP_NO = OLD.SHOP_NO;
    END;
    
    CREATE TRIGGER IF NOT EXISTS TRIG_OUTSTANDING_PAYMENT_CALC_INSERT
        AFTER INSERT ON TBL_PAYMENT
        FOR EACH ROW
    BEGIN
        UPDATE TBL_SHOP
        SET TOTAL_SALES_OUTSTANDING = TOTAL_SALES_OUTSTANDING - NEW.TOTAL_CALC_AMOUNT
        WHERE SHOP_NO = NEW.SHOP_NO;
    END;
    
    CREATE TRIGGER IF NOT EXISTS TRIG_OUTSTANDING_PAYMENT_CALC_UPDATE
        AFTER UPDATE ON TBL_PAYMENT
        FOR EACH ROW
    BEGIN
        UPDATE TBL_SHOP
        SET TOTAL_SALES_OUTSTANDING = TOTAL_SALES_OUTSTANDING - (NEW.TOTAL_CALC_AMOUNT - OLD.TOTAL_CALC_AMOUNT)
        WHERE SHOP_NO = NEW.SHOP_NO;
    END;
    
    CREATE TRIGGER IF NOT EXISTS TRIG_OUTSTANDING_PAYMENT_CALC_DELETE
        AFTER DELETE ON TBL_PAYMENT
        FOR EACH ROW
    BEGIN
        UPDATE TBL_SHOP
        SET TOTAL_SALES_OUTSTANDING = TOTAL_SALES_OUTSTANDING + OLD.TOTAL_CALC_AMOUNT
        WHERE SHOP_NO = OLD.SHOP_NO;
    END;`;

  return trigger_delete+trigger_calc;
}