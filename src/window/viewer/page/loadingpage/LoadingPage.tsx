/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./LoadingPage.css";

export class Props {
  action?: string;
  description?: string;
}

export class LoadingPage extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className="LoadingPage">
        <div className="Action">{this.props.action}</div>
        <div className="Description">{this.props.description}</div>
      </div>
    );
  }
}
