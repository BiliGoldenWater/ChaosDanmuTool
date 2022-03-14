/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import "./StatusUpdate.css";
import { DanmuMessage } from "../../../../../../../utils/command/DanmuMessage";
import { ReceiverStatusUpdate } from "../../../../../../../utils/command/ReceiverStatusUpdate";

class Props {
  msg: DanmuMessage;
}

export class StatusUpdate extends React.Component<Props> {
  render(): ReactNode {
    const rsu: ReceiverStatusUpdate = this.props.msg as ReceiverStatusUpdate;
    let statusMsg = "NULL";

    switch (rsu.data.status) {
      case "connecting": {
        statusMsg = "连接中";
        break;
      }
      case "open": {
        statusMsg = "已连接";
        break;
      }
      case "close": {
        statusMsg = "未连接";
        break;
      }
      case "error": {
        statusMsg = "发生了错误";
        break;
      }
    }

    return (
      <div className="StatusUpdate">直播间连接状态现在为: {statusMsg}</div>
    );
  }
}
