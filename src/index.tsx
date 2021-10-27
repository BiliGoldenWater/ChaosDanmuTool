import {app, BrowserWindow, ipcMain} from "electron";
import {DanmuReceiver} from "./utils/client/DanmuReceiver";
import {ConfigManager} from "./utils/config/ConfigManager";
import * as path from "path";
import {KoaServer} from "./utils/server/KoaServer";
import {WebsocketServer} from "./utils/server/WebsocketServer";
import {constructURL} from "./utils/URLConstructor";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const VIEWER_WEBPACK_ENTRY: string;

export let mainWindow: BrowserWindow;
export let viewerWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

function createMainWindow(): void {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.setAutoHideMenuBar(true);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then();
}

function createViewerWindow(): void {
  if (viewerWindow && !viewerWindow.isDestroyed()) viewerWindow.close();
  viewerWindow = new BrowserWindow({
    height: 600,
    width: 400,
    transparent: true,
    frame: false,
  });

  viewerWindow.setAutoHideMenuBar(true);

  // http://127.0.0.1:25556/viewer/?address=localhost&port=25555&maxReconnectAttemptNum=5&name=internal
  viewerWindow
    .loadURL(
      constructURL(
        VIEWER_WEBPACK_ENTRY,
        ConfigManager.config.danmuViewConfig.websocketServer.host,
        ConfigManager.config.danmuViewConfig.websocketServer.port,
        ConfigManager.config.danmuViewConfig.maxReconnectAttemptNumber,
        "internal"
      )
    )
    .then();

  viewerWindow.setVisibleOnAllWorkspaces(true, {
    skipTransformProcessType: false,
    visibleOnFullScreen: true,
  });

  viewerWindow.webContents.openDevTools();
}

function init(): void {
  ConfigManager.init(path.join(app.getAppPath(), "config.json"));
  ConfigManager.load();
  KoaServer.init(path.join(app.getAppPath(), ".webpack", "renderer"));

  ipcMain.on("connection", (event, ...args) => {
    switch (args[0]) {
      case "connect": {
        DanmuReceiver.connect(
          ConfigManager.config.danmuReceiver.serverUrl,
          args[1],
          ConfigManager.config.danmuReceiver.heartBeatInterval
        );
        break;
      }
      case "disconnect": {
        DanmuReceiver.close();
        break;
      }
    }
    event.returnValue = "";
  });

  ipcMain.on("config", (event, ...args) => {
    let result = "";
    switch (args[0]) {
      case "load": {
        ConfigManager.load();
        break;
      }
      case "save": {
        ConfigManager.save();
        break;
      }
      case "get": {
        result = JSON.stringify(ConfigManager.config);
        break;
      }
      case "update": {
        ConfigManager.config = JSON.parse(args[1]);
        break;
      }
    }
    event.returnValue = result;
  });

  ipcMain.on("koaServer", (event, ...args) => {
    switch (args[0]) {
      case "run": {
        KoaServer.run(args[1]);
        break;
      }
      case "close": {
        KoaServer.close();
        break;
      }
    }
    event.returnValue = "";
  });

  ipcMain.on("websocketServer", (event, ...args) => {
    switch (args[0]) {
      case "run": {
        WebsocketServer.run(args[1], args[2]);
        break;
      }
      case "close": {
        WebsocketServer.close();
        break;
      }
      case "broadcast": {
        WebsocketServer.broadcast(args[1]);
        break;
      }
    }
    event.returnValue = "";
  });

  ipcMain.on("windowControl", (event, ...args) => {
    switch (args[0]) {
      case "openViewer": {
        createViewerWindow();
        break;
      }
      case "closeViewer": {
        viewerWindow.close();
        break;
      }
    }
    event.returnValue = "";
  });

  // console.log(
  //   "==============================================================================="
  // );
  //
  // console.log(
  //   "==============================================================================="
  // );

  createMainWindow();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", init);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
