/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./UserInfo.css";
import {TUserInfo as TUserInfo} from "../../../type/TUserInfo";
import {FansMedal} from "../fansmedal/FansMedal";
import {TMedalInfo} from "../../../type/TMedalInfo";
import {UserName} from "../username/UserName";
import {AdminIcon} from "../adminicon/AdminIcon";
import {VipIcon} from "../vipicon/VipIcon";
import {UserFace} from "../userface/UserFace";

class Props {
  userInfo: TUserInfo;
  medalInfo?: TMedalInfo;
}

export class UserInfo extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className="UserInfo">
        {this.props.medalInfo && <FansMedal medalInfo={this.props.medalInfo}/>}
        {this.props.userInfo.manager == 1 && <AdminIcon/>}
        {this.props.userInfo.is_vip == 1 && <VipIcon/>}
        {this.props.userInfo.is_svip == 1 && <VipIcon isSvip={true}/>}
        {this.props.userInfo.face && this.props.userInfo.face != "" && (
          <UserFace face={this.props.userInfo.face}/>
        )}
        <UserName name={this.props.userInfo.uname}/>
      </div>
    );
  }
}
