/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type TCutOff = {
  cmd: "CUT_OFF";
  msg: string;
  roomid: number;
};

export function getCutOffCommand(msg: string, roomid = 0): TCutOff {
  return { cmd: "CUT_OFF", msg: msg, roomid: roomid };
}
