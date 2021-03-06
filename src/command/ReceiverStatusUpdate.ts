/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type ReceiverStatus = "open" | "close" | "error" | "connecting";

export type ReceiverStatusUpdateCmd = "receiverStatusUpdate";

export type ReceiverStatusUpdate = {
  cmd: ReceiverStatusUpdateCmd;
  status: ReceiverStatus;
};

export function getStatusUpdateMessage(
  status: ReceiverStatus
): ReceiverStatusUpdate {
  return {
    cmd: "receiverStatusUpdate",
    status: status,
  };
}

export function getStatusUpdateMessageCmd(): ReceiverStatusUpdateCmd {
  return "receiverStatusUpdate";
}
