/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import "./main.less";
import { Config } from "../../../utils/config/Config";
import { getProperty, setProperty } from "dot-prop";
import {
  getStatusUpdateMessageCmd,
  ReceiverStatus,
  ReceiverStatusUpdate,
} from "../../../command/ReceiverStatusUpdate";
import { ConfigContext, TConfigContext } from "../utils/ConfigContext";
import {
  ConfigUpdate,
  getConfigUpdateCmd,
} from "../../../command/ConfigUpdate";
import { WebsocketClient } from "../../../utils/client/WebsocketClient";
import { ConfigProvider, Layout, Menu, notification } from "antd";
import {
  ApiOutlined,
  AppstoreOutlined,
  CompassOutlined,
  DashboardOutlined,
  EyeOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import { ConnectRoom } from "./connectroom/ConnectRoom";
import { DanmuViewerControl } from "./danmuviewercontrol/DanmuViewerControl";
import { Settings } from "./settings/Settings";
import { UpdateChecker } from "../utils/UpdateChecker";
import { Dashboard } from "./dashboard/Dashboard";
import { About } from "./about/About";
import { MessageLog } from "../../../command/messagelog/MessageLog";
import { TAnyMessage } from "../../../type/TAnyMessage";
import { History } from "./history/History";
import { Gacha } from "./gacha/Gacha";

const { Sider, Content } = Layout;

const defaultKey: PageKey = "dashboard";

class Props {}

type PageKey =
  | "dashboard"
  | "connectRoom"
  | "danmuViewerControl"
  | "gacha"
  | "history"
  | "settings"
  | "about";

type MessageListener = (message: TAnyMessage) => void;

export class MainState {
  config: Config;
  siderCollapsed: boolean;
  pageKey: PageKey;
  receiverStatus: ReceiverStatus;
  updateInfo: ReactNode;
  addMessageListener: (id: string, listener: MessageListener) => void;
  hasMessageListener: (id: string) => boolean;
  removeMessageListener: (id: string) => void;
}

export class Main extends React.Component<Props, MainState> {
  websocketClient: WebsocketClient;
  messageListeners: Map<string, MessageListener> = new Map();

  constructor(props: Props) {
    super(props);

    this.state = {
      config: window.electron.getConfig(),
      siderCollapsed: true,
      pageKey: defaultKey,
      receiverStatus: "close",
      updateInfo: null,
      addMessageListener: (id, listener) => {
        this.messageListeners.set(id, listener);
      },
      hasMessageListener: (id) => {
        return this.messageListeners.has(id);
      },
      removeMessageListener: (id) => {
        this.messageListeners.delete(id);
      },
    };

    this.websocketClient = new WebsocketClient(
      this.onMessage.bind(this),
      () => null,
      () => {
        notification.warn({
          message: "????????????????????????",
          description: "??????????????????????????????????????????",
          placement: "bottomRight",
        });
      },
      () => {
        notification.error({
          message: "???????????????????????????",
          description: "????????????????????????????????????????????????",
          placement: "bottomRight",
        });
      }
    );

    this.websocketClient.connect("localhost", this.state.config.httpServerPort);

    UpdateChecker.checkUpdate(this.state.config).then(
      (updateInfo: ReactNode) => {
        this.setState({ updateInfo: updateInfo });
      }
    );
  }

  onMessage(event: MessageEvent): void {
    const msgObj: MessageLog<TAnyMessage> = JSON.parse(event.data);

    const anyMsg: TAnyMessage = msgObj.message;

    switch (anyMsg.cmd) {
      case getStatusUpdateMessageCmd(): {
        const msg: ReceiverStatusUpdate = anyMsg;

        this.setState({ receiverStatus: msg.status });
        break;
      }
      case getConfigUpdateCmd(): {
        const msg: ConfigUpdate = anyMsg;
        this.setState({
          config: msg.data,
        });
        break;
      }
    }

    Array.from(this.messageListeners.values()).forEach((value) => {
      try {
        value(anyMsg);
      } catch (e) {
        console.error(
          `Main.onMessage.callEvent\n${e.name}\n${e.message}\n${e.stack}`
        );
      }
    });
  }

  render(): ReactNode {
    const s = this.state;

    if (this.state.config.darkTheme) {
      import("antd/dist/antd.dark.less");
    } else {
      import("antd/dist/antd.less");
    }

    let currentPage: ReactNode;

    switch (s.pageKey) {
      case "dashboard": {
        currentPage = (
          <Dashboard
            receiverStatus={s.receiverStatus}
            httpServerPort={this.state.config.httpServerPort}
          />
        );
        break;
      }
      case "connectRoom": {
        currentPage = <ConnectRoom receiverStatus={s.receiverStatus} />;
        break;
      }

      case "danmuViewerControl": {
        currentPage = <DanmuViewerControl />;
        break;
      }
      case "history": {
        currentPage = <History />;
        break;
      }
      case "gacha": {
        currentPage = <Gacha />;
        break;
      }

      case "settings": {
        currentPage = <Settings />;
        break;
      }
      case "about": {
        currentPage = (
          <About
            checkUpdate={(whenDone) => {
              UpdateChecker.checkUpdate(s.config, true).then(
                (updateInfo: ReactNode) => {
                  this.setState({ updateInfo: updateInfo });
                  whenDone();
                }
              );
            }}
          />
        );
        break;
      }
      default: {
        currentPage = <h3>?????????</h3>;
      }
    }

    const configContext: TConfigContext = {
      get: (key: string, defaultValue?: unknown) => {
        return getProperty(this.state.config, key, defaultValue);
      },
      set: (key: string, value: unknown) => {
        this.setState((prevState) => {
          setProperty(prevState.config, key, value);
          window.electron.updateConfig(prevState.config);
          return prevState;
        });
      },
      updateConfig: (config: Config) => {
        this.setState({
          config: config,
        });
        window.electron.updateConfig(config);
      },
      state: s,
    };

    return (
      <ConfigContext.Provider value={configContext}>
        <ConfigProvider>
          {s.updateInfo}
          <Layout>
            <Sider
              collapsible={true}
              collapsedWidth={"4em"}
              collapsed={s.siderCollapsed}
              theme={s.config.darkTheme ? "dark" : "light"}
              onCollapse={(collapsed) => {
                this.setState({ siderCollapsed: collapsed });
              }}
            >
              <Menu
                mode={"inline"}
                style={{ userSelect: "none" }}
                onClick={(event) => {
                  this.setState({ pageKey: event.key as PageKey });
                }}
                defaultSelectedKeys={[defaultKey]}
                theme={s.config.darkTheme ? "dark" : "light"}
              >
                <Menu.Item key={"dashboard"} icon={<DashboardOutlined />}>
                  ??????
                </Menu.Item>
                <SubMenu
                  key={"functionList"}
                  icon={<AppstoreOutlined />}
                  title={"??????"}
                >
                  <Menu.Item key={"connectRoom"} icon={<ApiOutlined />}>
                    ???????????????
                  </Menu.Item>
                  <Menu.Item key={"danmuViewerControl"} icon={<EyeOutlined />}>
                    ???????????????
                  </Menu.Item>
                  <Menu.Item
                    key={"gacha"}
                    icon={<CompassOutlined spin={true} />}
                  >
                    ????????????
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key={"history"} icon={<HistoryOutlined />}>
                  ????????????
                </Menu.Item>
                <Menu.Item key={"settings"} icon={<SettingOutlined />}>
                  ??????
                </Menu.Item>
                <Menu.Item key={"about"} icon={<InfoCircleOutlined />}>
                  ??????
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ minHeight: "100vh" }}>
              <div
                className="main_content"
                style={
                  s.config.darkTheme
                    ? { backgroundColor: "#1f1f1f" }
                    : { backgroundColor: "#fff" }
                }
              >
                {currentPage}
              </div>
            </Content>
          </Layout>
        </ConfigProvider>
      </ConfigContext.Provider>
    );
  }
}
