const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getWarframeAccountName: () => ipcRenderer.invoke('get-warframe-account-name')
});
