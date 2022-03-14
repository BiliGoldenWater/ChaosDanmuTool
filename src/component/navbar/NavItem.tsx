/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { memo } from "react";
import "./NavBar.css";

class Props {
  index: number;
  onClick: (index: number) => void;
  name: string;
  active?: boolean;
}

const NavItem = (props: Props) => {
  return (
    <div
      className={
        "navItem" + (props.active ? " navItemActive" : " navItemSwitchable")
      }
      onClick={() => {
        props.onClick(props.index);
      }}
    >
      <h4>{props.name}</h4>
    </div>
  );
};

export default memo(NavItem);
