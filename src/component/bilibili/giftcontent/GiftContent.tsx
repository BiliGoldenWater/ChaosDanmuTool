/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {ReactNode} from "react";
import "./GiftContent.css";
import {GiftIcon} from "../gifticon/GiftIcon";

class Props {
  action: string;
  name: string;
  iconUrl: string;
  num: number;
  price: string;
}

export class GiftContent extends React.Component<Props> {
  render(): ReactNode {
    return (
      <div className="GiftContent">
        {this.props.action} {this.props.name}{" "}
        <GiftIcon src={this.props.iconUrl}/> 共 {this.props.num} 个{" "}
        {this.props.price}
      </div>
    );
  }
}
