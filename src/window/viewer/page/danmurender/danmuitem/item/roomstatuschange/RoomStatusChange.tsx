/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {ReactNode} from "react";
import "./RoomStatusChange.css";
import {ConfigContext} from "../../../../../utils/ConfigContext";
import {TPreparing} from "../../../../../../../type/TPreparing";
import {TLive} from "../../../../../../../type/TLive";

class Props {
  changeMsg: TLive | TPreparing;
}

export class RoomStatusChange extends React.Component<Props> {
  render(): ReactNode {
    let status = "";
    switch (this.props.changeMsg.cmd) {
      case "LIVE": {
        status = "直播中";
        break;
      }
      case "PREPARING": {
        status = "准备中";
        break;
      }
    }
    return (
      <div className="RoomStatusChange">
        直播间
        <ConfigContext.Consumer>
          {({config}) => (
            <div style={config.style.userName}>
              {this.props.changeMsg.roomid}
            </div>
          )}
        </ConfigContext.Consumer>
        状态更改为{status}
      </div>
    );
  }
}
