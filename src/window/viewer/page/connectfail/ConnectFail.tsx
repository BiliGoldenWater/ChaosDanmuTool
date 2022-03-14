/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./ConnectFail.css";
import { Button } from "../../../../component/button/Button";

class Props {
  connectMethod?: () => void;
}

export class ConnectFail extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={"ConnectFail"}>
        连接失败
        <Button
          onClick={() => {
            this.props.connectMethod && this.props.connectMethod();
          }}
          className={"ConnectFail_retryBtn"}
        >
          重新尝试
        </Button>
      </div>
    );
  }
}
