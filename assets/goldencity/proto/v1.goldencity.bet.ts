/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { TResult } from "./base";

export const protobufPackage = "";

export enum TProtoGoldenCityBetType {
  NORMAL = 0,
  FREE = 1,
  BUYFREE = 2,
  UNRECOGNIZED = -1,
}

export function tProtoGoldenCityBetTypeFromJSON(object: any): TProtoGoldenCityBetType {
  switch (object) {
    case 0:
    case "NORMAL":
      return TProtoGoldenCityBetType.NORMAL;
    case 1:
    case "FREE":
      return TProtoGoldenCityBetType.FREE;
    case 2:
    case "BUYFREE":
      return TProtoGoldenCityBetType.BUYFREE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TProtoGoldenCityBetType.UNRECOGNIZED;
  }
}

export function tProtoGoldenCityBetTypeToJSON(object: TProtoGoldenCityBetType): string {
  switch (object) {
    case TProtoGoldenCityBetType.NORMAL:
      return "NORMAL";
    case TProtoGoldenCityBetType.FREE:
      return "FREE";
    case TProtoGoldenCityBetType.BUYFREE:
      return "BUYFREE";
    case TProtoGoldenCityBetType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface TProtoGoldenCityBetReq {
  /**  */
  token: string;
  /** 投注总额 = betsize * betmultiple * 20 */
  bet: TProtoGoldenCityBetType;
  /** 买入类型 1：normal   2：buyfree */
  buytype: number;
  /** 投注大小 */
  betsize: number;
  /** 投注倍数 */
  betmultiple: number;
  /** 下注ID */
  betid: number;
}

export interface TProtoGoldenCityBetRsp {
  /** 中奖后的钱 */
  balance: number;
  result: TResult[];
  /** 投注总额 */
  bet: number;
  /** 单次旋转后，触发的免费次数 */
  freetimes: number;
  /** 一次旋转到不能再消除后，赢得总金额 */
  wintotal: number;
  /** 订单ID */
  orderid: string;
}

function createBaseTProtoGoldenCityBetReq(): TProtoGoldenCityBetReq {
  return { token: "", bet: 0, buytype: 0, betsize: 0, betmultiple: 0, betid: 0 };
}

export const TProtoGoldenCityBetReq = {
  encode(message: TProtoGoldenCityBetReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    if (message.bet !== 0) {
      writer.uint32(16).int32(message.bet);
    }
    if (message.buytype !== 0) {
      writer.uint32(24).int32(message.buytype);
    }
    if (message.betsize !== 0) {
      writer.uint32(32).int64(message.betsize);
    }
    if (message.betmultiple !== 0) {
      writer.uint32(40).int32(message.betmultiple);
    }
    if (message.betid !== 0) {
      writer.uint32(48).int32(message.betid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TProtoGoldenCityBetReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTProtoGoldenCityBetReq();
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

          message.bet = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.buytype = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.betsize = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.betmultiple = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.betid = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TProtoGoldenCityBetReq {
    return {
      token: isSet(object.token) ? String(object.token) : "",
      bet: isSet(object.bet) ? tProtoGoldenCityBetTypeFromJSON(object.bet) : 0,
      buytype: isSet(object.buytype) ? Number(object.buytype) : 0,
      betsize: isSet(object.betsize) ? Number(object.betsize) : 0,
      betmultiple: isSet(object.betmultiple) ? Number(object.betmultiple) : 0,
      betid: isSet(object.betid) ? Number(object.betid) : 0,
    };
  },

  toJSON(message: TProtoGoldenCityBetReq): unknown {
    const obj: any = {};
    message.token !== undefined && (obj.token = message.token);
    message.bet !== undefined && (obj.bet = tProtoGoldenCityBetTypeToJSON(message.bet));
    message.buytype !== undefined && (obj.buytype = Math.round(message.buytype));
    message.betsize !== undefined && (obj.betsize = Math.round(message.betsize));
    message.betmultiple !== undefined && (obj.betmultiple = Math.round(message.betmultiple));
    message.betid !== undefined && (obj.betid = Math.round(message.betid));
    return obj;
  },

  create<I extends Exact<DeepPartial<TProtoGoldenCityBetReq>, I>>(base?: I): TProtoGoldenCityBetReq {
    return TProtoGoldenCityBetReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TProtoGoldenCityBetReq>, I>>(object: I): TProtoGoldenCityBetReq {
    const message = createBaseTProtoGoldenCityBetReq();
    message.token = object.token ?? "";
    message.bet = object.bet ?? 0;
    message.buytype = object.buytype ?? 0;
    message.betsize = object.betsize ?? 0;
    message.betmultiple = object.betmultiple ?? 0;
    message.betid = object.betid ?? 0;
    return message;
  },
};

function createBaseTProtoGoldenCityBetRsp(): TProtoGoldenCityBetRsp {
  return { balance: 0, result: [], bet: 0, freetimes: 0, wintotal: 0, orderid: "" };
}

export const TProtoGoldenCityBetRsp = {
  encode(message: TProtoGoldenCityBetRsp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.balance !== 0) {
      writer.uint32(8).int64(message.balance);
    }
    for (const v of message.result) {
      TResult.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.bet !== 0) {
      writer.uint32(24).int64(message.bet);
    }
    if (message.freetimes !== 0) {
      writer.uint32(32).int32(message.freetimes);
    }
    if (message.wintotal !== 0) {
      writer.uint32(40).int64(message.wintotal);
    }
    if (message.orderid !== "") {
      writer.uint32(50).string(message.orderid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TProtoGoldenCityBetRsp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTProtoGoldenCityBetRsp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.balance = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.result.push(TResult.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.bet = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.freetimes = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.wintotal = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.orderid = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TProtoGoldenCityBetRsp {
    return {
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      result: Array.isArray(object?.result) ? object.result.map((e: any) => TResult.fromJSON(e)) : [],
      bet: isSet(object.bet) ? Number(object.bet) : 0,
      freetimes: isSet(object.freetimes) ? Number(object.freetimes) : 0,
      wintotal: isSet(object.wintotal) ? Number(object.wintotal) : 0,
      orderid: isSet(object.orderid) ? String(object.orderid) : "",
    };
  },

  toJSON(message: TProtoGoldenCityBetRsp): unknown {
    const obj: any = {};
    message.balance !== undefined && (obj.balance = Math.round(message.balance));
    if (message.result) {
      obj.result = message.result.map((e) => e ? TResult.toJSON(e) : undefined);
    } else {
      obj.result = [];
    }
    message.bet !== undefined && (obj.bet = Math.round(message.bet));
    message.freetimes !== undefined && (obj.freetimes = Math.round(message.freetimes));
    message.wintotal !== undefined && (obj.wintotal = Math.round(message.wintotal));
    message.orderid !== undefined && (obj.orderid = message.orderid);
    return obj;
  },

  create<I extends Exact<DeepPartial<TProtoGoldenCityBetRsp>, I>>(base?: I): TProtoGoldenCityBetRsp {
    return TProtoGoldenCityBetRsp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TProtoGoldenCityBetRsp>, I>>(object: I): TProtoGoldenCityBetRsp {
    const message = createBaseTProtoGoldenCityBetRsp();
    message.balance = object.balance ?? 0;
    message.result = object.result?.map((e) => TResult.fromPartial(e)) || [];
    message.bet = object.bet ?? 0;
    message.freetimes = object.freetimes ?? 0;
    message.wintotal = object.wintotal ?? 0;
    message.orderid = object.orderid ?? "";
    return message;
  },
};

declare const self: any | undefined;
declare const window: any | undefined;
declare const global: any | undefined;
const tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
