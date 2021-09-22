import {app, BrowserWindow, ipcMain} from "electron";
import {DanmuReceiver} from "./window/main/utils/DanmuReceiver";
import {ConfigManager} from "./window/main/utils/ConfigManager";
import * as path from "path";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createMainWindow = (): void => {
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

  mainWindow.webContents.openDevTools();
  // mainWindow.setVisibleOnAllWorkspaces(true, {
  //   skipTransformProcessType: false,
  //   visibleOnFullScreen: true,
  // });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createMainWindow);

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
ConfigManager.init(path.join(app.getAppPath(), "config.json"));
ConfigManager.load();

ipcMain.on("connection", (event, ...args) => {
  switch (args[0]) {
    case "connect": {
      DanmuReceiver.connect(
        ConfigManager.config.danmuReceiver.serverUrl,
        ConfigManager.config.danmuReceiver.roomid,
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
