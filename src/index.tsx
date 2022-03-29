/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  app,
  BrowserWindow,
  dialog,
  Display,
  ipcMain,
  IpcMainEvent,
  Menu,
  screen,
} from "electron";
import { DanmuReceiver } from "./utils/client/DanmuReceiver";
import { ConfigManager } from "./utils/config/ConfigManager";
import * as path from "path";
import { KoaServer } from "./utils/server/KoaServer";
import { CommandBroadcastServer } from "./utils/server/CommandBroadcastServer";
import { constructURL } from "./utils/URLConstructor";
import { GiftConfigGetter } from "./utils/data/GiftConfigGetter";
import { defaultViewCustomInternalUUID } from "./utils/config/Config";
import { ErrorCode } from "./utils/ErrorCode";
import { UpdateUtils } from "./utils/UpdateUtils";
import { CommandHistoryManager } from "./utils/CommandHistoryManager";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const VIEWER_WEBPACK_ENTRY: string;

const get = ConfigManager.get.bind(ConfigManager);
const set = ConfigManager.set.bind(ConfigManager);
const updateConfig = ConfigManager.updateConfig.bind(ConfigManager);

export type WindowTryMove = {
  [key: string]: {
    count: number;
    lastTS: number;
  };
};
export const windowTryMove: WindowTryMove = {};

export let allDisplay: Display[];

export let mainWindow: BrowserWindow;
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
    createWindow();
  }
}

function closeWindow(window: BrowserWindow): void {
  if (isExists(window)) window.close();
}

function snapWindow(
  name: string,
  window: BrowserWindow,
  event: Electron.Event,
  newBounds: Electron.Rectangle
): void {
  allDisplay = screen.getAllDisplays();

  const nB = newBounds;
  const lB = window.getBounds();

  const centerX = lB.x + Math.round(lB.width / 2);
  const centerY = lB.y + Math.round(lB.height / 2);

  const display = allDisplay.find((value) => {
    const bounds = value.bounds;

    return (
      bounds.x <= centerX &&
      bounds.y <= centerY &&
      bounds.x + bounds.width >= centerX &&
      bounds.y + bounds.height >= centerY
    );
  });
  if (!display) {
    window.setPosition(0, 0, true);
    event.preventDefault();
    return;
  }
  const displayBounds = display.bounds;
  const range = {
    ...displayBounds,
    xMax: displayBounds.x + displayBounds.width,
    yMax: displayBounds.y + displayBounds.height,
  };

  /**
   * last position
   *
   * 0,1 top left x,y
   *
   * 2,3 bottom right x,y
   */
  const lP = [
    lB.x, // top left
    lB.y,
    lB.x + lB.width, // bottom right
    lB.y + lB.height,
  ];
  /**
   * new position
   *
   * 0,1 top left x,y
   *
   * 2,3 bottom right x,y
   */
  const nP = [
    nB.x, // top left
    nB.y,
    nB.x + nB.width, // bottom right
    nB.y + nB.height,
  ];
  /**
   * last distance
   *
   * 0: left distance
   *
   * 1: top distance
   *
   * 2: right distance
   *
   * 3: bottom distance
   */
  const lD = [
    lP[0] - range.x, // left distance
    lP[1] - range.y, // top distance
    range.xMax - lP[2], // right distance
    range.yMax - lP[3], // bottom distance
  ];
  /**
   * new distance
   *
   * 0: left distance
   *
   * 1: top distance
   *
   * 2: right distance
   *
   * 3: bottom distance
   */
  const nD = [
    nP[0] - range.x, // left distance
    nP[1] - range.y, // top distance
    range.xMax - nP[2], // right distance
    range.yMax - nP[3], // bottom distance
  ];

  const detectDistance = 50;
  /**
   * move direction
   *
   * not detected: 0  in: 1  out: 2  no change: 3
   *
   * 0: left distance
   *
   * 1: top distance
   *
   * 2: right distance
   *
   * 3: bottom distance
   */
  const moveD = lD.map((value, index) => {
    // last value
    const lV = Math.min(value, detectDistance);
    const nV = Math.min(nD[index], detectDistance);

    if (lV == 50 && nV == 50) return 0;
    if (nV > lV) {
      return 1;
    } else if (nV < lV) {
      return 2;
    } else {
      return 3;
    }
  });

  // ms
  const resetWaitTime = 1000;
  // pixel
  const maxLockDistance = 50;
  // no lock after maxLockDistance reached
  const noLockDistance = 5;

  const getTimeInSecond = () => {
    return new Date().getTime();
  };
  const resetCount = () => {
    windowTryMove[name] = { count: 0, lastTS: getTimeInSecond() };
  };
  const tryPreventDefault = () => {
    if (
      windowTryMove[name] == null ||
      windowTryMove[name].lastTS < getTimeInSecond() - resetWaitTime
    ) {
      resetCount();
    }
    windowTryMove[name].count++;
    if (windowTryMove[name].count >= maxLockDistance) {
      if (windowTryMove[name].count >= maxLockDistance + noLockDistance) {
        resetCount();
      }
      return;
    }

    event.preventDefault();
    windowTryMove[name].lastTS = getTimeInSecond();
  };

  let noXMove = false;
  let noYMove = false;
  /**
   * final position
   *
   * 0,1 top left x,y
   *
   * 2,3 bottom right x,y
   */
  const fP = lP.map((value) => value);
  lD.forEach((value, index) => {
    if (value != 0) return;

    if (moveD[index] == 2 && nD[index] <= 0) {
      tryPreventDefault();
      switch (index) {
        case 0: // x
        case 2: {
          fP[0] = lP[0]; //prevent move
          noXMove = true;
          break;
        }
        case 1: // y
        case 3: {
          fP[1] = lP[1]; //prevent move
          noYMove = true;
          break;
        }
      }
    } else if (moveD[index] == 3) {
      switch (index) {
        case 0: // x
        case 2: {
          if (!noYMove) {
            fP[1] = nP[1];
          }
          break;
        }
        case 1: // y
        case 3: {
          if (!noXMove) {
            fP[0] = nP[0];
          }
          break;
        }
      }
    }
  });
  window.setPosition(fP[0], fP[1]);
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
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then();
}

export function createViewerWindow(): void {
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
  });

  viewerWindow.setAlwaysOnTop(
    true,
    process.platform == "darwin" ? "floating" : "pop-up-menu"
  );

  // http://127.0.0.1:25556/viewer/?port=25555&maxReconnectAttemptNum=5&name=internal
  viewerWindow
    .loadURL(
      constructURL(
        VIEWER_WEBPACK_ENTRY,
        get("httpServerPort") as number,
        get("danmuViewConfig.maxReconnectAttemptNumber") as number,
        defaultViewCustomInternalUUID
      )
    )
    .then()
    .catch(() => {
      return;
    });

  viewerWindow.on("ready-to-show", () => {
    viewerWindow.setVisibleOnAllWorkspaces(true, {
      skipTransformProcessType: false,
      visibleOnFullScreen: true,
    });
    app.dock ? app.dock.show().then() : "";
  });

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

  viewerWindow.on("enter-full-screen", () => {
    setTimeout(() => {
      viewerWindow.setFullScreen(false);
    }, 100);
  });

  if (process.platform == "win32") {
    viewerWindow.on("will-move", (event, newBounds) => {
      snapWindow("viewerWindow", viewerWindow, event, newBounds);
    });
  }
}

function init(): void {
  allDisplay = screen.getAllDisplays();

  //region configInit

  ConfigManager.init(
    path.join(
      app.isPackaged ? app.getPath("userData") : app.getAppPath(),
      "config.json"
    )
  );
  if (!ConfigManager.load()) {
    dialog.showErrorBox(
      "初始化失败",
      `${ErrorCode.configReadFail}\n无法读取配置文件 程序退出`
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
      `${ErrorCode.commandHistoryInitFail}\n无法初始化历史记录存储`
    );
    app.exit(-1);
    return;
  }

  //endregion

  KoaServer.init(path.join(app.getAppPath(), ".webpack", "renderer"));

  UpdateUtils.init(
    "https://api.github.com/repos/BiliGoldenWater/ChaosDanmuTool/releases",
    "https://raw.githubusercontent.com/BiliGoldenWater/ChaosDanmuTool/master/changeLog.md"
  );
  GiftConfigGetter.init();

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
    }
  });
  //endregion

  //region koaServer
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
  //endregion

  //region commandBroadcastServer
  ipcMain.on("commandBroadcastServer", (event, ...args) => {
    switch (args[0]) {
      case "run": {
        if (KoaServer.server && KoaServer.server.listening) {
          CommandBroadcastServer.run(KoaServer.server);
        } else {
          KoaServer.run(args[1]);
          CommandBroadcastServer.run(KoaServer.server);
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
        createViewerWindow();
        break;
      }
      case "closeViewer": {
        closeWindow(viewerWindow);
        break;
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

  KoaServer.run(get("httpServerPort") as number);
  CommandBroadcastServer.run(KoaServer.server);

  createMainWindow();
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
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
    KoaServer.close();
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
