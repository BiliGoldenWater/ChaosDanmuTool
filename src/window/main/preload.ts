/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { contextBridge, ipcRenderer, clipboard } from "electron";
import { v4 as uuid4 } from "uuid";
import { TGithubReleases } from "../../type/github/TGithubReleases";
import { Config } from "../../utils/config/Config";
import { MessageLog } from "../../utils/command/MessageLog";

export interface ApiElectron {
  getPlatform: () => string;
  getVersion: () => string;
  getPath: (name: string) => string;

  connect: (roomid: number) => void;
  disconnect: () => void;

  loadConfig: () => void;
  saveConfig: () => void;
  getConfig: () => Config;
  updateConfig: (config: Config) => void;

  runKoaServer: (port: number) => void;
  closeKoaServer: () => void;

  runCommandBroadcastServer: (port: number) => void;
  closeCommandBroadcastServer: () => void;
  broadcastCommand: (data: string) => void;

  openViewer: () => void;
  closeViewer: () => void;

  checkUpdate: () => Promise<boolean>;
  getReleasesInfo: () => Promise<TGithubReleases>;
  getChangeLog: () => Promise<string>;

  getDanmuHistory: () => MessageLog[];

  writeClipboard: (str: string) => void;
}

type Callbacks = {
  [key: string]: (...args: unknown[]) => void;
};

const callbacks: Callbacks = {};

function putCallback(callback: (...args: unknown[]) => void): string {
  const id = uuid4();
  callbacks[id] = callback;
  return id;
}

const apiElectron: ApiElectron = {
  getPlatform: (): string => {
    return ipcRenderer.sendSync("app", "getPlatform");
  },
  getVersion: (): string => {
    return ipcRenderer.sendSync("app", "getVersion");
  },
  getPath: (name: string): string => {
    return ipcRenderer.sendSync("app", "getPath", name);
  },

  connect: (roomid: number): void => {
    ipcRenderer.sendSync("connection", "connect", roomid);
  },
  disconnect: (): void => {
    ipcRenderer.sendSync("connection", "disconnect");
  },

  loadConfig: (): void => {
    ipcRenderer.sendSync("config", "load");
  },
  saveConfig: (): void => {
    ipcRenderer.sendSync("config", "save");
  },
  getConfig: (): Config => {
    return ipcRenderer.sendSync("config", "get");
  },
  updateConfig: (config: Config): void => {
    ipcRenderer.sendSync("config", "update", config);
  },

  runKoaServer: (port: number): void => {
    ipcRenderer.sendSync("koaServer", "run", port);
  },
  closeKoaServer: (): void => {
    ipcRenderer.sendSync("koaServer", "close");
  },

  runCommandBroadcastServer: (port: number): void => {
    ipcRenderer.sendSync("commandBroadcastServer", "run", port);
  },
  closeCommandBroadcastServer: (): void => {
    ipcRenderer.sendSync("commandBroadcastServer", "close");
  },
  broadcastCommand: (data: string): void => {
    ipcRenderer.sendSync("commandBroadcastServer", "broadcast", data);
  },

  openViewer: (): void => {
    ipcRenderer.sendSync("windowControl", "openViewer");
  },
  closeViewer: (): void => {
    ipcRenderer.sendSync("windowControl", "closeViewer");
  },

  checkUpdate: (): Promise<boolean> => {
    return new Promise((resolve) => {
      ipcRenderer.send("update", "checkUpdate", putCallback(resolve));
    });
  },
  getReleasesInfo: (): Promise<TGithubReleases> => {
    return new Promise((resolve) => {
      ipcRenderer.send("update", "getReleasesInfo", putCallback(resolve));
    });
  },
  getChangeLog: (): Promise<string> => {
    return new Promise((resolve) => {
      ipcRenderer.send("update", "getChangeLog", putCallback(resolve));
    });
  },

  getDanmuHistory: (): MessageLog[] => {
    return ipcRenderer.sendSync("danmu", "getDanmuHistory");
  },

  writeClipboard: (str: string): void => {
    clipboard.writeText(str);
  },
};

contextBridge.exposeInMainWorld("electron", apiElectron);

ipcRenderer.on("callback", (event, ...args) => {
  const callbackId = args[0];
  const callback = callbacks[callbackId];
  if (callback) {
    callback(...args.slice(1));
    delete callbacks[callbackId];
  }
});
