/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./DanmuRender.css";
import {DanmuItem} from "./danmuitem/DanmuItem";
import {DanmuMessageWithKey} from "../../../../utils/command/DanmuMessage";
import {ConfigContext} from "../../utils/ConfigContext";

class Props {
  danmuList: DanmuMessageWithKey[];
}

export class DanmuRender extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    const danmuItems = this.props.danmuList.map((value) => {
      return <DanmuItem key={value.key} message={value.msg}/>;
    });

    // const medalInfo = {
    //   anchor_roomid: 999999999,
    //   anchor_uname: "诶嘿",
    //   guard_level: 0,
    //   icon_id: 0,
    //   is_lighted: 1,
    //   medal_color: 1725515,
    //   medal_color_border: 6809855,
    //   medal_color_end: 1725515,
    //   medal_color_start: 5414290,
    //   medal_level: 12,
    //   medal_name: "诶嘿",
    //   special: "",
    //   target_id: 9999999999,
    // };
    // medalInfo.guard_level = 3;
    //
    // const list: unknown[] = [
    //   {
    //     cmd: "DANMU_MSG",
    //     info: [
    //       [
    //         0,
    //         1,
    //         25,
    //         16777215,
    //         1630854749805,
    //         1630843073,
    //         0,
    //         "1e7695fe",
    //         0,
    //         0,
    //         0,
    //         "",
    //         1,
    //         {
    //           height: 60,
    //           in_player_area: 1,
    //           is_dynamic: 1,
    //           url: "https://i0.hdslb.com/bfs/live/a98e35996545509188fe4d24bd1a56518ea5af48.png",
    //           width: 183,
    //         },
    //         "{}",
    //       ],
    //       "message message message message",
    //       [123456789, "Username", 1, 1, 1, 10000, 1, ""],
    //       [
    //         88,
    //         "诶嘿",
    //         "medal-uname",
    //         123456789,
    //         13081892,
    //         "",
    //         0,
    //         13081892,
    //         13081892,
    //         13081892,
    //         0,
    //         1,
    //         865267,
    //       ],
    //       [19, 0, 6406234, "\u003e50000", 0],
    //       ["title-438-1", "title-438-1"],
    //       0,
    //       0,
    //       null,
    //       {
    //         ts: 1630854749,
    //         ct: "520027F7",
    //       },
    //       0,
    //       0,
    //       null,
    //       null,
    //       0,
    //       91,
    //     ],
    //   },
    //   {
    //     cmd: "DANMU_MSG",
    //     info: [
    //       [
    //         0,
    //         1,
    //         25,
    //         16777215,
    //         1630854749805,
    //         1630843073,
    //         0,
    //         "1e7695fe",
    //         0,
    //         0,
    //         0,
    //         "",
    //         1,
    //         "{}",
    //         "{}",
    //       ],
    //       "message message message message",
    //       [123456789, "Username", 1, 1, 1, 10000, 1, ""],
    //       [
    //         88,
    //         "诶嘿",
    //         "medal-uname",
    //         123456789,
    //         13081892,
    //         "",
    //         0,
    //         13081892,
    //         13081892,
    //         13081892,
    //         0,
    //         1,
    //         865267,
    //       ],
    //       [19, 0, 6406234, "\u003e50000", 0],
    //       ["title-438-1", "title-438-1"],
    //       0,
    //       0,
    //       null,
    //       {
    //         ts: 1630854749,
    //         ct: "520027F7",
    //       },
    //       0,
    //       0,
    //       null,
    //       null,
    //       0,
    //       91,
    //     ],
    //   },
    //   {
    //     cmd: "SUPER_CHAT_MESSAGE",
    //     data: {
    //       background_bottom_color: "#427D9E",
    //       background_color: "#DBFFFD",
    //       background_color_end: "#29718B",
    //       background_color_start: "#4EA4C5",
    //       background_icon: "",
    //       background_image:
    //         "https://i0.hdslb.com/bfs/live/a712efa5c6ebc67bafbe8352d3e74b820a00c13e.png",
    //       background_price_color: "#7DA4BD",
    //       color_point: 0.7,
    //       dmscore: 80,
    //       end_time:
    //         new Date(new Date().getTime() + 120 * 1000).getTime() / 1000,
    //       gift: {
    //         gift_id: 12000,
    //         gift_name: "醒目留言",
    //         num: 1,
    //       },
    //       id: 2195660,
    //       is_ranked: 1,
    //       is_send_audit: "0",
    //       medal_info: {
    //         anchor_roomid: 0,
    //         anchor_uname: "",
    //         guard_level: 0,
    //         icon_id: 0,
    //         is_lighted: 1,
    //         medal_color: 6126494,
    //         medal_color_border: 6126494,
    //         medal_color_end: 6126494,
    //         medal_color_start: 6126494,
    //         medal_level: 5,
    //         medal_name: "布丁ya",
    //         special: "",
    //         target_id: 294893147,
    //       },
    //       message: "////v////就……那个什么求关注",
    //       message_font_color: "#A3F6FF",
    //       message_trans: "",
    //       price: 50,
    //       rate: 1000,
    //       start_time: 1629271927,
    //       time: 120,
    //       token: "6742EC6C",
    //       trans_mark: 0,
    //       ts: 1629271927,
    //       uid: 503026492,
    //       user_info: {
    //         face: "http://i1.hdslb.com/bfs/face/410ed8084231388dfad6262bd29541dd2c5ecb64.jpg",
    //         face_frame: "",
    //         guard_level: 0,
    //         is_main_vip: 1,
    //         is_svip: 0,
    //         is_vip: 0,
    //         level_color: "#61c05a",
    //         manager: 0,
    //         name_color: "#666666",
    //         title: "0",
    //         uname: "七个喵吖",
    //         user_level: 19,
    //       },
    //     },
    //     roomid: "21987615",
    //   }, // SUPER_CHAT_MESSAGE
    //   {
    //     cmd: "SEND_GIFT",
    //     data: {
    //       action: "投喂",
    //       batch_combo_id: "ba543138-c9de-4e45-98ad-071eba24efbb",
    //       batch_combo_send: {
    //         action: "投喂",
    //         batch_combo_id: "ba543138-c9de-4e45-98ad-071eba24efbb",
    //         batch_combo_num: 1,
    //         blind_gift: {
    //           blind_gift_config_id: 20,
    //           gift_action: "爆出",
    //           original_gift_id: 31005,
    //           original_gift_name: "紫金宝盒",
    //         },
    //         gift_id: 31003,
    //         gift_name: "麦克风",
    //         gift_num: 1,
    //         send_master: null,
    //         uid: 312294960,
    //         uname: "祈愿相随の",
    //       },
    //       beatId: "",
    //       biz_source: "TLive",
    //       blind_gift: {
    //         blind_gift_config_id: 20,
    //         gift_action: "爆出",
    //         original_gift_id: 31005,
    //         original_gift_name: "紫金宝盒",
    //       },
    //       broadcast_id: 0,
    //       coin_type: "gold",
    //       combo_resources_id: 1,
    //       combo_send: {
    //         action: "投喂",
    //         combo_id: "78419810-4360-410b-b000-fbf5f2cf087e",
    //         combo_num: 1,
    //         gift_id: 31003,
    //         gift_name: "麦克风",
    //         gift_num: 1,
    //         send_master: null,
    //         uid: 312294960,
    //         uname: "祈愿相随の",
    //       },
    //       combo_stay_time: 5,
    //       combo_total_coin: 11000,
    //       crit_prob: 0,
    //       demarcation: 2,
    //       discount_price: 10000,
    //       dmscore: 80,
    //       draw: 0,
    //       effect: 0,
    //       effect_block: 0,
    //       face: "https://i0.hdslb.com/bfs/face/f30a9401a0ea2cf90325b94f67203454e1b16b12.jpg",
    //       giftId: 31003,
    //       giftName: "麦克风",
    //       giftType: 0,
    //       gold: 0,
    //       guard_level: 0,
    //       is_first: true,
    //       is_special_batch: 0,
    //       magnification: 1,
    //       medal_info: {
    //         anchor_roomid: 0,
    //         anchor_uname: "",
    //         guard_level: 0,
    //         icon_id: 0,
    //         is_lighted: 1,
    //         medal_color: 6126494,
    //         medal_color_border: 6126494,
    //         medal_color_end: 6126494,
    //         medal_color_start: 6126494,
    //         medal_level: 5,
    //         medal_name: "布丁ya",
    //         special: "",
    //         target_id: 294893147,
    //       },
    //       name_color: "",
    //       num: 1,
    //       original_gift_name: "",
    //       price: 11000,
    //       rcost: 371575234,
    //       remain: 0,
    //       rnd: "1290338572",
    //       send_master: null,
    //       silver: 0,
    //       super: 0,
    //       super_batch_gift_num: 1,
    //       super_gift_num: 1,
    //       svga_block: 0,
    //       tag_image: "",
    //       tid: "1628269455121000001",
    //       timestamp: 1628269455,
    //       top_list: null,
    //       total_coin: 10000,
    //       uid: 312294960,
    //       uname: "祈愿相随の",
    //     },
    //   },
    //   {
    //     cmd: "ROOM_BLOCK_MSG",
    //     dmscore: 30,
    //     operator: 1,
    //     uid: 1738501816,
    //     uname: "huff1041wrp",
    //   },
    //   {
    //     cmd: "LIVE",
    //     live_key: "164639492459629874",
    //     voice_background: "",
    //     sub_session_key: "164639492459629874sub_time:1628945921",
    //     live_platform: "pc",
    //     live_model: 0,
    //     roomid: 953650,
    //   },
    //   {
    //     cmd: "PREPARING",
    //     roomid: "22551538",
    //   },
    //   {
    //     cmd: "GUARD_BUY",
    //     data: {
    //       uid: 76742285,
    //       username: "夏木君Xmu",
    //       guard_level: 3,
    //       num: 1,
    //       price: 198000,
    //       gift_id: 10003,
    //       gift_name: "舰长",
    //       start_time: 1628333080,
    //       end_time: 1628333080,
    //     },
    //   },
    // ];
    //
    // const danmuItems_test = list.map((value, index) => {
    //   return <DanmuItem key={index} message={value as DanmuMessage} />;
    // });

    return (
      <ConfigContext.Consumer>
        {({config}) => (
          <div
            className="DanmuRender"
            style={{
              margin: config.style.listMargin,
              lineHeight: config.style.mainStyle.lineHeight,
            }}
          >
            {/*{danmuItems_test}*/}
            {danmuItems}
          </div>
        )}
      </ConfigContext.Consumer>
    );
  }
}
