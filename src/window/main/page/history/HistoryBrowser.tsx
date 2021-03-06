/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import "./HistoryBrowser.less";
import {
  Button,
  Divider,
  List,
  Modal,
  Popconfirm,
  Tooltip,
  Typography,
} from "antd";
import {
  CheckSquareOutlined,
  DeleteOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  MinusSquareOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { MessageLog } from "../../../../command/messagelog/MessageLog";
import { TAnyMessage } from "../../../../type/TAnyMessage";
import { MessageCommand } from "../../../../command/MessageCommand";
import { parseDanmuMsg } from "../../../../type/bilibili/TDanmuMsg";
import { TSuperChatMessage } from "../../../../type/bilibili/TSuperChatMessage";
import { TGuardBuy } from "../../../../type/bilibili/TGuardBuy";
import {
  InteractWordType,
  TInteractWord,
} from "../../../../type/bilibili/TInteractWord";
import { TRoomBlockMsg } from "../../../../type/bilibili/TRoomBlockMsg";
import { TRoomRealTimeMessageUpdate } from "../../../../type/bilibili/TRoomRealTimeMessageUpdate";
import { TSendGift } from "../../../../type/bilibili/TSendGift";
import { TWatchedChange } from "../../../../type/bilibili/TWatchedChange";
import { TMedalInfo } from "../../../../type/bilibili/userinfo/TMedalInfo";
import { HistoryState } from "./History";
import { ConfigContext } from "../../utils/ConfigContext";
import { ConfigItem } from "../../../../component/configitem/ConfigItem";

class Props {
  state: Readonly<HistoryState>;
  setState: <K extends keyof HistoryState>(
    state:
      | ((
          prevState: Readonly<HistoryState>
        ) => Pick<HistoryState, K> | HistoryState | null)
      | (Pick<HistoryState, K> | HistoryState | null)
  ) => void;
  resetSelectedFile: () => void;
}

class State {
  openFilterModifier: boolean;

  searchValue: string;

  systemMessage: boolean;
  activityUpdate: boolean;
  joinResponse: boolean;
  receiverStatusUpdate: boolean;

  danmuMessage: boolean;
  danmuMsg: boolean;
  live: boolean;
  preparing: boolean;
  superChatMessage: boolean;
  guardBuy: boolean;
  interactWord: boolean;
  roomBlockMsg: boolean;
  roomRealTimeMessageUpdate: boolean;
  sendGift: boolean;
  watchedChange: boolean;
}

export class HistoryBrowser extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      openFilterModifier: false,

      searchValue: "",

      systemMessage: true,
      activityUpdate: true,
      joinResponse: true,
      receiverStatusUpdate: true,

      danmuMessage: true,
      danmuMsg: true,
      live: true,
      preparing: true,
      superChatMessage: true,
      guardBuy: true,
      interactWord: true,
      roomBlockMsg: true,
      roomRealTimeMessageUpdate: true,
      sendGift: true,
      watchedChange: true,
    };
  }

  render() {
    return (
      <ConfigContext.Consumer>
        {({ get }) => {
          const p = this.props;
          const s = this.props.state;
          const f = this.state;

          return (
            <div
              className={
                "HistoryBrowser" +
                (get("darkTheme")
                  ? " HistoryBrowserDark"
                  : " HistoryBrowserLight")
              }
            >
              {/*region filterModifier*/}
              <Modal
                visible={f.openFilterModifier}
                closable={false}
                footer={[
                  <Button
                    key={"close"}
                    onClick={() => {
                      this.setState({ openFilterModifier: false });
                    }}
                  >
                    ??????
                  </Button>,
                ]}
              >
                <div className={"HistoryBrowserSpace"}>
                  <Tooltip title={"??????"}>
                    <Button
                      icon={<CheckSquareOutlined />}
                      onClick={() => {
                        this.setState({
                          systemMessage: true,
                          activityUpdate: true,
                          joinResponse: true,
                          receiverStatusUpdate: true,

                          danmuMessage: true,
                          danmuMsg: true,
                          live: true,
                          preparing: true,
                          superChatMessage: true,
                          guardBuy: true,
                          interactWord: true,
                          roomBlockMsg: true,
                          roomRealTimeMessageUpdate: true,
                          sendGift: true,
                          watchedChange: true,
                        });
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={"??????"}>
                    <Button
                      icon={<MinusSquareOutlined />}
                      onClick={() => {
                        this.setState((prevState) => ({
                          systemMessage: !prevState.systemMessage,
                          activityUpdate: !prevState.activityUpdate,
                          joinResponse: !prevState.joinResponse,
                          receiverStatusUpdate: !prevState.receiverStatusUpdate,

                          danmuMessage: !prevState.danmuMessage,
                          danmuMsg: !prevState.danmuMsg,
                          live: !prevState.live,
                          preparing: !prevState.preparing,
                          superChatMessage: !prevState.superChatMessage,
                          guardBuy: !prevState.guardBuy,
                          interactWord: !prevState.interactWord,
                          roomBlockMsg: !prevState.roomBlockMsg,
                          roomRealTimeMessageUpdate:
                            !prevState.roomRealTimeMessageUpdate,
                          sendGift: !prevState.sendGift,
                          watchedChange: !prevState.watchedChange,
                        }));
                      }}
                    />
                  </Tooltip>
                  <ConfigItem
                    type={"boolean"}
                    name={"????????????"}
                    value={f.systemMessage}
                    setBoolean={(value) => {
                      this.setState({
                        systemMessage: value,
                      });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"????????????"}
                    value={f.danmuMessage}
                    setBoolean={(value) => {
                      this.setState({
                        danmuMessage: value,
                      });
                    }}
                  />
                </div>
                <Divider>????????????</Divider>
                <div className={"HistoryBrowserSpace"}>
                  <ConfigItem
                    type={"boolean"}
                    name={"????????????"}
                    value={f.activityUpdate}
                    setBoolean={(value) => {
                      this.setState({ activityUpdate: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"????????????"}
                    value={f.joinResponse}
                    setBoolean={(value) => {
                      this.setState({ joinResponse: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"??????????????????"}
                    value={f.receiverStatusUpdate}
                    setBoolean={(value) => {
                      this.setState({ receiverStatusUpdate: value });
                    }}
                  />
                </div>
                <Divider>????????????</Divider>
                <div className={"HistoryBrowserSpace"}>
                  <ConfigItem
                    type={"boolean"}
                    name={"??????"}
                    value={f.danmuMsg}
                    setBoolean={(value) => {
                      this.setState({ danmuMsg: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"????????????"}
                    value={f.live}
                    setBoolean={(value) => {
                      this.setState({ live: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"????????????"}
                    value={f.preparing}
                    setBoolean={(value) => {
                      this.setState({ preparing: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"????????????"}
                    value={f.superChatMessage}
                    setBoolean={(value) => {
                      this.setState({ superChatMessage: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"??????"}
                    value={f.guardBuy}
                    setBoolean={(value) => {
                      this.setState({ guardBuy: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"????????????"}
                    value={f.interactWord}
                    setBoolean={(value) => {
                      this.setState({ interactWord: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"??????"}
                    value={f.roomBlockMsg}
                    setBoolean={(value) => {
                      this.setState({ roomBlockMsg: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"??????????????????"}
                    value={f.roomRealTimeMessageUpdate}
                    setBoolean={(value) => {
                      this.setState({ roomRealTimeMessageUpdate: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"??????"}
                    value={f.sendGift}
                    setBoolean={(value) => {
                      this.setState({ sendGift: value });
                    }}
                  />
                  <ConfigItem
                    type={"boolean"}
                    name={"??????????????????"}
                    value={f.watchedChange}
                    setBoolean={(value) => {
                      this.setState({ watchedChange: value });
                    }}
                  />
                </div>
              </Modal>
              {/*endregion*/}
              {/*region fileList*/}
              <List
                bordered
                size={"small"}
                dataSource={s.files}
                className={"HistoryBrowserNoScrollBar"}
                style={{
                  overflow: "auto",
                  minWidth: "26ch",
                }}
                header={
                  <div className={"HistoryBrowserFlexSpace"}>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={p.resetSelectedFile}
                    />
                    <Tooltip
                      title={"???????????? ??????2??? ????????????????????????????????????"}
                    >
                      <Button
                        icon={<SyncOutlined spin={s.autoReload} />}
                        onClick={() => {
                          p.setState((prevState) => ({
                            autoReload: !prevState.autoReload,
                          }));
                        }}
                      />
                    </Tooltip>
                    <Popconfirm
                      disabled={s.selectFile === ""}
                      title={`??????????????? ${this.getNameOnly(
                        s.selectFile
                      )} ???, ????????????`}
                      onConfirm={() => {
                        window.electron.deleteCommandHistoryFile(s.selectFile);
                        p.resetSelectedFile();
                      }}
                    >
                      <Button
                        disabled={s.selectFile === ""}
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>
                    <Tooltip
                      title={`??? ${
                        window.electron.getPlatform() === "darwin"
                          ? "Finder"
                          : "???????????????"
                      } ?????????`}
                    >
                      <Button
                        icon={<FolderOpenOutlined />}
                        disabled={s.selectFile === ""}
                        onClick={() => {
                          window.electron.showCommandHistoryFolder(
                            s.selectFile
                          );
                        }}
                      />
                    </Tooltip>
                  </div>
                }
                renderItem={(item) => (
                  <List.Item
                    onClick={() => {
                      p.setState({
                        selectFile: item,
                      });
                      window.electron.getCommandHistory(item).then((value) => {
                        p.setState({
                          commandHistory: value,
                        });
                      });
                    }}
                    style={{ userSelect: "none" }}
                  >
                    <Typography.Text strong={s.selectFile === item}>
                      {this.getNameOnly(item)}
                    </Typography.Text>
                  </List.Item>
                )}
              />
              {/*endregion*/}
              {/*region fileDetail*/}
              <List
                bordered
                size={"small"}
                dataSource={s.commandHistory}
                style={{ overflow: "auto", width: "100%" }}
                header={
                  <div
                    className={"HistoryBrowserSpace HistoryBrowserFlexSpace"}
                    style={{ justifyContent: "space-evenly" }}
                  >
                    <Button
                      icon={<FilterOutlined />}
                      onClick={() => {
                        this.setState({ openFilterModifier: true });
                      }}
                    />
                    <ConfigItem
                      type={"string"}
                      name={"??????"}
                      value={f.searchValue}
                      setString={(value) =>
                        this.setState({ searchValue: value })
                      }
                      description={
                        <div>
                          ??????????????????????????? ??????????????????
                          <br />
                          ?????????????????? ?????????/????????????
                        </div>
                      }
                    />
                  </div>
                }
                renderItem={(item: MessageLog<TAnyMessage>) => {
                  if (
                    f.searchValue != "" &&
                    JSON.stringify(item).indexOf(f.searchValue) === -1
                  )
                    return null;

                  if (item.message.cmd == "messageCommand") {
                    if (!f.danmuMessage) return null;

                    const msg = (item.message as MessageCommand).data;

                    switch (msg.cmd) {
                      case "DANMU_MSG": {
                        if (!f.danmuMsg) return null;
                        const data = parseDanmuMsg(msg).data;

                        return (
                          <List.Item>
                            {this.getMedalInfo(data.medalInfo)} {data.uName}:{" "}
                            {data.content}
                          </List.Item>
                        );
                      }
                      case "LIVE": {
                        if (!f.live) return null;
                        return <List.Item>??????????????????: ?????????</List.Item>;
                      }
                      case "PREPARING": {
                        if (!f.preparing) return null;
                        return <List.Item>??????????????????: ?????????</List.Item>;
                      }
                      case "SUPER_CHAT_MESSAGE": {
                        if (!f.superChatMessage) return null;
                        const data = (msg as TSuperChatMessage).data;

                        return (
                          <List.Item>
                            {`{????????????} `}
                            {data.price}?? {this.getMedalInfo(data.medal_info)}{" "}
                            {data.user_info.uname}: {data.message}
                          </List.Item>
                        );
                      }
                      case "GUARD_BUY": {
                        if (!f.guardBuy) return null;
                        const data = (msg as TGuardBuy).data;

                        return (
                          <List.Item>
                            {data.username} ?????? {data.gift_name}x
                            {`${data.num} `}
                            {(data.price / 1000).toFixed(2)}??
                          </List.Item>
                        );
                      }
                      case "INTERACT_WORD": {
                        if (!f.interactWord) return null;
                        const data = (msg as TInteractWord).data;
                        let action = "";

                        switch (data.msg_type) {
                          case InteractWordType.join: {
                            action = "??????????????????";
                            break;
                          }
                          case InteractWordType.follow: {
                            action = "??????????????????";
                            break;
                          }
                          case InteractWordType.share: {
                            action = "??????????????????";
                            break;
                          }
                        }
                        return (
                          <List.Item>
                            {data.uname} {action}
                          </List.Item>
                        );
                      }
                      case "ROOM_BLOCK_MSG": {
                        if (!f.roomBlockMsg) return null;
                        const data = (msg as TRoomBlockMsg).data;
                        return <List.Item>{data.uname} ??????????????????</List.Item>;
                      }
                      case "ROOM_REAL_TIME_MESSAGE_UPDATE": {
                        if (!f.roomRealTimeMessageUpdate) return null;
                        const data = (msg as TRoomRealTimeMessageUpdate).data;

                        return (
                          <List.Item>
                            ??????????????????: ?????????: {data.fans}, ?????????:{" "}
                            {data.fans_club}
                          </List.Item>
                        );
                      }
                      case "SEND_GIFT": {
                        if (!f.sendGift) return null;
                        const data = (msg as TSendGift).data;

                        return (
                          <List.Item>
                            {this.getMedalInfo(data.medal_info)} {data.uname}{" "}
                            {data.action} {data.giftName}x{data.num}{" "}
                            {data.coin_type === "gold"
                              ? `${(
                                  (data.discount_price * data.num) /
                                  1000
                                ).toFixed(2)}??/${(
                                  (data.price * data.num) /
                                  1000
                                ).toFixed(2)}??`
                              : ""}
                          </List.Item>
                        );
                      }
                      case "WATCHED_CHANGE": {
                        if (!f.watchedChange) return null;
                        const data = (msg as TWatchedChange).data;
                        return <List.Item>??????????????????: {data.num}</List.Item>;
                      }
                      default: {
                        return null;
                      }
                    }
                  } else {
                    if (!f.systemMessage) return null;

                    const msg = item.message;

                    switch (msg.cmd) {
                      case "activityUpdate": {
                        if (!f.activityUpdate) return null;
                        return <List.Item>????????????: {msg.activity}</List.Item>;
                      }
                      case "joinResponse": {
                        if (!f.joinResponse) return null;
                        return <List.Item>????????????: {msg.code}</List.Item>;
                      }
                      case "receiverStatusUpdate": {
                        if (!f.receiverStatusUpdate) return null;
                        let statusMsg = "NULL";

                        switch (msg.status) {
                          case "connecting": {
                            statusMsg = "?????????";
                            break;
                          }
                          case "open": {
                            statusMsg = "?????????";
                            break;
                          }
                          case "close": {
                            statusMsg = "?????????";
                            break;
                          }
                          case "error": {
                            statusMsg = "???????????????";
                            break;
                          }
                        }
                        return (
                          <List.Item>???????????????????????????: {statusMsg}</List.Item>
                        );
                      }
                      default: {
                        return null;
                      }
                    }
                  }
                }}
              />
              {/*endregion*/}
            </div>
          );
        }}
      </ConfigContext.Consumer>
    );
  }

  getNameOnly(fileName: string) {
    return fileName.replace(".cdtch", "");
  }

  getMedalInfo(medalInfo: TMedalInfo): ReactNode {
    return medalInfo && medalInfo.is_lighted ? (
      <span>
        [{medalInfo.medal_name} {medalInfo.medal_level}]
      </span>
    ) : null;
  }
}
