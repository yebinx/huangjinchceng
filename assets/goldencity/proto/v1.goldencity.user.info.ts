/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { TGoldenCityGameInfo, TPlayerInfo, TResult } from "./base";

export const protobufPackage = "";

export interface TProtoGoldenCityUserInfoReq {
  token: string;
}

export interface TProtoGoldenCityUserInfoRsp {
  player_info: TPlayerInfo | undefined;
  GoldenCity_info: TGoldenCityGameInfo | undefined;
  lastresult: TResult | undefined;
}

function createBaseTProtoGoldenCityUserInfoReq(): TProtoGoldenCityUserInfoReq {
  return { token: "" };
}

export const TProtoGoldenCityUserInfoReq = {
  encode(message: TProtoGoldenCityUserInfoReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TProtoGoldenCityUserInfoReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTProtoGoldenCityUserInfoReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.token = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TProtoGoldenCityUserInfoReq {
    return { token: isSet(object.token) ? String(object.token) : "" };
  },

  toJSON(message: TProtoGoldenCityUserInfoReq): unknown {
    const obj: any = {};
    message.token !== undefined && (obj.token = message.token);
    return obj;
  },

  create<I extends Exact<DeepPartial<TProtoGoldenCityUserInfoReq>, I>>(base?: I): TProtoGoldenCityUserInfoReq {
    return TProtoGoldenCityUserInfoReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TProtoGoldenCityUserInfoReq>, I>>(object: I): TProtoGoldenCityUserInfoReq {
    const message = createBaseTProtoGoldenCityUserInfoReq();
    message.token = object.token ?? "";
    return message;
  },
};

function createBaseTProtoGoldenCityUserInfoRsp(): TProtoGoldenCityUserInfoRsp {
  return { player_info: undefined, GoldenCity_info: undefined, lastresult: undefined };
}

export const TProtoGoldenCityUserInfoRsp = {
  encode(message: TProtoGoldenCityUserInfoRsp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.player_info !== undefined) {
      TPlayerInfo.encode(message.player_info, writer.uint32(10).fork()).ldelim();
    }
    if (message.GoldenCity_info !== undefined) {
      TGoldenCityGameInfo.encode(message.GoldenCity_info, writer.uint32(18).fork()).ldelim();
    }
    if (message.lastresult !== undefined) {
      TResult.encode(message.lastresult, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TProtoGoldenCityUserInfoRsp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTProtoGoldenCityUserInfoRsp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.player_info = TPlayerInfo.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.GoldenCity_info = TGoldenCityGameInfo.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.lastresult = TResult.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TProtoGoldenCityUserInfoRsp {
    return {
      player_info: isSet(object.playerInfo) ? TPlayerInfo.fromJSON(object.playerInfo) : undefined,
      GoldenCity_info: isSet(object.GoldenCityInfo) ? TGoldenCityGameInfo.fromJSON(object.GoldenCityInfo) : undefined,
      lastresult: isSet(object.lastresult) ? TResult.fromJSON(object.lastresult) : undefined,
    };
  },

  toJSON(message: TProtoGoldenCityUserInfoRsp): unknown {
    const obj: any = {};
    message.player_info !== undefined &&
      (obj.playerInfo = message.player_info ? TPlayerInfo.toJSON(message.player_info) : undefined);
    message.GoldenCity_info !== undefined &&
      (obj.GoldenCityInfo = message.GoldenCity_info ? TGoldenCityGameInfo.toJSON(message.GoldenCity_info) : undefined);
    message.lastresult !== undefined &&
      (obj.lastresult = message.lastresult ? TResult.toJSON(message.lastresult) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<TProtoGoldenCityUserInfoRsp>, I>>(base?: I): TProtoGoldenCityUserInfoRsp {
    return TProtoGoldenCityUserInfoRsp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TProtoGoldenCityUserInfoRsp>, I>>(object: I): TProtoGoldenCityUserInfoRsp {
    const message = createBaseTProtoGoldenCityUserInfoRsp();
    message.player_info = (object.player_info !== undefined && object.player_info !== null)
      ? TPlayerInfo.fromPartial(object.player_info)
      : undefined;
    message.GoldenCity_info = (object.GoldenCity_info !== undefined && object.GoldenCity_info !== null)
      ? TGoldenCityGameInfo.fromPartial(object.GoldenCity_info)
      : undefined;
    message.lastresult = (object.lastresult !== undefined && object.lastresult !== null)
      ? TResult.fromPartial(object.lastresult)
      : undefined;
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
