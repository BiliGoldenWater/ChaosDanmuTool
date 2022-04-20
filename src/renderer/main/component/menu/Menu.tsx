/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import "./Menu.less";
import { MenuItem, MenuItemProps } from "./MenuItem";
import { EllipsisOutlined, QuestionOutlined } from "@ant-design/icons";

class Props {
  itemList: ReactNode[];
  selectedKey: string;
  onSelectNew: (key: string) => void;
}

class State {
  showName: boolean;
}

export class Menu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showName: false,
    };
  }

  render(): ReactNode {
    const { itemList: items, selectedKey, onSelectNew } = this.props;
    const { showName } = this.state;

    const itemList = items.map((value) => {
      if (!React.isValidElement(value)) return value;

      const onClick = () => {
        onSelectNew(value.key as string);
      };

      const props: MenuItemProps = {
        ...value.props,
        selected: false,
        onClick: onClick,
      };
      if (value.key === selectedKey) {
        props.selected = true;
        return React.cloneElement(value, props);
      } else {
        return React.cloneElement(value, props);
      }
    });

    return (
      <div className={showName ? "MenuShowName" : "Menu"}>
        <div className={"MenuItemList"}>{itemList}</div>
        <div className={"MenuItemListShowNameSwitch"}>
          <MenuItem
            name={"收起"}
            icon={showName ? <EllipsisOutlined /> : <QuestionOutlined />}
            onClick={() => {
              this.setState((prevState) => ({ showName: !prevState.showName }));
            }}
          />
        </div>
      </div>
    );
  }
}
