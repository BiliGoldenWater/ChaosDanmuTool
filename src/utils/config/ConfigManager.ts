import { Config, defaultConfig } from "./Config";
import * as fs from "fs";
import { errorCode } from "../ErrorCode";
import { dialog } from "electron";
import { WebsocketServer } from "../server/WebsocketServer";
import { getConfigUpdateMessage } from "../command/ConfigUpdate";

export class ConfigManager {
  static config: Config;
  static filePath: string;
  static inited: boolean;
  static loaded: boolean;

  static init(filePath: string): void {
    this.config = JSON.parse(JSON.stringify(defaultConfig));
    this.filePath = filePath;
    this.inited = true;
  }

  static load(): void {
    try {
      const configStr = fs.readFileSync(this.filePath, {
        flag: "r",
        encoding: "utf-8",
      });
      this.config = JSON.parse(configStr);
    } catch (e) {
      this.config = JSON.parse(JSON.stringify(defaultConfig));
    }
    this.loaded = true;
  }

  static save(): void {
    if (fs.existsSync(this.filePath)) {
      try {
        const configStr = fs.readFileSync(this.filePath, {
          flag: "r",
          encoding: "utf-8",
        });
        const rConfig: Config = JSON.parse(configStr);
        if (rConfig.forChaosDanmuTool) {
          this.writeToFile();
        } else {
          dialog.showErrorBox("保存失败", errorCode.unknownExistsFile);
        }
      } catch (e) {
        dialog.showErrorBox("保存失败", errorCode.unknownExistsFile);
      }
    } else {
      this.writeToFile();
    }
  }

  static writeToFile(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.config, null, 2));
  }

  static isSafeToSave(): boolean {
    return this.inited && this.loaded;
  }

  static onChange(): void {
    WebsocketServer.broadcast(
      JSON.stringify(getConfigUpdateMessage(this.config))
    );
    this.config.autoSaveOnChange ? this.save() : "";
  }
}
