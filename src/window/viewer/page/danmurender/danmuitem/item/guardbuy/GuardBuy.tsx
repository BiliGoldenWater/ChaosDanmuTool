/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import {
  getGuardIconUrl,
  TGuardBuy,
} from "../../../../../../../type/bilibili/TGuardBuy";
import { UserInfo } from "../../../../../../../component/bilibili/userinfo/UserInfo";
import { emptyUserInfo } from "../../../../../../../type/bilibili/userinfo/TUserInfo";
import { GiftContent } from "../../../../../../../component/bilibili/giftcontent/GiftContent";

class Props {
  guardBuy: TGuardBuy;
}

export class GuardBuy extends React.Component<Props> {
  render(): ReactNode {
    const data = this.props.guardBuy.data;
    return (
      <div>
        <UserInfo userInfo={{ ...emptyUserInfo, uname: data.username }} />
        <GiftContent
          action={"购买"}
          name={data.gift_name}
          iconUrl={getGuardIconUrl(data.guard_level)}
          num={data.num}
          price={((data.price / 1000) * data.num).toFixed(2).toString() + "￥"}
        />
      </div>
    );
  }
}
