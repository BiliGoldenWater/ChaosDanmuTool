/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiElectron } from "./preload";

declare global {
  interface Window {
    electron: ApiElectron;
  }
}
