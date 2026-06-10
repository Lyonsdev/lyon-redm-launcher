const path = require("node:path");

const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");

const { fetchArtifacts } = require("./artifacts");
const { DEFAULT_PORTS, FRAMEWORKS, LINKS } = require("./config");
const { detectInstallAt, installServer, startServer } = require("./installer");
const { readState, upsertInstallation } = require("./state");
const { checkDatabaseService, getDefaultInstallRoot, isAdmin } = require("./windows");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1120,
    minHeight: 660,
    frame: false,
    title: "Lyon RedM Launcher",
    backgroundColor: "#070504",
    icon: path.join(__dirname, "..", "assets", "logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "..", "app", "index.html"));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) {
      shell.openExternal(url);
    }

    return { action: "deny" };
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("app:minimize", () => {
  mainWindow?.minimize();
});

ipcMain.handle("app:close", () => {
  mainWindow?.close();
});

ipcMain.handle("app:openExternal", async (_event, keyOrUrl) => {
  const url = LINKS[keyOrUrl] || keyOrUrl;
  if (typeof url === "string" && /^https:\/\//i.test(url)) {
    await shell.openExternal(url);
  }
});

ipcMain.handle("dialog:selectFolder", async (_event, defaultPath) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Selecciona carpeta de instalación",
    defaultPath: defaultPath || getDefaultInstallRoot(),
    properties: ["openDirectory", "createDirectory"]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("installer:getInitialState", async () => {
  const state = await readState(app);
  const admin = await isAdmin();

  return {
    admin,
    defaultInstallRoot: getDefaultInstallRoot(),
    defaultPorts: DEFAULT_PORTS,
    frameworks: Object.values(FRAMEWORKS),
    links: LINKS,
    locale: app.getLocale(),
    state
  };
});

ipcMain.handle("installer:fetchArtifacts", async () => {
  return fetchArtifacts();
});

ipcMain.handle("installer:checkPrereqs", async () => {
  const database = await checkDatabaseService();
  const admin = await isAdmin();
  return { admin, database };
});

ipcMain.handle("installer:detectInstall", async (_event, { frameworkId, installPath }) => {
  return detectInstallAt(frameworkId, installPath);
});

ipcMain.handle("installer:install", async (event, config) => {
  const metadata = await installServer(config, event.sender);
  const state = await upsertInstallation(app, metadata);
  return { metadata, state };
});

ipcMain.handle("installer:start", async (_event, { installation, txAdmin }) => {
  startServer(installation, txAdmin);
  return true;
});

ipcMain.handle("installer:openFolder", async (_event, installPath) => {
  if (installPath) {
    await shell.openPath(installPath);
  }
});
