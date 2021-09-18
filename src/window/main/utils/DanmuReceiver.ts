import Zlib from "zlib";
import WebSocket from "ws";

const DataOffset = {
  packetLength: 0,
  headerLength: 4,
  dataType: 6,
  opCode: 8,
  sequenceId: 12,
  body: 16,
};

const DataType = {
  json: 0,
  int32: 1,
  compressedZlib: 2,
  compressedBrotli: 3,
};

const OpCode = {
  heartbeat: 2,
  heartbeatResponse: 3,
  message: 5,
  join: 7,
  joinResponse: 8,
};

export class Data {
  private readonly packetLength: number;
  private readonly headerLength: number;
  private readonly dataType: number;
  private readonly opCode: number;
  private readonly body: DataView;
  private readonly bodyLength: number;

  constructor(body: DataView, opCode: number, dataType?: number) {
    this.headerLength = 4 + 2 + 2 + 4 + 4;
    this.packetLength = body.byteLength + this.headerLength;
    this.dataType = dataType ? dataType : DataType.json;
    this.opCode = opCode;
    this.body = body;
    this.bodyLength = body.byteLength;
  }

  getPacketLength(): number {
    return this.packetLength;
  }

  getHeaderLength(): number {
    return this.headerLength;
  }

  getDataType(): number {
    return this.dataType;
  }

  getOpCode(): number {
    return this.opCode;
  }

  getBody(): DataView {
    return this.body;
  }

  static join(roomId: number, protocolVersion: number, platform: string): Data {
    return new Data(
      this.encodeString(
        JSON.stringify({
          roomid: roomId,
          protover: protocolVersion,
          platform: platform,
        })
      ),
      OpCode.join
    );
  }

  static heartBeat(): Data {
    return new Data(new DataView(new ArrayBuffer(0)), OpCode.heartbeat);
  }

  static encodeString(str: string): DataView {
    const encoder = new TextEncoder();
    return new DataView(encoder.encode(str).buffer);
  }

  static decodeString(data: DataView): string {
    const decoder = new TextDecoder();
    return decoder.decode(data.buffer);
  }
}

export class DanmuReceiver {
  static connection: WebSocket;
  static heartBeatId: NodeJS.Timer;
  static heartBeatInterval: number;

  static connect(
    url: string,
    roomid: number,
    heartBeatInterval: number,
    protocolVersion?: number,
    platform?: string
  ): void {
    this.heartBeatInterval = heartBeatInterval;
    this.connection = new WebSocket(url);
    this.connection.binaryType = "arraybuffer";

    this.connection.on("open", () => {
      this.connection.send(
        this.pack(
          Data.join(
            roomid,
            protocolVersion ? protocolVersion : 3,
            platform ? platform : "web"
          )
        )
      );
      this.startHeartBeat();
      console.log("onOpen");
    });

    this.connection.on("close", () => {
      console.log("onClose");
    });

    this.connection.on("error", () => {
      console.log("onError");
    });

    this.connection.on("message", async (data: ArrayBuffer) => {
      this.unpackCompressed(this.unpack(new DataView(data)));
      console.log("onMessage");
      // wait finish
    });
  }

  static startHeartBeat(): void {
    this.heartBeatId = setInterval(() => {
      console.log("heartBeat");
      this.connection.send(this.pack(Data.heartBeat()));
    }, this.heartBeatInterval * 1000);
  }

  static stopHeartBeat(): void {
    clearInterval(this.heartBeatId);
    this.heartBeatId = null;
  }

  static close(): boolean {
    if (this.connection) {
      if (this.connection.readyState != WebSocket.CLOSED) {
        this.connection.terminate();
      }
    }
    this.heartBeatId ? this.stopHeartBeat() : "";
    return true;
  }

  static isConnecting(): boolean {
    return this.connection.readyState == this.connection.CONNECTING;
  }

  static isOpen(): boolean {
    return this.connection.readyState == this.connection.OPEN;
  }

  static isClosing(): boolean {
    return this.connection.readyState == this.connection.CLOSING;
  }

  static isClosed(): boolean {
    return this.connection.readyState == this.connection.CLOSED;
  }

  static pack(data: Data): DataView {
    const result = new DataView(new ArrayBuffer(data.getPacketLength()));

    result.setUint32(DataOffset.packetLength, data.getPacketLength());
    result.setUint16(DataOffset.headerLength, data.getHeaderLength());
    result.setUint16(DataOffset.dataType, data.getDataType());
    result.setUint32(DataOffset.opCode, data.getOpCode());
    result.setUint32(DataOffset.sequenceId, 1);

    const body = data.getBody();
    for (let i = 0; i < body.byteLength; i++) {
      result.setUint8(DataOffset.body + i, body.getUint8(i));
    }

    return result;
  }

  static unpack(dataView: DataView, offset?: number): Data {
    const dataOffset = offset ? offset : 0;
    const packetLength = dataView.getUint32(
      DataOffset.packetLength + dataOffset
    );
    const headerLength = dataView.getInt16(
      DataOffset.headerLength + dataOffset
    );
    const dataType = dataView.getInt16(DataOffset.dataType + dataOffset);
    const opCode = dataView.getUint32(DataOffset.opCode + dataOffset);

    const bodyLength = packetLength - headerLength;
    const body = new DataView(new ArrayBuffer(bodyLength));
    for (let i = 0; i < bodyLength; i++) {
      body.setUint8(i, dataView.getUint8(DataOffset.body + i + dataOffset));
    }

    return new Data(body, opCode, dataType);
  }

  static unpackContinuous(dataView: DataView): Data[] {
    const dataArray: Data[] = [];
    let data: Data = this.unpack(dataView);

    dataArray.push(data);

    let dataLength = data.getPacketLength();
    while (dataLength < dataView.byteLength) {
      data = this.unpack(dataView, dataLength);
      dataLength += data.getPacketLength();
      dataArray.push(data);
    }

    return dataArray;
  }

  static unpackCompressed(data: Data): Data[] {
    switch (data.getDataType()) {
      case DataType.compressedZlib: {
        const decompressedData = Zlib.inflateSync(data.getBody());
        return this.unpackContinuous(
          new DataView(decompressedData.buffer, 0, decompressedData.byteLength)
        );
      }
      case DataType.compressedBrotli: {
        const decompressedData = Zlib.brotliDecompressSync(data.getBody());
        return this.unpackContinuous(
          new DataView(decompressedData.buffer, 0, decompressedData.byteLength)
        );
      }
      default: {
        return [data];
      }
    }
  }
}
