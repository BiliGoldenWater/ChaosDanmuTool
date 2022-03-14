/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Config, getDefaultConfig } from "./Config";
import * as fs from "fs";
import { ErrorCode } from "../ErrorCode";
import { dialog } from "electron";
import { CommandBroadcastServer } from "../server/CommandBroadcastServer";
import { getConfigUpdateMessage } from "../command/ConfigUpdate";
import { getProperty, setProperty } from "dot-prop";

export class ConfigManager {
  private static config: Config;
  private static filePath: string;
  private static inited: boolean;
  private static loaded: boolean;

  static init(filePath: string): void {
    this.config = getDefaultConfig();
    this.filePath = filePath;
    this.inited = true;
  }

  static loadDefault(config?: Config): void {
    this.config = getDefaultConfig(config);
  }

  static load(): boolean {
    if (!this.inited) return false;

    try {
      const configStr = fs.readFileSync(this.filePath, {
        flag: "r",
        encoding: "utf-8",
      });

      const config: Config = JSON.parse(configStr);

      if (config && config.forChaosDanmuTool) {
        this.loadDefault(config);
      } else {
        this.loadDefault();
      }
    } catch (e) {
      if (fs.existsSync(this.filePath)) {
        dialog.showErrorBox(
          "读取失败",
          `${ErrorCode.configReadException}\n配置文件存在但无法读取\n可能的原因: 被其他应用程序占用, 无读取权限`
        );
        return false;
      }

      this.loadDefault();
    }
    this.loaded = true;
    return true;
  }

  static save(): boolean {
    if (!this.isSafeToSave()) return false;

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
          dialog.showErrorBox(
            "保存失败",
            `${ErrorCode.unknownExistsFile}\n存在未知的同名文件`
          );
          return false;
        }
      } catch (e) {
        dialog.showErrorBox(
          "保存失败",
          `${ErrorCode.unknownExistsFile}\n存在未知的同名文件`
        );
        return false;
      }
    } else {
      this.writeToFile();
    }
    return true;
  }

  static writeToFile(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.config, null, 2));
    } catch (e) {
      dialog.showErrorBox(
        "保存失败",
        `${ErrorCode.configWriteException}\n无法写入`
      );
    }
  }

  static isSafeToSave(): boolean {
    return this.inited && this.loaded;
  }

  static get(key: string, defaultValue?: unknown): unknown {
    return getProperty(this.config, key, defaultValue);
  }

  static set(key: string, value: unknown): void {
    setProperty(this.config, key, value);
    this.onChange();
  }

  static getConfig(): Config {
    return this.config;
  }

  static updateConfig(config: Config): void {
    this.config = config;
    this.onChange();
  }

  static onChange(): void {
    CommandBroadcastServer.broadcast(
      JSON.stringify(getConfigUpdateMessage(this.config))
    );
    this.get("autoSaveOnChange") ? this.save() : "";
  }
}
