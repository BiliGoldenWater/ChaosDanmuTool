/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TDanmuMsg } from "../../../type/bilibili/TDanmuMsg";
import {
  emptyUserInfo,
  TUserInfo,
} from "../../../type/bilibili/userinfo/TUserInfo";

export enum GachaCheckResult {
  WrongContent = "Wrong content",
  LowUserLevel = "Low user level",
  EmptyMedal = "Empty medal",
  MedalNotLighted = "Medal not lighted",
  WrongMedal = "Wrong medal",
  LowMedalLevel = "Low medal level",
  Joined = "Joined",

  Ok = "Ok",
}

export type GachaCheckResultWithUName = [string, GachaCheckResult];

export type TGachaUser = {
  userInfo: TUserInfo;
  danmuMsg: TDanmuMsg;
  latestDanmu: TDanmuMsg;
};

export class GachaUtils {
  static joinText = "参加抽奖";

  static userLevelLimit = -1;

  static medalLevelLimit = -1;
  static medalRoomid = -1;

  static winNum = 1;

  static item = "";

  static readonly joinedUsers: Map<number, TGachaUser> = new Map();
  static readonly winners: Map<number, TGachaUser> = new Map();
  static readonly losers: Map<number, TGachaUser> = new Map();

  static check(danmu: TDanmuMsg): GachaCheckResult {
    const d = danmu.data;

    if (this.joinedUsers.has(d.uid)) return GachaCheckResult.Joined;

    if (d.content !== this.joinText) return GachaCheckResult.WrongContent;
    if (this.userLevelLimit !== -1 && d.userUL < this.userLevelLimit)
      return GachaCheckResult.LowUserLevel;

    const medal = d.medalInfo;
    if (this.medalLevelLimit !== -1 && this.medalRoomid !== -1) {
      if (!medal) return GachaCheckResult.EmptyMedal; // 没戴
      if (medal.is_lighted !== 1) return GachaCheckResult.MedalNotLighted; // 没亮
      if (medal.anchor_roomid !== this.medalRoomid)
        return GachaCheckResult.WrongMedal; // 不是这个直播间的
      if (medal.medal_level < this.medalLevelLimit)
        return GachaCheckResult.LowMedalLevel; // 等级不够
    }

    return GachaCheckResult.Ok;
  }

  static join(danmu: TDanmuMsg) {
    const d = danmu.data;

    this.joinedUsers.set(d.uid, {
      userInfo: {
        ...emptyUserInfo,
        guard_level:
          d.medalInfo && d.medalInfo.is_lighted === 1
            ? d.medalInfo.guard_level
            : 0,
        is_vip: d.isVip,
        is_svip: d.isSVip,
        manager: d.isAdmin,
        uname: d.uName,
        user_level: d.userUL,
      },
      danmuMsg: danmu,
      latestDanmu: danmu,
    });
  }

  static updateLatestDanmu(danmu: TDanmuMsg) {
    const d = danmu.data;

    const gachaUser = this.joinedUsers.get(d.uid);
    gachaUser.latestDanmu = danmu;
  }

  static getJoinedUsers(): TGachaUser[] {
    return Array.from(this.joinedUsers.values());
  }

  static wish() {
    const shuffledUsers = Array.from(this.joinedUsers.entries()).sort(
      () => Math.random() - 0.5
    );

    for (let i = 0; i < shuffledUsers.length; i++) {
      if (i < this.winNum) {
        this.winners.set(shuffledUsers[i][0], shuffledUsers[i][1]);
      } else {
        this.losers.set(shuffledUsers[i][0], shuffledUsers[i][1]);
      }
    }
  }

  static clear() {
    this.joinedUsers.clear();
    this.clearResult();
  }

  static clearResult() {
    this.winners.clear();
    this.losers.clear();
  }
}
