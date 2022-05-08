/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Config, DanmuViewCustomConfig } from "../../share/config/Config";
import { TReceiverStatus } from "../../share/type/commandPack/appCommand/command/TReceiverStatusUpdate";

export class MainState {
  config: Config;
  customConfig?: DanmuViewCustomConfig;

  path: URL;
  receiverStatus: TReceiverStatus;
}
