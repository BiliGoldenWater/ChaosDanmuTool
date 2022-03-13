/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import { ConfigContext } from "../../../window/viewer/utils/ConfigContext";
import style from "./GiftIcon.module.css";

class Props {
  src: string;
}

export class GiftIcon extends React.Component<Props> {
  render(): ReactNode {
    return (
      <ConfigContext.Consumer>
        {({ config }) => (
          <img
            className={style.GiftIcon}
            src={this.props.src}
            alt={""}
            style={config.style.giftIcon}
          />
        )}
      </ConfigContext.Consumer>
    );
  }
}
