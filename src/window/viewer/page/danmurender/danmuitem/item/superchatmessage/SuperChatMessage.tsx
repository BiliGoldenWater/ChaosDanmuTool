/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./SuperChatMessage.css";
import { UserInfo } from "../../../../../../../component/bilibili/userinfo/UserInfo";
import { TSuperChatMessage } from "../../../../../../../type/TSuperChatMessage";
import { DanmuContent } from "../../../../../../../component/bilibili/danmucontent/DanmuContent";
import { ConfigContext } from "../../../../../utils/ConfigContext";

class Props {
  superChatMessage: TSuperChatMessage;
}

class State {
  ts: number;
}

export class SuperChatMessage extends React.Component<Props, State> {
  updateIntervalId: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      ts: new Date().getTime() / 1000,
    };

    this.updateIntervalId = window.setInterval(() => {
      this.setState({ ts: new Date().getTime() / 1000 });
      const scm: TSuperChatMessage = this.props.superChatMessage;
      if (this.state.ts > scm.data.end_time) {
        window.clearInterval(this.updateIntervalId);
      }
    }, 100);
  }

  render(): JSX.Element {
    const scm: TSuperChatMessage = this.props.superChatMessage;
    return (
      <ConfigContext.Consumer>
        {({ config }) => (
          <div
            className={
              "" +
              (this.state.ts <= scm.data.end_time && config.superChatAlwaysOnTop
                ? " SuperChatMessage_sticky"
                : "")
            }
          >
            <img
              src={scm.data.background_image}
              style={{ display: "none" }}
              alt={""}
            />
            {/* load img to cache for "background-image" to bypass referrer policy */}
            <div
              className="SuperChatMessage_top"
              style={{
                backgroundImage: "url(" + scm.data.background_image + ")",
                backgroundColor: scm.data.background_color,
                borderColor: scm.data.background_bottom_color,
              }}
            >
              <UserInfo
                userInfo={scm.data.user_info}
                medalInfo={scm.data.medal_info}
              />
              <div className="SuperChatMessage_top_price">
                {scm.data.price}￥
              </div>
            </div>
            <progress
              className="SuperChatMessage_progress"
              max={scm.data.time}
              value={scm.data.time - (scm.data.end_time - this.state.ts)}
              style={{ backgroundColor: scm.data.background_bottom_color }}
            />
            <div
              className="SuperChatMessage_bottom"
              style={{
                backgroundColor: scm.data.background_bottom_color,
                borderColor: scm.data.background_bottom_color,
              }}
            >
              <DanmuContent
                content={scm.data.message}
                color={scm.data.message_font_color}
              />
            </div>
          </div>
        )}
      </ConfigContext.Consumer>
    );
  }
}
