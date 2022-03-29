/*
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

const { Sider, Content } = Layout;

class Props {}

type PageKey =
  | "dashboard"
  | "connectRoom"
  | "danmuViewerControl"
  | "history"
  | "settings"
  | "about";

export class MainState {
  config: Config;
  siderCollapsed: boolean;
  pageKey: PageKey;
  receiverStatus: ReceiverStatus;
  updateInfo: ReactNode;
}

export class Main extends React.Component<Props, MainState> {
  websocketClient: WebsocketClient;

  constructor(props: Props) {
    super(props);

    this.state = {
      config: window.electron.getConfig(),
      siderCollapsed: true,
      pageKey: "dashboard",
      receiverStatus: "close",
      updateInfo: null,
    };

    this.websocketClient = new WebsocketClient(
      this.onMessage.bind(this),
      () => null,
      () => {
        notification.warn({
          message: "已断开服务器连接",
          description: "已断开到指令转发服务器的连接",
          placement: "bottomRight",
        });
      },
      () => {
        notification.error({
          message: "服务器连接发生错误",
          description: "到指令转发服务器的连接发生了错误",
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
        currentPage = <h3>未完成</h3>;
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
                defaultSelectedKeys={["dashboard"]}
                theme={s.config.darkTheme ? "dark" : "light"}
              >
                <Menu.Item key={"dashboard"} icon={<DashboardOutlined />}>
                  总览
                </Menu.Item>
                <SubMenu
                  key={"functionList"}
                  icon={<AppstoreOutlined />}
                  title={"功能"}
                >
                  <Menu.Item key={"connectRoom"} icon={<ApiOutlined />}>
                    连接直播间
                  </Menu.Item>
                  <Menu.Item key={"danmuViewerControl"} icon={<EyeOutlined />}>
                    弹幕查看器
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key={"history"} icon={<HistoryOutlined />}>
                  历史记录
                </Menu.Item>
                <Menu.Item key={"settings"} icon={<SettingOutlined />}>
                  设置
                </Menu.Item>
                <Menu.Item key={"about"} icon={<InfoCircleOutlined />}>
                  关于
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
