const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let main_window;
// SQLite 데이터베이스 파일 경로
const db_path = path.join(__dirname, "sales_note_db.sqlite");
// 데이터베이스 연결 (없으면 자동 생성됨)
const db = new sqlite3.Database(db_path);

app.on("ready", ()=>{
  main_window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // 메뉴바 없애기
  Menu.setApplicationMenu(null);

  // 개발자 도구 열기
  main_window.webContents.openDevTools();

  // 보여줄 화면
  main_window.loadURL('http://localhost:3000');

  // 데이터베이스 초기화 (테이블 생성)
  init_db();
});

app.on("window-all-closed", () => {
  if (process.platform !== 'darwin'){
    db.close();
    app.quit();
  }
});

// DB 쿼리 결과를 렌더러로 전달하는 IPC 핸들러 ( 조회 )
ipcMain.handle('db-all', (event, param) => {
  return new Promise((resolve, reject) => {
    db.all(param, (err, rows) => {
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
    db.run(param.query, param.value, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
});

// 데이터베이스 초기화 (테이블 생성)
function init_db(){
  const query = create_table_query();

  // 여러 테이블을 한 번에 생성
  db.exec(query, (err) => {
    if (err) {
      console.error('테이블 생성 실패:', err);
    } else {
      console.log('테이블들이 성공적으로 생성되었습니다.');
    }
  });
}

// 테이블 생성하는 쿼리
function create_table_query(){
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
                          FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                        );`;

  const brand_query = `CREATE TABLE IF NOT EXISTS BRAND_T (
                          BRAND_NO INTEGER PRIMARY KEY AUTOINCREMENT,
                          BRAND_NAME TEXT NOT NULL,
                          STATUS INTEGER NOT NULL DEFAULT 1,
                          ORDER_NO INTEGER,
                          MEMO TEXT,
                          FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
                        FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                        );`;
  const dc_query = `CREATE TABLE IF NOT EXISTS PRODUCT_DC_T (
                        BRAND_NO INTEGER NOT NULL,
                        PRODUCT_NO INTEGER NOT NULL,
                        SHOP_NO INTEGER NOT NULL,
                        DISCOUNT_PERCENT INTEGER NOT NULL DEFAULT 0,
                        DISCOUNT_PRICE INTEGER NOT NULL DEFAULT 0,
                        STATUS INTEGER NOT NULL DEFAULT 0,
                        FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
                        FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
                        FIRST_CREATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        LAST_UPDATE_DT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                        );`;

  return shop_query+brand_query+product_query+dc_query+sales_query+payment_query;
}