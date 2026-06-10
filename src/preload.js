const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lyon", {
  app: {
    close: () => ipcRenderer.invoke("app:close"),
    minimize: () => ipcRenderer.invoke("app:minimize"),
    openExternal: (target) => ipcRenderer.invoke("app:openExternal", target)
  },
  dialog: {
    selectFolder: (defaultPath) => ipcRenderer.invoke("dialog:selectFolder", defaultPath)
  },
  installer: {
    checkPrereqs: () => ipcRenderer.invoke("installer:checkPrereqs"),
    detectInstall: (payload) => ipcRenderer.invoke("installer:detectInstall", payload),
    fetchArtifacts: () => ipcRenderer.invoke("installer:fetchArtifacts"),
    getInitialState: () => ipcRenderer.invoke("installer:getInitialState"),
    install: (config) => ipcRenderer.invoke("installer:install", config),
    openFolder: (installPath) => ipcRenderer.invoke("installer:openFolder", installPath),
    start: (payload) => ipcRenderer.invoke("installer:start", payload),
    onProgress: (callback) => {
      const listener = (_event, payload) => callback(payload);
      ipcRenderer.on("installer:progress", listener);
      return () => ipcRenderer.removeListener("installer:progress", listener);
    }
  }
});
