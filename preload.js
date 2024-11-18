const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    db_query: (query) => ipcRenderer.invoke('db-query', query)
});