/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type TAppCommand<T> = {
  cmd: "appCommand";
  data: T;
};
