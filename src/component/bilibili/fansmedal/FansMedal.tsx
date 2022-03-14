/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./FansMedal.css";
import {TMedalInfo} from "../../../type/TMedalInfo";
import {rgbI2S} from "../../../utils/FormatConverters";
import {getGuardIconUrl} from "../../../type/TGuardBuy";

class Props {
  medalInfo: TMedalInfo;
}

export class FansMedal extends React.Component<Props> {
  render(): JSX.Element {
    const medalInfo = this.props.medalInfo;

    if (!medalInfo || !medalInfo.is_lighted) return null;

    const medal_color_border = rgbI2S(medalInfo.medal_color_border);
    const medal_color_start = rgbI2S(medalInfo.medal_color_start);
    const medal_color_end = rgbI2S(medalInfo.medal_color_end);
    const medal_color = rgbI2S(medalInfo.medal_color);
    return (
      <div className="FansMedal">
        <div
          className="FansMedal_name"
          style={{
            borderColor: medal_color_border,
            backgroundImage: "linear-gradient(45deg,{0},{1})"
              .replace("{0}", medal_color_start)
              .replace("{1}", medal_color_end),
          }}
        >
          {medalInfo.guard_level != 0 && (
            <img
              className="FansMedal_guardIcon"
              src={getGuardIconUrl(medalInfo.guard_level)}
              alt={""}
            />
          )}
          {medalInfo.medal_name}
        </div>
        <div
          className="FansMedal_lvl"
          style={{
            borderColor: medal_color_border,
            color: medal_color,
          }}
        >
          {medalInfo.medal_level}
        </div>
      </div>
    );
  }
}
