/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import "./Gacha.less";
import { v4 as uuidv4 } from "uuid";
import { Button, Card, Modal, Tooltip } from "antd";
import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import {
  GachaCheckResult,
  GachaCheckResultWithUName,
  GachaUtils,
} from "../../utils/GachaUtils";
import { GachaUser } from "./GachaUser";
import { GachaLogItem } from "./GachaLogItem";
import { ConfigContext } from "../../utils/ConfigContext";
import { TAnyMessage } from "../../../../type/TAnyMessage";
import { MessageCommand } from "../../../../command/MessageCommand";
import { parseDanmuMsg } from "../../../../type/bilibili/TDanmuMsg";
import { MainState } from "../main";
import { ConfigItem } from "../../../../component/configitem/ConfigItem";

class Props {}

class State {
  gachaLog: GachaCheckResultWithUName[];
  settingsVisible: boolean;
  update: number;
}

export class Gacha extends React.Component<Props, State> {
  mainState: MainState = null;
  listenerId = "gacha";

  constructor(props: Props) {
    super(props);

    this.state = {
      gachaLog: [],
      settingsVisible: false,
      update: 0,
    };
  }

  componentWillUnmount() {
    this.mainState?.removeMessageListener(this.listenerId);
  }

  update() {
    this.setState((prevState) => ({ update: prevState.update + 1 }));
  }

  newLog(uName: string, result: GachaCheckResult) {
    this.setState((prev: State) => {
      const l = prev.gachaLog;
      l.push([uName, result]);
      return {
        gachaLog: l,
      };
    });
  }

  onMessage(message: TAnyMessage) {
    if (message.cmd !== "messageCommand") return;
    const msg = (message as MessageCommand).data;

    switch (msg.cmd) {
      case "DANMU_MSG": {
        const dm = parseDanmuMsg(msg);

        const result = GachaUtils.check(dm);

        switch (result) {
          case GachaCheckResult.WrongContent:
            break;
          case GachaCheckResult.Joined:
            GachaUtils.updateLatestDanmu(dm);
            this.update();
            break;
          case GachaCheckResult.Ok:
            GachaUtils.join(dm);
            this.update();
            this.newLog(dm.data.uName, result);
            break;
          default: {
            this.newLog(dm.data.uName, result);
          }
        }

        break;
      }
    }
  }

  render() {
    const joinedUsers = Array.from(GachaUtils.joinedUsers.entries());

    const users = joinedUsers
      .sort((a, b) => {
        const aIsWinner = GachaUtils.winners.has(a[0]);
        const bIsWinner = GachaUtils.winners.has(b[0]);

        if (!aIsWinner && bIsWinner) return 1;
        if (aIsWinner && bIsWinner) return 0;
        if (aIsWinner && !bIsWinner) return -1;
      })
      .map((entry) => (
        <GachaUser
          key={entry[0]}
          user={entry[1]}
          isWinner={GachaUtils.winners.has(entry[0])}
        />
      ));

    const logs = this.state.gachaLog.map((value) => (
      <GachaLogItem key={uuidv4()} item={value} />
    ));

    return (
      <ConfigContext.Consumer>
        {({ state: s }) => {
          const listening = s.hasMessageListener(this.listenerId);
          this.mainState = s;
          GachaUtils.medalRoomid = s.config.danmuReceiver.roomid;

          return (
            <Card className={"main_content_without_padding Gacha"}>
              <Modal
                visible={this.state.settingsVisible}
                closable={false}
                footer={[
                  <Button
                    key={"close"}
                    onClick={() => {
                      this.setState({ settingsVisible: false });
                    }}
                  >
                    ??????
                  </Button>,
                ]}
              >
                <ConfigItem
                  type={"string"}
                  name={"??????"}
                  value={GachaUtils.item}
                  setString={(value) => {
                    GachaUtils.item = value;
                    this.update();
                  }}
                />
                <ConfigItem
                  type={"number"}
                  name={"????????????"}
                  value={GachaUtils.winNum}
                  setNumber={(value) => {
                    GachaUtils.winNum = value;
                    this.update();
                  }}
                  min={1}
                />
                <ConfigItem
                  type={"string"}
                  name={"????????????"}
                  value={GachaUtils.joinText}
                  setString={(value) => {
                    GachaUtils.joinText = value;
                    this.update();
                  }}
                />
                <ConfigItem
                  type={"number"}
                  name={"????????????"}
                  value={GachaUtils.userLevelLimit}
                  setNumber={(value) => {
                    GachaUtils.userLevelLimit = value;
                    this.update();
                  }}
                  min={-1}
                  description={
                    <div>
                      bilibili?????????????????? UL
                      <br />
                      ?????????????????????????????????
                      <br />
                      -1 ?????????
                    </div>
                  }
                />
                <ConfigItem
                  type={"number"}
                  name={"????????????"}
                  value={GachaUtils.medalLevelLimit}
                  setNumber={(value) => {
                    GachaUtils.medalRoomid = s.config.danmuReceiver.roomid;
                    GachaUtils.medalLevelLimit = value;
                    this.update();
                  }}
                  min={-1}
                  description={
                    <div>
                      ?????????????????? UL
                      <br />
                      ?????????????????????????????????????????????????????????????????????
                      <br />
                      -1 ?????????
                    </div>
                  }
                />
              </Modal>
              <Card className={"GachaInformation"}>
                <div className={"GachaInfos"}>
                  <div>??????: {GachaUtils.item}</div>
                  <div>??????????????????: {GachaUtils.joinText}</div>
                  <div>????????????: {GachaUtils.winNum}</div>
                  <div>????????????: {joinedUsers.length}</div>
                  <div>
                    ????????????:{" "}
                    {GachaUtils.userLevelLimit !== -1
                      ? `?????????????????? ${GachaUtils.userLevelLimit}; `
                      : ""}
                    {GachaUtils.medalLevelLimit !== -1 &&
                    GachaUtils.medalRoomid !== -1
                      ? `???????????????????????? ${GachaUtils.medalLevelLimit}(${GachaUtils.medalRoomid})`
                      : ""}
                  </div>
                </div>
                <div className={"GachaUsers"}>{users}</div>
              </Card>
              <Card className={"GachaControlPanel"}>
                <div className={"GachaControls"}>
                  <Button
                    onClick={() => {
                      if (!listening) {
                        s.addMessageListener(
                          this.listenerId,
                          this.onMessage.bind(this)
                        );
                      } else {
                        s.removeMessageListener(this.listenerId);
                      }
                      this.update();
                    }}
                  >
                    {listening ? "??????" : "??????"}
                    ??????
                  </Button>
                  <Button
                    onClick={() => {
                      GachaUtils.clearResult();
                      GachaUtils.wish();
                      this.update();
                    }}
                  >
                    ???!
                  </Button>
                  <Tooltip title={"??????"}>
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        GachaUtils.clear();
                        this.setState({
                          gachaLog: [],
                        });
                      }}
                    />
                  </Tooltip>
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => {
                      this.setState({ settingsVisible: true });
                    }}
                  />
                </div>
                <div className={"GachaLog"}>{logs}</div>
              </Card>
            </Card>
          );
        }}
      </ConfigContext.Consumer>
    );
  }
}
