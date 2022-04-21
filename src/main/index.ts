/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainEvent,
  Menu,
} from "electron";
import * as path from "path";
import { defaultViewCustomInternalUUID } from "../share/config/Config";
import { ConfigManager } from "./config/ConfigManager";
import { constructViewerUrl } from "../share/utils/UrlUtils";
import { trySnapWindowOnMove } from "./utils/WindowUtils";
import { WebServer } from "./network/server/WebServer";
import { CommandHistoryManager } from "./utils/commandPack/CommandHistoryManager";
import { CommandBroadcastServer } from "./network/server/CommandBroadcastServer";
import { DanmuReceiver } from "./network/client/danmuReceiver/DanmuReceiver";
import { RoomInitGetter } from "./network/apiRequest/RoomInitGetter";
import { UpdateUtils } from "./utils/UpdateUtils";

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const VIEWER_WEBPACK_ENTRY: string;

export const isDev = !app.isPackaged;

const get = ConfigManager.get.bind(ConfigManager);
const set = ConfigManager.set.bind(ConfigManager);
const updateConfig = ConfigManager.updateConfig.bind(ConfigManager);

let mainWindow: BrowserWindow;
export let viewerWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

export function isExists(window: BrowserWindow): boolean {
  return window && !window.isDestroyed();
}

export function showWindow(
  window: BrowserWindow,
  createWindow: () => void
): void {
  if (isExists(window)) {
    if (window.isMinimized()) {
      window.restore();
    } else {
      window.show();
    }
    window.focus();
  } else {
    createWindow ? createWindow() : "";
  }
}

function closeWindow(window: BrowserWindow): void {
  if (isExists(window)) window.close();
}

function createMainWindow(): void {
  closeWindow(mainWindow);
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    alwaysOnTop: true,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then();
}

export async function createViewerWindow(): Promise<void> {
  closeWindow(viewerWindow);

  viewerWindow = new BrowserWindow({
    height: get("danmuViewConfig.height") as number,
    width: get("danmuViewConfig.width") as number,
    x: get("danmuViewConfig.posX") as number,
    y: get("danmuViewConfig.posY") as number,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    hasShadow: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  viewerWindow.setAlwaysOnTop(
    true,
    process.platform == "darwin" ? "floating" : "pop-up-menu"
  );

  // http://127.0.0.1:25556/viewer/?port=25555&maxReconnectAttemptNum=5&name=internal

  const options = {
    port: get("httpServerPort"),
    maxReconnectAttemptNumber: get("danmuViewConfig.maxReconnectAttemptNumber"),
    uuid: defaultViewCustomInternalUUID,
  };
  await viewerWindow.loadURL(constructViewerUrl(VIEWER_WEBPACK_ENTRY, options));

  if (process.platform === "darwin") {
    viewerWindow.setVisibleOnAllWorkspaces(true, {
      skipTransformProcessType: false,
      visibleOnFullScreen: true,
    });
    app.dock ? app.dock.show().then() : "";
    showWindow(mainWindow, null);
  }

  viewerWindow.on("move", () => {
    const [x, y] = viewerWindow.getPosition();
    set("danmuViewConfig.posX", x);
    set("danmuViewConfig.posY", y);
  });

  viewerWindow.on("resize", () => {
    const [width, height] = viewerWindow.getSize();
    set("danmuViewConfig.width", width);
    set("danmuViewConfig.height", height);
  });

  if (process.platform === "win32") {
    viewerWindow.on("will-move", (event, newBounds) => {
      trySnapWindowOnMove("viewerWindow", viewerWindow, event, newBounds);
    });
  }
}

function init(): void {
  //region configInit

  ConfigManager.init(
    path.join(isDev ? app.getAppPath() : app.getPath("userData"), "config.json")
  );
  if (!ConfigManager.load()) {
    dialog.showErrorBox(
      "初始化失败",
      `无法读取配置文件 程序退出\nmain.index.init.configInit`
    );
    app.exit(-1);
    return;
  }

  //endregion

  //region commandHistory

  const chmInitSuccess = CommandHistoryManager.init(
    path.join(
      app.isPackaged ? app.getPath("userData") : app.getAppPath(),
      ".commandHistory"
    )
  );
  if (!chmInitSuccess) {
    dialog.showErrorBox(
      "初始化失败",
      `无法初始化历史记录存储\nmain.index.commandHistory`
    );
    app.exit(-1);
    return;
  }

  //endregion

  WebServer.init(path.join(app.getAppPath(), ".webpack", "renderer"));

  UpdateUtils.init(
    "https://api.github.com/repos/BiliGoldenWater/ChaosDanmuTool/releases",
    "https://raw.githubusercontent.com/BiliGoldenWater/ChaosDanmuTool/master/changeLog.md"
  );

  //region ipcMain
  function callCallback(
    event: IpcMainEvent,
    callbackId: string,
    ...args: unknown[]
  ): void {
    event.reply("callback", callbackId, ...args);
  }

  //region app
  ipcMain.on("app", (event, ...args) => {
    switch (args[0]) {
      case "getPlatform": {
        event.returnValue = process.platform;
        break;
      }
      case "getArch": {
        event.returnValue = process.arch;
        break;
      }
      case "isUnderARM64Translation": {
        if (process.platform == "darwin" || process.platform == "win32")
          event.returnValue = app.runningUnderARM64Translation;
        else event.returnValue = false;
        break;
      }
      case "getVersion": {
        event.returnValue = app.getVersion();
        break;
      }
      case "getPath": {
        event.returnValue = app.getPath(args[1]);
        break;
      }
    }
    event.returnValue = "";
  });
  //endregion

  //region connection
  ipcMain.on("connection", (event, ...args) => {
    switch (args[0]) {
      case "connect": {
        DanmuReceiver.connect(
          get("danmuReceiver.serverUrl") as string,
          args[1],
          get("danmuReceiver.heartBeatInterval") as number
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
  //endregion

  //region config
  ipcMain.on("config", (event, ...args) => {
    let result: unknown = "";
    switch (args[0]) {
      case "load": {
        ConfigManager.load();
        ConfigManager.broadcast();
        break;
      }
      case "save": {
        ConfigManager.save();
        break;
      }
      case "get": {
        result = ConfigManager.getConfig();
        break;
      }
      case "update": {
        updateConfig(args[1]);
        break;
      }
    }
    event.returnValue = result;
  });
  //endregion

  //region commandHistory
  ipcMain.on("commandHistory", async (event, ...args) => {
    switch (args[0]) {
      case "new": {
        CommandHistoryManager.new();
        event.returnValue = "";
        break;
      }
      case "getHistory": {
        callCallback(
          event,
          args[1],
          await CommandHistoryManager.getHistory(
            args.length > 2 ? args[2] : undefined
          )
        );
        break;
      }
      case "getFiles": {
        event.returnValue = CommandHistoryManager.getFiles();
        break;
      }
      case "deleteFile": {
        CommandHistoryManager.deleteFile(args[1]);
        event.returnValue = "";
        break;
      }
      case "showInFolder": {
        CommandHistoryManager.showInFolder(args[1]);
        event.returnValue = "";
        break;
      }
    }
  });
  //endregion

  //region webServer
  ipcMain.on("webServer", (event, ...args) => {
    switch (args[0]) {
      case "run": {
        WebServer.run(args[1]);
        break;
      }
      case "close": {
        WebServer.close();
        break;
      }
    }
    event.returnValue = "";
  });
  //endregion

  //region commandBroadcastServer
  ipcMain.on("commandBroadcastServer", (event, ...args) => {
    switch (args[0]) {
      case "run": {
        if (WebServer.server && WebServer.server.listening) {
          CommandBroadcastServer.run(WebServer.server);
        } else {
          WebServer.run(args[1]);
          CommandBroadcastServer.run(WebServer.server);
        }
        break;
      }
      case "close": {
        CommandBroadcastServer.close();
        break;
      }
      case "broadcast": {
        CommandBroadcastServer.broadcast(args[1]);
        break;
      }
    }
    event.returnValue = "";
  });
  //endregion

  //region windowControl
  ipcMain.on("windowControl", (event, ...args) => {
    switch (args[0]) {
      case "openViewer": {
        createViewerWindow().then();
        break;
      }
      case "closeViewer": {
        closeWindow(viewerWindow);
        break;
      }
      case "setViewerIgnoreMouseEvent": {
        if (viewerWindow) {
          viewerWindow.setIgnoreMouseEvents(args[1], { forward: true });
        }
      }
    }
    event.returnValue = "";
  });
  //endregion

  //region update
  //incoming: name, callbackID
  ipcMain.on("update", async (event, ...args) => {
    switch (args[0]) {
      case "checkUpdate": {
        callCallback(event, args[1], await UpdateUtils.checkUpdate());
        break;
      }
      case "getLatestRelease": {
        callCallback(event, args[1], await UpdateUtils.getLatestRelease());
        break;
      }
      case "getChangeLog": {
        callCallback(event, args[1], await UpdateUtils.getChangeLog());
        break;
      }
    }
  });
  //endregion

  //region utils
  //incoming: name, callbackID
  ipcMain.on("utils", async (event, ...args) => {
    switch (args[0]) {
      case "getRoomid": {
        callCallback(event, args[1], await RoomInitGetter.getId(args[2]));
        break;
      }
    }
  });
  //endregion

  //endregion

  if (process.platform == "darwin") {
    const dockMenu = Menu.buildFromTemplate([
      {
        label: "打开主窗口",
        click() {
          showWindow(mainWindow, createMainWindow);
        },
      },
    ]);

    app.dock.setMenu(dockMenu);
  }

  app.on("second-instance", () => {
    showWindow(mainWindow, createMainWindow);
  });

  WebServer.run(get("httpServerPort") as number);
  CommandBroadcastServer.run(WebServer.server);

  createMainWindow();
}

if (isDev || app.requestSingleInstanceLock()) {
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
    showWindow(mainWindow, createMainWindow);
  });

  app.on("quit", () => {
    console.log("[Event] app.quit");

    if (ConfigManager.isSafeToSave() && get("autoSaveOnQuit")) {
      ConfigManager.save();
    }
    CommandBroadcastServer.close();
    WebServer.close();
  });
} else {
  app.quit();
}
