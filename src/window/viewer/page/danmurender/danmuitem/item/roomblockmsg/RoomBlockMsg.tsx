/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {ReactNode} from "react";
import "./RoomBlockMsg.css";
import {DanmuMessage} from "../../../../../../../utils/command/DanmuMessage";
import {TRoomBlockMsg} from "../../../../../../../type/TRoomBlockMsg";
import {UserInfo} from "../../../../../../../component/bilibili/userinfo/UserInfo";
import {emptyUserInfo} from "../../../../../../../type/TUserInfo";

class Props {
  msg: DanmuMessage;
}

export class RoomBlockMsg extends React.Component<Props> {
  render(): ReactNode {
    const data: TRoomBlockMsg = this.props.msg as TRoomBlockMsg;
    return (
      <div className="RoomBlockMsg">
        <UserInfo userInfo={{...emptyUserInfo, uname: data.uname}}/>
        已被管理员禁言
      </div>
    );
  }
}
