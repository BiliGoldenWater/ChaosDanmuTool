/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./FunctionCard.css";

class Props {
  className?: string;
  name?: string;
  description?: string;
}

export class FunctionCard extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div
        className={
          "" + (this.props.className ? " " + this.props.className : "")
        }
      >
        <div className="functionCard_name">
          <h5>{this.props.name}</h5>
        </div>
        <div className="functionCard_description">{this.props.description}</div>
        <div className="functionCard_body">{this.props.children}</div>
      </div>
    );
  }
}
