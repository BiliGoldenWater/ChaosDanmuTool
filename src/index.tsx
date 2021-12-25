import { app, BrowserWindow, ipcMain, Menu, screen, Display } from "electron";
import { DanmuReceiver } from "./utils/client/DanmuReceiver";
import { ConfigManager } from "./utils/config/ConfigManager";
import * as path from "path";
import { KoaServer } from "./utils/server/KoaServer";
import { WebsocketServer } from "./utils/server/WebsocketServer";
import { constructURL } from "./utils/URLConstructor";
import { GiftConfigGetter } from "./utils/data/GiftConfigGetter";
import {
  DanmuViewConfig,
  defaultViewCustomInternalName,
} from "./utils/config/Config";
import { Update } from "./utils/Update";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const VIEWER_WEBPACK_ENTRY: string;

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

  // last position
  const lP = [
    lB.x, // top left
    lB.y,
    lB.x + lB.width, // bottom right
    lB.y + lB.height,
  ];
  // new position
  const nP = [
    nB.x, // top left
    nB.y,
    nB.x + nB.width, // bottom right
    nB.y + nB.height,
  ];
  // last distance
  const lD = [
    lP[0] - range.x, // left distance
    lP[1] - range.y, // top distance
    range.xMax - lP[2], // right distance
    range.yMax - lP[3], // bottom distance
  ];
  // new distance
  const nD = [
    nP[0] - range.x, // left distance
    nP[1] - range.y, // top distance
    range.xMax - nP[2], // right distance
    range.yMax - nP[3], // bottom distance
  ];

  // move direction
  // not detected:0  in: 1  out: 2  no change: 3
  const detectDistance = 50;
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

  const resetWaitTime = 1000; // ms
  const maxLockDistance = 50; // pixel
  const noLockDistance = 5; // no lock after maxLockDistance reached

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
  const fP = lP.map((value) => value);
  lD.forEach((value, index) => {
    if (value != 0) return;

    if (moveD[index] == 2 && lD[index] <= 0) {
      tryPreventDefault();
      switch (index) {
        case 0: // x
        case 2: {
          fP[0] = lP[0];
          noXMove = true;
          break;
        }
        case 1: // y
        case 3: {
          fP[1] = lP[1];
          noYMove = true;
          break;
        }
      }
    } else if (moveD[index] == 3) {
      tryPreventDefault();
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

  const danmuViewConfig: DanmuViewConfig = ConfigManager.config.danmuViewConfig;

  viewerWindow = new BrowserWindow({
    height: danmuViewConfig.height,
    width: danmuViewConfig.width,
    x: danmuViewConfig.posX,
    y: danmuViewConfig.posY,
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
        ConfigManager.config.httpServerPort,
        danmuViewConfig.maxReconnectAttemptNumber,
        defaultViewCustomInternalName
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
    [danmuViewConfig.posX, danmuViewConfig.posY] = viewerWindow.getPosition();
    ConfigManager.onChange();
  });

  viewerWindow.on("resize", () => {
    [danmuViewConfig.width, danmuViewConfig.height] = viewerWindow.getSize();
    ConfigManager.onChange();
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

  ConfigManager.init(
    path.join(
      app.isPackaged ? app.getPath("userData") : app.getAppPath(),
      "config.json"
    )
  );
  ConfigManager.load();
  KoaServer.init(path.join(app.getAppPath(), ".webpack", "renderer"));

  Update.init(
    "https://api.github.com/repos/BiliGoldenWater/ChaosDanmuTool/releases",
    "https://raw.githubusercontent.com/BiliGoldenWater/ChaosDanmuTool/master/changeLog.md"
  );

  GiftConfigGetter.init();

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
        ConfigManager.onChange();
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
        if (KoaServer.server && KoaServer.server.listening) {
          WebsocketServer.run(KoaServer.server);
        } else {
          KoaServer.run(args[1]);
        }
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
        closeWindow(viewerWindow);
        break;
      }
    }
    event.returnValue = "";
  });

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

  KoaServer.run(ConfigManager.config.httpServerPort);
  WebsocketServer.run(KoaServer.server);

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

    if (ConfigManager.isSafeToSave() && ConfigManager.config.autoSaveOnQuit) {
      ConfigManager.save();
    }
    WebsocketServer.close();
    KoaServer.close();
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
