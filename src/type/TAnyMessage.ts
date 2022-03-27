import { ErrorMessage } from "../command/messagelog/ErrorMessage";
import { ActivityUpdate } from "../command/ActivityUpdate";
import { ConfigUpdate } from "../command/ConfigUpdate";
import { GiftConfigUpdate } from "../command/GiftConfigUpdate";
import { JoinResponse } from "../command/JoinResponse";
import { MessageCommand } from "../command/MessageCommand";
import { ReceiverStatusUpdate } from "../command/ReceiverStatusUpdate";

export type TAnyMessage =
  | ErrorMessage
  | ActivityUpdate
  | ConfigUpdate
  | GiftConfigUpdate
  | JoinResponse
  | MessageCommand
  | ReceiverStatusUpdate;
