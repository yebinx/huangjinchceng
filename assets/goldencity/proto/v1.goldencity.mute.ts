/* eslint-disable */
import _m0 from "protobufjs/minimal.js";

export const protobufPackage = "";

export enum AudioSwitchType {
  /** ON - 开 */
  ON = 0,
  /** OFF - 关 */
  OFF = 1,
  UNRECOGNIZED = -1,
}

export function audioSwitchTypeFromJSON(object: any): AudioSwitchType {
  switch (object) {
    case 0:
    case "ON":
      return AudioSwitchType.ON;
    case 1:
    case "OFF":
      return AudioSwitchType.OFF;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AudioSwitchType.UNRECOGNIZED;
  }
}

export function audioSwitchTypeToJSON(object: AudioSwitchType): string {
  switch (object) {
    case AudioSwitchType.ON:
      return "ON";
    case AudioSwitchType.OFF:
      return "OFF";
    case AudioSwitchType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface TProtoGoldenCityMuteReq {
  /**  */
  token: string;
  mute: AudioSwitchType;
}

function createBaseTProtoGoldenCityMuteReq(): TProtoGoldenCityMuteReq {
  return { token: "", mute: 0 };
}

export const TProtoGoldenCityMuteReq = {
  encode(message: TProtoGoldenCityMuteReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    if (message.mute !== 0) {
      writer.uint32(16).int32(message.mute);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TProtoGoldenCityMuteReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTProtoGoldenCityMuteReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.token = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.mute = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TProtoGoldenCityMuteReq {
    return {
      token: isSet(object.token) ? String(object.token) : "",
      mute: isSet(object.mute) ? audioSwitchTypeFromJSON(object.mute) : 0,
    };
  },

  toJSON(message: TProtoGoldenCityMuteReq): unknown {
    const obj: any = {};
    message.token !== undefined && (obj.token = message.token);
    message.mute !== undefined && (obj.mute = audioSwitchTypeToJSON(message.mute));
    return obj;
  },

  create<I extends Exact<DeepPartial<TProtoGoldenCityMuteReq>, I>>(base?: I): TProtoGoldenCityMuteReq {
    return TProtoGoldenCityMuteReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TProtoGoldenCityMuteReq>, I>>(object: I): TProtoGoldenCityMuteReq {
    const message = createBaseTProtoGoldenCityMuteReq();
    message.token = object.token ?? "";
    message.mute = object.mute ?? 0;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
