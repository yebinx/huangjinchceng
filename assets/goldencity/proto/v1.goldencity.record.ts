/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import {
  TProtoGoldenCityBetType,
  tProtoGoldenCityBetTypeFromJSON,
  tProtoGoldenCityBetTypeToJSON,
} from "./v1.goldencity.bet";

export const protobufPackage = "";

export interface TGoldenCityRecordReq {
  token: string;
  /** 开始时间，时间戳数值到豪秒 */
  starttime: number;
  /** 结束时间，时间戳数值到豪秒 */
  endtime: number;
  /** 查询数量, 客户端发送（30）条 */
  limit: number;
  /** 偏移量, 首次发0, 第2次发30，第三次发60 */
  offset: number;
}

/** 游戏记录列表 */
export interface TGoldenCityRecordInfo {
  bet: number;
  /** 触发的总免费次数 */
  freetimes: number;
  /** 一次旋转到不能再消除后，赢得总金额-投注，含所有免费赢得 */
  wintotal: number;
  /** 订单ID */
  orderid: string;
  /** 记录创建时间 */
  createtime: number;
  /** 普通旋转的消除次数 */
  normalremovecount: number;
  /** 免费旋转的总消除次数 */
  freeremovecount: number;
  /** 投注类型 */
  buytype: TProtoGoldenCityBetType;
}

/** 游戏记录列表返回 */
export interface TGoldenCityRecordRsp {
  /** 记录列表数组 */
  record: TGoldenCityRecordInfo[];
  /** 查询时间内总投注 */
  totalbet: number;
  /** 查询时间内总盈利需要减去总投注 */
  totalprofit: number;
  /** 查询时间内总记录条数 */
  totalcount: number;
}

function createBaseTGoldenCityRecordReq(): TGoldenCityRecordReq {
  return { token: "", starttime: 0, endtime: 0, limit: 0, offset: 0 };
}

export const TGoldenCityRecordReq = {
  encode(message: TGoldenCityRecordReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    if (message.starttime !== 0) {
      writer.uint32(16).int64(message.starttime);
    }
    if (message.endtime !== 0) {
      writer.uint32(24).int64(message.endtime);
    }
    if (message.limit !== 0) {
      writer.uint32(32).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(40).int32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TGoldenCityRecordReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTGoldenCityRecordReq();
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

          message.starttime = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.endtime = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.offset = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TGoldenCityRecordReq {
    return {
      token: isSet(object.token) ? String(object.token) : "",
      starttime: isSet(object.starttime) ? Number(object.starttime) : 0,
      endtime: isSet(object.endtime) ? Number(object.endtime) : 0,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: TGoldenCityRecordReq): unknown {
    const obj: any = {};
    message.token !== undefined && (obj.token = message.token);
    message.starttime !== undefined && (obj.starttime = Math.round(message.starttime));
    message.endtime !== undefined && (obj.endtime = Math.round(message.endtime));
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  create<I extends Exact<DeepPartial<TGoldenCityRecordReq>, I>>(base?: I): TGoldenCityRecordReq {
    return TGoldenCityRecordReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TGoldenCityRecordReq>, I>>(object: I): TGoldenCityRecordReq {
    const message = createBaseTGoldenCityRecordReq();
    message.token = object.token ?? "";
    message.starttime = object.starttime ?? 0;
    message.endtime = object.endtime ?? 0;
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseTGoldenCityRecordInfo(): TGoldenCityRecordInfo {
  return {
    bet: 0,
    freetimes: 0,
    wintotal: 0,
    orderid: "",
    createtime: 0,
    normalremovecount: 0,
    freeremovecount: 0,
    buytype: 0,
  };
}

export const TGoldenCityRecordInfo = {
  encode(message: TGoldenCityRecordInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bet !== 0) {
      writer.uint32(8).int64(message.bet);
    }
    if (message.freetimes !== 0) {
      writer.uint32(16).int32(message.freetimes);
    }
    if (message.wintotal !== 0) {
      writer.uint32(24).int64(message.wintotal);
    }
    if (message.orderid !== "") {
      writer.uint32(34).string(message.orderid);
    }
    if (message.createtime !== 0) {
      writer.uint32(40).int64(message.createtime);
    }
    if (message.normalremovecount !== 0) {
      writer.uint32(48).int32(message.normalremovecount);
    }
    if (message.freeremovecount !== 0) {
      writer.uint32(56).int32(message.freeremovecount);
    }
    if (message.buytype !== 0) {
      writer.uint32(64).int32(message.buytype);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TGoldenCityRecordInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTGoldenCityRecordInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.bet = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.freetimes = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.wintotal = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.orderid = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.createtime = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.normalremovecount = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.freeremovecount = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.buytype = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TGoldenCityRecordInfo {
    return {
      bet: isSet(object.bet) ? Number(object.bet) : 0,
      freetimes: isSet(object.freetimes) ? Number(object.freetimes) : 0,
      wintotal: isSet(object.wintotal) ? Number(object.wintotal) : 0,
      orderid: isSet(object.orderid) ? String(object.orderid) : "",
      createtime: isSet(object.createtime) ? Number(object.createtime) : 0,
      normalremovecount: isSet(object.normalremovecount) ? Number(object.normalremovecount) : 0,
      freeremovecount: isSet(object.freeremovecount) ? Number(object.freeremovecount) : 0,
      buytype: isSet(object.buytype) ? tProtoGoldenCityBetTypeFromJSON(object.buytype) : 0,
    };
  },

  toJSON(message: TGoldenCityRecordInfo): unknown {
    const obj: any = {};
    message.bet !== undefined && (obj.bet = Math.round(message.bet));
    message.freetimes !== undefined && (obj.freetimes = Math.round(message.freetimes));
    message.wintotal !== undefined && (obj.wintotal = Math.round(message.wintotal));
    message.orderid !== undefined && (obj.orderid = message.orderid);
    message.createtime !== undefined && (obj.createtime = Math.round(message.createtime));
    message.normalremovecount !== undefined && (obj.normalremovecount = Math.round(message.normalremovecount));
    message.freeremovecount !== undefined && (obj.freeremovecount = Math.round(message.freeremovecount));
    message.buytype !== undefined && (obj.buytype = tProtoGoldenCityBetTypeToJSON(message.buytype));
    return obj;
  },

  create<I extends Exact<DeepPartial<TGoldenCityRecordInfo>, I>>(base?: I): TGoldenCityRecordInfo {
    return TGoldenCityRecordInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TGoldenCityRecordInfo>, I>>(object: I): TGoldenCityRecordInfo {
    const message = createBaseTGoldenCityRecordInfo();
    message.bet = object.bet ?? 0;
    message.freetimes = object.freetimes ?? 0;
    message.wintotal = object.wintotal ?? 0;
    message.orderid = object.orderid ?? "";
    message.createtime = object.createtime ?? 0;
    message.normalremovecount = object.normalremovecount ?? 0;
    message.freeremovecount = object.freeremovecount ?? 0;
    message.buytype = object.buytype ?? 0;
    return message;
  },
};

function createBaseTGoldenCityRecordRsp(): TGoldenCityRecordRsp {
  return { record: [], totalbet: 0, totalprofit: 0, totalcount: 0 };
}

export const TGoldenCityRecordRsp = {
  encode(message: TGoldenCityRecordRsp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.record) {
      TGoldenCityRecordInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.totalbet !== 0) {
      writer.uint32(16).int64(message.totalbet);
    }
    if (message.totalprofit !== 0) {
      writer.uint32(24).int64(message.totalprofit);
    }
    if (message.totalcount !== 0) {
      writer.uint32(32).int64(message.totalcount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TGoldenCityRecordRsp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTGoldenCityRecordRsp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.record.push(TGoldenCityRecordInfo.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.totalbet = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.totalprofit = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.totalcount = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TGoldenCityRecordRsp {
    return {
      record: Array.isArray(object?.record) ? object.record.map((e: any) => TGoldenCityRecordInfo.fromJSON(e)) : [],
      totalbet: isSet(object.totalbet) ? Number(object.totalbet) : 0,
      totalprofit: isSet(object.totalprofit) ? Number(object.totalprofit) : 0,
      totalcount: isSet(object.totalcount) ? Number(object.totalcount) : 0,
    };
  },

  toJSON(message: TGoldenCityRecordRsp): unknown {
    const obj: any = {};
    if (message.record) {
      obj.record = message.record.map((e) => e ? TGoldenCityRecordInfo.toJSON(e) : undefined);
    } else {
      obj.record = [];
    }
    message.totalbet !== undefined && (obj.totalbet = Math.round(message.totalbet));
    message.totalprofit !== undefined && (obj.totalprofit = Math.round(message.totalprofit));
    message.totalcount !== undefined && (obj.totalcount = Math.round(message.totalcount));
    return obj;
  },

  create<I extends Exact<DeepPartial<TGoldenCityRecordRsp>, I>>(base?: I): TGoldenCityRecordRsp {
    return TGoldenCityRecordRsp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TGoldenCityRecordRsp>, I>>(object: I): TGoldenCityRecordRsp {
    const message = createBaseTGoldenCityRecordRsp();
    message.record = object.record?.map((e) => TGoldenCityRecordInfo.fromPartial(e)) || [];
    message.totalbet = object.totalbet ?? 0;
    message.totalprofit = object.totalprofit ?? 0;
    message.totalcount = object.totalcount ?? 0;
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
