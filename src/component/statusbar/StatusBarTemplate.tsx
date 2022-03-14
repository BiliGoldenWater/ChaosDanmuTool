/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {ReactNode} from "react";
import "./StatusBar.css";

class Props {
  className: string;
  message: string | ReactNode;
  style?: React.CSSProperties;
}

export class StatusBarTemplate extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={this.props.className}>
        <div className="statusBar_content" style={this.props.style}>
          <div>{this.props.message}</div>
          <div className="statusBar_itemList">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
