/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const medalInfo = {
  anchor_roomid: 999999999,
  anchor_uname: "诶嘿",
  guard_level: 0,
  icon_id: 0,
  is_lighted: 1,
  medal_color: 1725515,
  medal_color_border: 6809855,
  medal_color_end: 1725515,
  medal_color_start: 5414290,
  medal_level: 12,
  medal_name: "诶嘿",
  special: "",
  target_id: 9999999999,
};
medalInfo.guard_level = 3;

export const biliBiliDanmuTestData: unknown[] = [
  {
    cmd: "DANMU_MSG",
    info: [
      [
        0,
        1,
        25,
        16777215,
        1630854749805,
        1630843073,
        0,
        "1e7695fe",
        0,
        0,
        0,
        "",
        1,
        {
          height: 60,
          in_player_area: 1,
          is_dynamic: 1,
          url: "https://i0.hdslb.com/bfs/live/a98e35996545509188fe4d24bd1a56518ea5af48.png",
          width: 183,
        },
        "{}",
      ],
      "message message message message",
      [123456789, "Username", 1, 1, 1, 10000, 1, ""],
      [
        88,
        "诶嘿",
        "medal-uname",
        123456789,
        13081892,
        "",
        0,
        13081892,
        13081892,
        13081892,
        0,
        1,
        865267,
      ],
      [19, 0, 6406234, "\u003e50000", 0],
      ["title-438-1", "title-438-1"],
      0,
      0,
      null,
      {
        ts: 1630854749,
        ct: "520027F7",
      },
      0,
      0,
      null,
      null,
      0,
      91,
    ],
  },
  {
    cmd: "DANMU_MSG",
    info: [
      [
        0,
        1,
        25,
        16777215,
        1630854749805,
        1630843073,
        0,
        "1e7695fe",
        0,
        0,
        0,
        "",
        1,
        "{}",
        "{}",
      ],
      "message message message message",
      [123456789, "Username", 1, 1, 1, 10000, 1, ""],
      [
        88,
        "诶嘿",
        "medal-uname",
        123456789,
        13081892,
        "",
        0,
        13081892,
        13081892,
        13081892,
        0,
        1,
        865267,
      ],
      [19, 0, 6406234, "\u003e50000", 0],
      ["title-438-1", "title-438-1"],
      0,
      0,
      null,
      {
        ts: 1630854749,
        ct: "520027F7",
      },
      0,
      0,
      null,
      null,
      0,
      91,
    ],
  },
  {
    cmd: "SUPER_CHAT_MESSAGE",
    data: {
      background_bottom_color: "#2A60B2",
      background_color: "#EDF5FF",
      background_color_end: "#405D85",
      background_color_start: "#3171D2",
      background_icon: "",
      background_image:
        "https://i0.hdslb.com/bfs/live/a712efa5c6ebc67bafbe8352d3e74b820a00c13e.png",
      background_price_color: "#7497CD",
      color_point: 0.7,
      dmscore: 120,
      end_time: new Date().getTime() / 1000 + 60,
      gift: {
        gift_id: 12000,
        gift_name: "醒目留言",
        num: 1,
      },
      id: 3607387,
      is_ranked: 1,
      is_send_audit: 0,
      medal_info: medalInfo,
      message:
        "content content content content content content content content",
      message_font_color: "#A3F6FF",
      message_trans: "",
      price: 30,
      rate: 1000,
      start_time: 1648307902,
      time: 60,
      token: "694FAF3",
      trans_mark: 0,
      ts: 1648307902,
      uid: 123456789,
      user_info: {
        face: "http://i0.hdslb.com/bfs/face/b0154766540a4c15518b4cba40eaa68f0b6b03d3.jpg",
        face_frame:
          "https://i0.hdslb.com/bfs/live/80f732943cc3367029df65e267960d56736a82ee.png",
        guard_level: 3,
        is_main_vip: 1,
        is_svip: 0,
        is_vip: 0,
        level_color: "#61c05a",
        manager: 0,
        name_color: "#00D1F1",
        title: "title-153-1",
        uname: "Username",
        user_level: 14,
      },
    },
    roomid: 123456789,
  },
  {
    cmd: "SEND_GIFT",
    data: {
      action: "投喂",
      batch_combo_id: "ba543138-c9de-4e45-98ad-071eba24efbb",
      batch_combo_send: {
        action: "投喂",
        batch_combo_id: "ba543138-c9de-4e45-98ad-071eba24efbb",
        batch_combo_num: 1,
        blind_gift: {
          blind_gift_config_id: 20,
          gift_action: "爆出",
          original_gift_id: 31005,
          original_gift_name: "紫金宝盒",
        },
        gift_id: 31003,
        gift_name: "麦克风",
        gift_num: 1,
        send_master: null,
        uid: 123456789,
        uname: "Username",
      },
      beatId: "",
      biz_source: "TLive",
      blind_gift: {
        blind_gift_config_id: 20,
        gift_action: "爆出",
        original_gift_id: 31005,
        original_gift_name: "紫金宝盒",
      },
      broadcast_id: 0,
      coin_type: "gold",
      combo_resources_id: 1,
      combo_send: {
        action: "投喂",
        combo_id: "78419810-4360-410b-b000-fbf5f2cf087e",
        combo_num: 1,
        gift_id: 31003,
        gift_name: "麦克风",
        gift_num: 1,
        send_master: null,
        uid: 123456789,
        uname: "Username",
      },
      combo_stay_time: 5,
      combo_total_coin: 11000,
      crit_prob: 0,
      demarcation: 2,
      discount_price: 10000,
      dmscore: 80,
      draw: 0,
      effect: 0,
      effect_block: 0,
      face: "https://i0.hdslb.com/bfs/face/f30a9401a0ea2cf90325b94f67203454e1b16b12.jpg",
      giftId: 31003,
      giftName: "麦克风",
      giftType: 0,
      gold: 0,
      guard_level: 0,
      is_first: true,
      is_special_batch: 0,
      magnification: 1,
      medal_info: {
        anchor_roomid: 0,
        anchor_uname: "",
        guard_level: 0,
        icon_id: 0,
        is_lighted: 1,
        medal_color: 6126494,
        medal_color_border: 6126494,
        medal_color_end: 6126494,
        medal_color_start: 6126494,
        medal_level: 5,
        medal_name: "诶嘿",
        special: "",
        target_id: 123456789,
      },
      name_color: "",
      num: 1,
      original_gift_name: "",
      price: 11000,
      rcost: 371575234,
      remain: 0,
      rnd: "1290338572",
      send_master: null,
      silver: 0,
      super: 0,
      super_batch_gift_num: 1,
      super_gift_num: 1,
      svga_block: 0,
      tag_image: "",
      tid: "1628269455121000001",
      timestamp: 1628269455,
      top_list: null,
      total_coin: 10000,
      uid: 123456789,
      uname: "Username",
    },
  },
  {
    cmd: "ROOM_BLOCK_MSG",
    dmscore: 30,
    operator: 1,
    uid: 1738501816,
    uname: "huff1041wrp",
  },
  {
    cmd: "LIVE",
    live_key: "123456789",
    voice_background: "",
    sub_session_key: "123456789",
    live_platform: "pc",
    live_model: 0,
    roomid: 123456789,
  },
  {
    cmd: "PREPARING",
    roomid: "123456789",
  },
  {
    cmd: "GUARD_BUY",
    data: {
      uid: 123456789,
      username: "Username",
      guard_level: 3,
      num: 1,
      price: 198000,
      gift_id: 10003,
      gift_name: "舰长",
      start_time: 1628333080,
      end_time: 1628333080,
    },
  },
  {
    cmd: "WARNING",
    msg: "违反直播分区规范，请立即更换至游戏区",
    roomid: 123456789,
  },
  {
    cmd: "CUT_OFF",
    msg: "禁播游戏",
    roomid: 123456789,
  },
];
