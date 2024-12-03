const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    db_all: (param) => ipcRenderer.invoke('db-all', param),
    db_run: (param) => ipcRenderer.invoke('db-run', param),
    db_transaction: (param) => ipcRenderer.invoke('db-transaction', param)
});