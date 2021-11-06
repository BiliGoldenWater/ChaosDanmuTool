import { Config } from "../../../utils/config/Config";
import {
  getStatusUpdateMessageCmd,
  ReceiverStatus,
  ReceiverStatusUpdate,
} from "../../../utils/command/ReceiverStatusUpdate";
import React, { ReactNode } from "react";
import { ConfigContext } from "../utils/ConfigContext";
import { ReceiverStatusIndicator } from "../../../component/receiverstatusindicator/ReceiverStatusIndicator";
import { StatusBar } from "../../../component/statusbar/StatusBar";
import {
  ConfigUpdate,
  getConfigUpdateCmd,
} from "../../../utils/command/ConfigUpdate";
import { WebsocketClient } from "../../../utils/client/WebsocketClient";
import { DateFormat } from "../../../utils/DateFormat";

class Props {}

class State {
  config: Config;
  receiverStatus: ReceiverStatus;
  statusMessage: string;
}

export class Main extends React.Component<Props, State> {
  websocketClient: WebsocketClient;

  constructor(props: Props) {
    super(props);

    this.state = {
      config: JSON.parse(window.electron.getConfig()),
      receiverStatus: "close",
      statusMessage: "",
    };

    this.websocketClient = new WebsocketClient(
      this.onMessage.bind(this),
      () => {
        this.setState({
          statusMessage: DateFormat() + " 服务器已连接",
        });
      },
      () => {
        this.setState({
          statusMessage: DateFormat() + " 服务器已断开 ",
        });
      },
      () => {
        this.setState({
          statusMessage: DateFormat() + " 服务器连接发生错误 已断开",
        });
      }
    );

    const websocketServerConfig =
      this.state.config.danmuViewConfig.websocketServer;

    this.websocketClient.connect(
      websocketServerConfig.host,
      websocketServerConfig.port
    );
  }

  onMessage(event: MessageEvent): void {
    const msgObj = JSON.parse(event.data);
    console.log(msgObj);

    switch (msgObj.cmd) {
      case getStatusUpdateMessageCmd(): {
        const msg: ReceiverStatusUpdate = msgObj;
        this.setState({
          receiverStatus: msg.data.status,
        });
        break;
      }
      case getConfigUpdateCmd(): {
        const msg: ConfigUpdate = msgObj;
        this.setState({
          config: msg.data,
        });
        break;
      }
    }
  }

  render(): ReactNode {
    const configContext = {
      config: this.state.config,
      setConfig: (config: Config) => {
        this.setState({
          config: config,
        });
        window.electron.updateConfig(JSON.stringify(config));
      },
    };

    return (
      <ConfigContext.Provider value={configContext}>
        <div>1</div>
        <StatusBar message={this.state.statusMessage}>
          <ReceiverStatusIndicator status={this.state.receiverStatus} />
        </StatusBar>
      </ConfigContext.Provider>
    );
  }
}
