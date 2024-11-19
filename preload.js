const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    db_all: (param) => ipcRenderer.invoke('db-all', param),
    db_run: (param) => ipcRenderer.invoke('db-run', param)
});