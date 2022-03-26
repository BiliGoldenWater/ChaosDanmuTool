/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import style from "./RoomBlockMsg.module.css";
import { TBiliBiliDanmuContent } from "../../../../../../../type/bilibili/TBiliBiliDanmuContent";
import { TRoomBlockMsg } from "../../../../../../../type/bilibili/TRoomBlockMsg";
import { UserInfo } from "../../../../../../../component/bilibili/userinfo/UserInfo";
import { emptyUserInfo } from "../../../../../../../type/bilibili/userinfo/TUserInfo";

class Props {
  msg: TBiliBiliDanmuContent;
}

export class RoomBlockMsg extends React.Component<Props> {
  render(): ReactNode {
    const data: TRoomBlockMsg = this.props.msg as TRoomBlockMsg;
    return (
      <div className={style.RoomBlockMsg}>
        <UserInfo userInfo={{ ...emptyUserInfo, uname: data.uname }} />
        已被管理员禁言
      </div>
    );
  }
}
