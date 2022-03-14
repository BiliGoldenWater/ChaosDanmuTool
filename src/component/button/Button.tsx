/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./Button.css";

class Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
}

export class Button extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <button
        className={
          "Button" + (this.props.className ? " " + this.props.className : "")
        }
        style={this.props.style}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}
