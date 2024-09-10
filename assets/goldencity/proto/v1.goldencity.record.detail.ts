/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { TResult } from "./base";

export const protobufPackage = "";

/** 游戏详情请求 */
export interface TGoldenCityRecordDetailReq {
  token: string;
  /** 订单号 */
  orderid: string;
}

export interface Result {
  freearray: TResult[];
}

/** 游戏详情返回 */
export interface TGoldenCityRecordDetailRsp {
  /** 余额 */
  balance: number;
  /** normal旋转记录集 */
  normalresult: TResult[];
  /** 下注金额 */
  bet: number;
  /** 总的免费次数 */
  freetimes: number;
  /** free旋转记录集，如果有的话，没有就是空 */
  freeresult: Result[];
  /** 一次旋转到不能再消除后，赢得总金额，含所有免费赢得 */
  wintotal: number;
  /** 订单ID */
  orderid: string;
  /** 投注大小 */
  betsize: number;
  /** 投注倍数 */
  betmultiple: number;
}

function createBaseTGoldenCityRecordDetailReq(): TGoldenCityRecordDetailReq {
  return { token: "", orderid: "" };
}

export const TGoldenCityRecordDetailReq = {
  encode(message: TGoldenCityRecordDetailReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    if (message.orderid !== "") {
      writer.uint32(18).string(message.orderid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TGoldenCityRecordDetailReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTGoldenCityRecordDetailReq();
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
          if (tag !== 18) {
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

  fromJSON(object: any): TGoldenCityRecordDetailReq {
    return {
      token: isSet(object.token) ? String(object.token) : "",
      orderid: isSet(object.orderid) ? String(object.orderid) : "",
    };
  },

  toJSON(message: TGoldenCityRecordDetailReq): unknown {
    const obj: any = {};
    message.token !== undefined && (obj.token = message.token);
    message.orderid !== undefined && (obj.orderid = message.orderid);
    return obj;
  },

  create<I extends Exact<DeepPartial<TGoldenCityRecordDetailReq>, I>>(base?: I): TGoldenCityRecordDetailReq {
    return TGoldenCityRecordDetailReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TGoldenCityRecordDetailReq>, I>>(object: I): TGoldenCityRecordDetailReq {
    const message = createBaseTGoldenCityRecordDetailReq();
    message.token = object.token ?? "";
    message.orderid = object.orderid ?? "";
    return message;
  },
};

function createBaseResult(): Result {
  return { freearray: [] };
}

export const Result = {
  encode(message: Result, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.freearray) {
      TResult.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Result {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.freearray.push(TResult.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Result {
    return { freearray: Array.isArray(object?.freearray) ? object.freearray.map((e: any) => TResult.fromJSON(e)) : [] };
  },

  toJSON(message: Result): unknown {
    const obj: any = {};
    if (message.freearray) {
      obj.freearray = message.freearray.map((e) => e ? TResult.toJSON(e) : undefined);
    } else {
      obj.freearray = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Result>, I>>(base?: I): Result {
    return Result.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Result>, I>>(object: I): Result {
    const message = createBaseResult();
    message.freearray = object.freearray?.map((e) => TResult.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTGoldenCityRecordDetailRsp(): TGoldenCityRecordDetailRsp {
  return {
    balance: 0,
    normalresult: [],
    bet: 0,
    freetimes: 0,
    freeresult: [],
    wintotal: 0,
    orderid: "",
    betsize: 0,
    betmultiple: 0,
  };
}

export const TGoldenCityRecordDetailRsp = {
  encode(message: TGoldenCityRecordDetailRsp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.balance !== 0) {
      writer.uint32(8).int64(message.balance);
    }
    for (const v of message.normalresult) {
      TResult.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.bet !== 0) {
      writer.uint32(24).int64(message.bet);
    }
    if (message.freetimes !== 0) {
      writer.uint32(40).int32(message.freetimes);
    }
    for (const v of message.freeresult) {
      Result.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.wintotal !== 0) {
      writer.uint32(56).int64(message.wintotal);
    }
    if (message.orderid !== "") {
      writer.uint32(66).string(message.orderid);
    }
    if (message.betsize !== 0) {
      writer.uint32(72).int32(message.betsize);
    }
    if (message.betmultiple !== 0) {
      writer.uint32(80).int32(message.betmultiple);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TGoldenCityRecordDetailRsp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTGoldenCityRecordDetailRsp();
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

          message.normalresult.push(TResult.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.bet = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.freetimes = reader.int32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.freeresult.push(Result.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.wintotal = longToNumber(reader.int64() as Long);
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.orderid = reader.string();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.betsize = reader.int32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.betmultiple = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TGoldenCityRecordDetailRsp {
    return {
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      normalresult: Array.isArray(object?.normalresult) ? object.normalresult.map((e: any) => TResult.fromJSON(e)) : [],
      bet: isSet(object.bet) ? Number(object.bet) : 0,
      freetimes: isSet(object.freetimes) ? Number(object.freetimes) : 0,
      freeresult: Array.isArray(object?.freeresult) ? object.freeresult.map((e: any) => Result.fromJSON(e)) : [],
      wintotal: isSet(object.wintotal) ? Number(object.wintotal) : 0,
      orderid: isSet(object.orderid) ? String(object.orderid) : "",
      betsize: isSet(object.betsize) ? Number(object.betsize) : 0,
      betmultiple: isSet(object.betmultiple) ? Number(object.betmultiple) : 0,
    };
  },

  toJSON(message: TGoldenCityRecordDetailRsp): unknown {
    const obj: any = {};
    message.balance !== undefined && (obj.balance = Math.round(message.balance));
    if (message.normalresult) {
      obj.normalresult = message.normalresult.map((e) => e ? TResult.toJSON(e) : undefined);
    } else {
      obj.normalresult = [];
    }
    message.bet !== undefined && (obj.bet = Math.round(message.bet));
    message.freetimes !== undefined && (obj.freetimes = Math.round(message.freetimes));
    if (message.freeresult) {
      obj.freeresult = message.freeresult.map((e) => e ? Result.toJSON(e) : undefined);
    } else {
      obj.freeresult = [];
    }
    message.wintotal !== undefined && (obj.wintotal = Math.round(message.wintotal));
    message.orderid !== undefined && (obj.orderid = message.orderid);
    message.betsize !== undefined && (obj.betsize = Math.round(message.betsize));
    message.betmultiple !== undefined && (obj.betmultiple = Math.round(message.betmultiple));
    return obj;
  },

  create<I extends Exact<DeepPartial<TGoldenCityRecordDetailRsp>, I>>(base?: I): TGoldenCityRecordDetailRsp {
    return TGoldenCityRecordDetailRsp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TGoldenCityRecordDetailRsp>, I>>(object: I): TGoldenCityRecordDetailRsp {
    const message = createBaseTGoldenCityRecordDetailRsp();
    message.balance = object.balance ?? 0;
    message.normalresult = object.normalresult?.map((e) => TResult.fromPartial(e)) || [];
    message.bet = object.bet ?? 0;
    message.freetimes = object.freetimes ?? 0;
    message.freeresult = object.freeresult?.map((e) => Result.fromPartial(e)) || [];
    message.wintotal = object.wintotal ?? 0;
    message.orderid = object.orderid ?? "";
    message.betsize = object.betsize ?? 0;
    message.betmultiple = object.betmultiple ?? 0;
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
