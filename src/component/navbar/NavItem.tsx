import React, { memo } from "react";
import style from "./NavBar.module.css";

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
        style.navItem +
        (props.active
          ? " " + style.navItemActive
          : " " + style.navItemSwitchable)
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
