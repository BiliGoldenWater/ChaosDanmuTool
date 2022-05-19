/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TRoomInfoResponse } from "../../../share/type/request/bilibili/TRoomInfoResponse";
import { getString } from "../../utils/HttpUtils";

export class RoomInfoGetter {
  static async get(roomid: number): Promise<TRoomInfoResponse> {
    return JSON.parse(
      await getString(
        `https://api.live.bilibili.com/room/v1/Room/room_init?id=${roomid}`
      )
    );
  }

  static async getId(roomid: number): Promise<number> {
    const res = await this.get(roomid);
    if (res.code == 0) return res.data.room_id;
    return roomid;
  }

  static async getUid(roomid: number): Promise<number> {
    const res = await this.get(roomid);
    if (res.code == 0) return res.data.uid;
    return 0;
  }
}