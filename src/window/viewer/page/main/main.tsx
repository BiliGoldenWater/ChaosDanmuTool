import React from "react";
import style from "./main.module.css";
import {
  Config,
  DanmuViewCustomConfig,
  defaultConfig,
  defaultDanmuViewCustom,
} from "../../../../utils/Config";
import { WebsocketClient } from "../../../../utils/client/WebsocketClient";
import { getParam } from "../../utils/UrlParamGeter";
import { LoadingPage } from "./loadingpage/LoadingPage";
import { ConnectFail } from "./connectfail/ConnectFail";
import { getConfigUpdateCmd } from "../../../../utils/command/ConfigUpdate";
import { getMessageCommandCmd } from "../../../../utils/command/MessageCommand";
import {
  ActivityUpdate,
  getActivityUpdateMessageCmd,
} from "../../../../utils/command/ActivityUpdate";
import { ConfigContext } from "../../utils/ConfigContext";
import { StatusBar } from "../../../../component/statusbar/StatusBar";
import { DanmuRender } from "./danmurender/DanmuRender";
import { DanmuMessageWithKey } from "../../../../utils/command/DanmuMessage";

class Props {}

class State {
  config: DanmuViewCustomConfig;
  danmuList: DanmuMessageWithKey[];
  connectState: "open" | "close" | "error";
  connectAttemptNumber: number;
  activity: number;
  fansNumber: number;
  statusMessage: string;
}

export class Main extends React.Component<Props, State> {
  websocketClient: WebsocketClient;
  maxAttemptNumber: number;
  serverAddress: string;
  serverPort: number;
  reconnectId: number;
  danmuCount: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      config: defaultDanmuViewCustom,
      danmuList: [],
      connectState: "close",
      connectAttemptNumber: 0,
      activity: 0,
      fansNumber: 0,
      statusMessage: "",
    };

    this.serverAddress = getParam("address");
    this.serverPort = parseInt(getParam("port"));
    this.maxAttemptNumber =
      parseInt(getParam("maxReconnectAttemptNum")) ||
      defaultConfig.danmuViewConfig.maxReconnectAttemptNumber;

    this.danmuCount = 0;

    this.websocketClient = new WebsocketClient(
      (event) => {
        this.processCommand(event.data);
      },
      () => {
        this.setState({
          connectState: "open",
        });
        this.setState({
          connectAttemptNumber: 0,
        });
      },
      () => {
        this.setState({
          connectState: "close",
        });
        this.tryReconnect();
      },
      () => {
        this.setState({
          connectState: "error",
        });
        this.tryReconnect();
      }
    );

    this.websocketClient.connect(this.serverAddress, this.serverPort);
  }

  tryReconnect(): void {
    window.clearInterval(this.reconnectId);
    this.reconnectId = window.setInterval(() => {
      if (this.state.connectAttemptNumber >= this.maxAttemptNumber) return;
      this.websocketClient.connect(this.serverAddress, this.serverPort);
      this.setState((prevState) => {
        return {
          ...prevState,
          connectAttemptNumber: prevState.connectAttemptNumber + 1,
        };
      });
      window.clearInterval(this.reconnectId);
    }, 500);
  }

  processCommand(commandStr: string): void {
    const command = JSON.parse(commandStr);
    console.log(this.state);
    switch (command.cmd) {
      case getConfigUpdateCmd(): {
        const config: Config = command.data;

        for (const i in config.danmuViewCustoms) {
          const viewConfig = config.danmuViewCustoms[i];
          if (viewConfig.name == getParam("name")) {
            this.setState({
              config: viewConfig,
            });
          }
        }
        break;
      }
      case getActivityUpdateMessageCmd(): {
        const cmd: ActivityUpdate = command;
        this.setState({
          activity: cmd.data.activity,
        });
        break;
      }
      case getMessageCommandCmd(): {
        this.setState((prevState) => {
          const list: DanmuMessageWithKey[] = prevState.danmuList;
          list.push({
            key: this.danmuCount,
            msg: JSON.parse(command.data),
          });
          this.danmuCount++;

          while (
            list.length > 0 &&
            list.length > this.state.config.maxDanmuNumber
          ) {
            list.shift();
          }

          return {
            ...prevState,
            danmuList: list,
          };
        });
        break;
      }
    }
  }

  render(): JSX.Element {
    return (
      <div className={style.main}>
        <ConfigContext.Provider
          value={{ config: this.state.config, setConfig: undefined }}
        >
          {this.state.connectState == "open" && (
            <StatusBar message={this.state.statusMessage}>1</StatusBar>
          )}
          <DanmuRender danmuList={this.state.danmuList} />
        </ConfigContext.Provider>
        {this.state.connectState != "open" &&
          this.state.connectAttemptNumber < this.maxAttemptNumber && (
            <LoadingPage
              action={"连接中"}
              description={"尝试次数: " + this.state.connectAttemptNumber}
            />
          )}
        {this.state.connectAttemptNumber >= this.maxAttemptNumber && (
          <ConnectFail
            connectMethod={() => {
              this.setState((prevState) => {
                return {
                  ...prevState,
                  connectAttemptNumber: 0,
                };
              });
              this.tryReconnect();
            }}
          />
        )}
      </div>
    );
  }
}
