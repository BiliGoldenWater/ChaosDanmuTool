/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import "./App.less";
import { Layout } from "./component/layout/Layout";
import { toggleDarkMode } from "./utils/ThemeUtils";
import { Content } from "./component/content/Content";
import { Menu } from "./component/menu/Menu";
import { createPagePath, PageKey, pageList } from "./page/Page";
import { MenuItem } from "./component/menu/MenuItem";
import { MainState } from "../MainState";
import { ConfigP, TConfigContext } from "../ConfigContext";
import { MainEventTarget, NewMessageEvent } from "../MainEventTarget";
import { TCommandPack } from "../../share/type/commandPack/TCommandPack";
import { WebSocketClient } from "../../share/network/client/WebSocketClient";

class Props {}

export class App extends React.Component<Props, MainState> {
  eventTarget: MainEventTarget = new MainEventTarget();
  webSocketClient: WebSocketClient = new WebSocketClient();

  constructor(props: Props) {
    super(props);

    this.state = {
      config: window.electron.getConfig(),

      path: createPagePath("", pageList[0].key),
    };

    const { config: cfg } = this.state;

    toggleDarkMode(cfg.darkTheme);

    this.webSocketClient.updateOption({
      port: cfg.httpServerPort,

      location: "App.webSocketClient",
      onMessage: this.onMessage.bind(this),
    });
    this.webSocketClient.open();
  }

  componentWillUnmount() {
    this.webSocketClient.close();
  }

  onMessage(event: MessageEvent): void {
    const commandPack: TCommandPack = JSON.parse(event.data);

    this.eventTarget.dispatchEvent(new NewMessageEvent(commandPack));
  }

  render(): ReactNode {
    const s = this.state;
    const path = s.path;

    const currentPage = pageList
      .find((value) => value.key === path.host)
      ?.render?.() ?? <Content padding>{path.host} 未完成</Content>;

    const configContext: TConfigContext = {
      state: s,
      setState: this.setState,
      eventTarget: this.eventTarget,
    };

    return (
      <ConfigP value={configContext}>
        <div>
          <Layout
            sider={
              <Menu
                selectedKey={path.host}
                itemList={pageList.map((v) => (
                  <MenuItem key={v.key} name={v.name} icon={v.icon} />
                ))}
                onSelectNew={(value: PageKey) => {
                  this.setState((prev) => {
                    prev.path.host = value;
                    return { path: prev.path };
                  });
                }}
              />
            }
          >
            {currentPage}
          </Layout>
        </div>
      </ConfigP>
    );
  }
}
