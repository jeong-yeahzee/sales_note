import { app, BrowserWindow, Menu } from 'electron';
import sqlite3 from 'sqlite3';
import path from 'path';
import {connect_db} from "./local_db.js";

let mainWindow;
const db_path = path.join(app.getPath("userData"), "SALES_NOTE_DATABASE.db");
export const db = new sqlite3.Database(db_path, (err)=>{
  if (err) {
    console.error("DB 연결 오류:", err.message);
  } else {
    console.log("DB 연결 성공");
  }
});

app.on("ready", ()=>{
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  // 메뉴바 없애기
  Menu.setApplicationMenu(null);

  // 보여줄 화면
  mainWindow.loadURL('http://localhost:3000');

  connect_db();
});

app.on("window-all-closed", () => {
  if (process.platform !== 'darwin'){
    db.close();
    app.quit();
  }
});