/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./TextIcon.css";

class Props {
  style?: React.CSSProperties;
}

export class TextIcon extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className="TextIcon">
        <div style={this.props.style}>{this.props.children}</div>
      </div>
    );
  }
}
