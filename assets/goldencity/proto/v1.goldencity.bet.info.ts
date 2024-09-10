/* eslint-disable */
import _m0 from "protobufjs/minimal.js";

export const protobufPackage = "";

export interface TGoldenCityBetInfoReq {
  token: string;
}

export interface BetInfo {
  /** 下注ID */
  betid: number;
  /** 投注大小 */
  betsize: number;
  /** 投注倍数 */
  betmultiple: number;
  /** 基础投注 */
  betbase: number;
}

export interface TGoldenCityBetInfoRsp {
  /** 下注组合 */
  betinfo: BetInfo[];
  /** 加减组合 */
  betadjust: number[];
  /** 购买免费倍数 */
  buyfreebetid: number[];
  /** 默认下注ID */
  defaultbetid: number;
}

function createBaseTGoldenCityBetInfoReq(): TGoldenCityBetInfoReq {
  return { token: "" };
}

export const TGoldenCityBetInfoReq = {
  encode(message: TGoldenCityBetInfoReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TGoldenCityBetInfoReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTGoldenCityBetInfoReq();
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

  fromJSON(object: any): TGoldenCityBetInfoReq {
    return { token: isSet(object.token) ? String(object.token) : "" };
  },

  toJSON(message: TGoldenCityBetInfoReq): unknown {
    const obj: any = {};
    message.token !== undefined && (obj.token = message.token);
    return obj;
  },

  create<I extends Exact<DeepPartial<TGoldenCityBetInfoReq>, I>>(base?: I): TGoldenCityBetInfoReq {
    return TGoldenCityBetInfoReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TGoldenCityBetInfoReq>, I>>(object: I): TGoldenCityBetInfoReq {
    const message = createBaseTGoldenCityBetInfoReq();
    message.token = object.token ?? "";
    return message;
  },
};

function createBaseBetInfo(): BetInfo {
  return { betid: 0, betsize: 0, betmultiple: 0, betbase: 0 };
}

export const BetInfo = {
  encode(message: BetInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.betid !== 0) {
      writer.uint32(8).int32(message.betid);
    }
    if (message.betsize !== 0) {
      writer.uint32(16).int32(message.betsize);
    }
    if (message.betmultiple !== 0) {
      writer.uint32(24).int32(message.betmultiple);
    }
    if (message.betbase !== 0) {
      writer.uint32(32).int32(message.betbase);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BetInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBetInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.betid = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.betsize = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.betmultiple = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.betbase = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BetInfo {
    return {
      betid: isSet(object.betid) ? Number(object.betid) : 0,
      betsize: isSet(object.betsize) ? Number(object.betsize) : 0,
      betmultiple: isSet(object.betmultiple) ? Number(object.betmultiple) : 0,
      betbase: isSet(object.betbase) ? Number(object.betbase) : 0,
    };
  },

  toJSON(message: BetInfo): unknown {
    const obj: any = {};
    message.betid !== undefined && (obj.betid = Math.round(message.betid));
    message.betsize !== undefined && (obj.betsize = Math.round(message.betsize));
    message.betmultiple !== undefined && (obj.betmultiple = Math.round(message.betmultiple));
    message.betbase !== undefined && (obj.betbase = Math.round(message.betbase));
    return obj;
  },

  create<I extends Exact<DeepPartial<BetInfo>, I>>(base?: I): BetInfo {
    return BetInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BetInfo>, I>>(object: I): BetInfo {
    const message = createBaseBetInfo();
    message.betid = object.betid ?? 0;
    message.betsize = object.betsize ?? 0;
    message.betmultiple = object.betmultiple ?? 0;
    message.betbase = object.betbase ?? 0;
    return message;
  },
};

function createBaseTGoldenCityBetInfoRsp(): TGoldenCityBetInfoRsp {
  return { betinfo: [], betadjust: [], buyfreebetid: [], defaultbetid: 0 };
}

export const TGoldenCityBetInfoRsp = {
  encode(message: TGoldenCityBetInfoRsp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.betinfo) {
      BetInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    writer.uint32(18).fork();
    for (const v of message.betadjust) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(26).fork();
    for (const v of message.buyfreebetid) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.defaultbetid !== 0) {
      writer.uint32(32).int32(message.defaultbetid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TGoldenCityBetInfoRsp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTGoldenCityBetInfoRsp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.betinfo.push(BetInfo.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag === 16) {
            message.betadjust.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.betadjust.push(reader.int32());
            }

            continue;
          }

          break;
        case 3:
          if (tag === 24) {
            message.buyfreebetid.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.buyfreebetid.push(reader.int32());
            }

            continue;
          }

          break;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.defaultbetid = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TGoldenCityBetInfoRsp {
    return {
      betinfo: Array.isArray(object?.betinfo) ? object.betinfo.map((e: any) => BetInfo.fromJSON(e)) : [],
      betadjust: Array.isArray(object?.betadjust) ? object.betadjust.map((e: any) => Number(e)) : [],
      buyfreebetid: Array.isArray(object?.buyfreebetid) ? object.buyfreebetid.map((e: any) => Number(e)) : [],
      defaultbetid: isSet(object.defaultbetid) ? Number(object.defaultbetid) : 0,
    };
  },

  toJSON(message: TGoldenCityBetInfoRsp): unknown {
    const obj: any = {};
    if (message.betinfo) {
      obj.betinfo = message.betinfo.map((e) => e ? BetInfo.toJSON(e) : undefined);
    } else {
      obj.betinfo = [];
    }
    if (message.betadjust) {
      obj.betadjust = message.betadjust.map((e) => Math.round(e));
    } else {
      obj.betadjust = [];
    }
    if (message.buyfreebetid) {
      obj.buyfreebetid = message.buyfreebetid.map((e) => Math.round(e));
    } else {
      obj.buyfreebetid = [];
    }
    message.defaultbetid !== undefined && (obj.defaultbetid = Math.round(message.defaultbetid));
    return obj;
  },

  create<I extends Exact<DeepPartial<TGoldenCityBetInfoRsp>, I>>(base?: I): TGoldenCityBetInfoRsp {
    return TGoldenCityBetInfoRsp.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TGoldenCityBetInfoRsp>, I>>(object: I): TGoldenCityBetInfoRsp {
    const message = createBaseTGoldenCityBetInfoRsp();
    message.betinfo = object.betinfo?.map((e) => BetInfo.fromPartial(e)) || [];
    message.betadjust = object.betadjust?.map((e) => e) || [];
    message.buyfreebetid = object.buyfreebetid?.map((e) => e) || [];
    message.defaultbetid = object.defaultbetid ?? 0;
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
