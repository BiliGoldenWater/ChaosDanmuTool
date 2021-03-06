/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type TGiftInfo = {
  id: number;
  name: string;
  price: number;
  type: number;
  coin_type: "gold" | "silver";
  bag_gift: number;
  effect: number;
  corner_mark: string;
  corner_background: string;
  broadcast: number;
  draw: number;
  stay_time: number;
  animation_frame_num: number;
  desc: string;
  rule: string;
  rights: string;
  privilege_required: number;
  count_map: [];
  img_basic: string;
  img_dynamic: string;
  frame_animation: string;
  gif: string;
  webp: string;
  full_sc_web: string;
  full_sc_horizontal: string;
  full_sc_vertical: string;
  full_sc_horizontal_svga: string;
  full_sc_vertical_svga: string;
  bullet_head: string;
  bullet_tail: string;
  limit_interval: number;
  bind_ruid: number;
  bind_roomid: number;
  gift_type: number;
  combo_resources_id: number;
  max_send_limit: number;
  weight: number;
  goods_id: number;
  has_imaged_gift: number;
  left_corner_text: string;
  left_corner_background: string;
  gift_banner: unknown;
  diy_count_map: number;
  effect_id: number;
};
