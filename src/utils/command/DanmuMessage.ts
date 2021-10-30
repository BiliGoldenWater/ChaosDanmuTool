export type DanmuMessage = {
  cmd:
    | string
    | "DANMU_MSG"
    | "SUPER_CHAT_MESSAGE"
    | "INTERACT_WORD"
    | "ROOM_REAL_TIME_MESSAGE_UPDATE"
    | "STOP_LIVE_ROOM_LIST";
  [key: string]: unknown;
};

export type DanmuMessageWithKey = {
  key: number;
  msg: DanmuMessage;
};
