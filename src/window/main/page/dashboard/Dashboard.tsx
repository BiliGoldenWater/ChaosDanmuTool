/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import { ConnectRoom } from "../connectroom/ConnectRoom";
import { ReceiverStatus } from "../../../../command/ReceiverStatusUpdate";
import { Button, Divider } from "antd";
import { DanmuViewerSwitch } from "../danmuviewercontrol/DanmuViewerControl";
import { ConfigItem } from "../../../../component/configitem/ConfigItem";

class Props {
  receiverStatus: ReceiverStatus;
  httpServerPort: number;
}

class State {
  mergePer: number;
}

export class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      mergePer: 30,
    };
  }

  render(): ReactNode {
    const p = this.props;
    const s = this.state;

    return (
      <div>
        <ConnectRoom receiverStatus={p.receiverStatus} />
        <Divider />
        <DanmuViewerSwitch />
        <Divider orientation={"left"}>统计</Divider>
        <ConfigItem
          type={"number"}
          value={s.mergePer}
          setNumber={(value) => {
            this.setState({
              mergePer: value,
            });
          }}
          name={"统计间隔"}
          min={1}
          description={
            <div>
              单位:秒
              <br />
              建议使用整数
            </div>
          }
        />
        <Button
          onClick={() => {
            const width = window.outerWidth;
            window.resizeTo(width - 1, window.outerHeight);
            window.setTimeout(() => {
              window.resizeTo(width, window.outerHeight);
            }, 100);
          }}
        >
          修复统计出界
        </Button>
        {/*<DanmuAnalysis mergePer={s.mergePer} />*/}
      </div>
    );
  }
}
