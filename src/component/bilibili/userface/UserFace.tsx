/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./UserFace.css";

class Props {
  face?: string;
}

export class UserFace extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className="UserFace">
        <img className="UserFace_face" src={this.props.face} alt={""}/>
      </div>
    );
  }
}
