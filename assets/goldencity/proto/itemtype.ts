/* eslint-disable */
import _m0 from "protobufjs/minimal.js";

export const protobufPackage = "";

export enum TItemtype {
  /** ITEM_TYPE_NIL - 空 */
  ITEM_TYPE_NIL = 0,
  /** ITEM_TYPE_WILD - 百搭可代替所有图标，除了夺宝 */
  ITEM_TYPE_WILD = 1,
  /** ITEM_TYPE_SCATTER - 夺宝 */
  ITEM_TYPE_SCATTER = 2,
  /** ITEM_TYPE_INGOTS - 元宝 */
  ITEM_TYPE_INGOTS = 3,
  /** ITEM_TYPE_CARP - 锦鲤 */
  ITEM_TYPE_CARP = 4,
  /** ITEM_TYPE_FIRECRACKER - 鞭炮 */
  ITEM_TYPE_FIRECRACKER = 5,
  /** ITEM_TYPE_REDPACK - 红包 */
  ITEM_TYPE_REDPACK = 6,
  /** ITEM_TYPE_A - A */
  ITEM_TYPE_A = 7,
  /** ITEM_TYPE_K - K */
  ITEM_TYPE_K = 8,
  /** ITEM_TYPE_Q - Q */
  ITEM_TYPE_Q = 9,
  /** ITEM_TYPE_J - J */
  ITEM_TYPE_J = 10,
  /** ITEM_TYPE_10 - 10 */
  ITEM_TYPE_10 = 11,
  /** GOLD_MOD - 金色模组取色用 */
  GOLD_MOD = 16,
  /** ITEM_TYPE_INGOTS_GOLD - 元宝 */
  ITEM_TYPE_INGOTS_GOLD = 19,
  /** ITEM_TYPE_CARP_GOLD - 锦鲤 */
  ITEM_TYPE_CARP_GOLD = 20,
  /** ITEM_TYPE_FIRECRACKER_GOLD - 鞭炮 */
  ITEM_TYPE_FIRECRACKER_GOLD = 21,
  /** ITEM_TYPE_REDPACK_GOLD - 红包 */
  ITEM_TYPE_REDPACK_GOLD = 22,
  /** ITEM_TYPE_A_GOLD - A */
  ITEM_TYPE_A_GOLD = 23,
  /** ITEM_TYPE_K_GOLD - K */
  ITEM_TYPE_K_GOLD = 24,
  /** ITEM_TYPE_Q_GOLD - Q */
  ITEM_TYPE_Q_GOLD = 25,
  /** ITEM_TYPE_J_GOLD - J */
  ITEM_TYPE_J_GOLD = 26,
  /** ITEM_TYPE_10_GOLD - 10 */
  ITEM_TYPE_10_GOLD = 27,
  UNRECOGNIZED = -1,
}

export function tItemtypeFromJSON(object: any): TItemtype {
  switch (object) {
    case 0:
    case "ITEM_TYPE_NIL":
      return TItemtype.ITEM_TYPE_NIL;
    case 1:
    case "ITEM_TYPE_WILD":
      return TItemtype.ITEM_TYPE_WILD;
    case 2:
    case "ITEM_TYPE_SCATTER":
      return TItemtype.ITEM_TYPE_SCATTER;
    case 3:
    case "ITEM_TYPE_INGOTS":
      return TItemtype.ITEM_TYPE_INGOTS;
    case 4:
    case "ITEM_TYPE_CARP":
      return TItemtype.ITEM_TYPE_CARP;
    case 5:
    case "ITEM_TYPE_FIRECRACKER":
      return TItemtype.ITEM_TYPE_FIRECRACKER;
    case 6:
    case "ITEM_TYPE_REDPACK":
      return TItemtype.ITEM_TYPE_REDPACK;
    case 7:
    case "ITEM_TYPE_A":
      return TItemtype.ITEM_TYPE_A;
    case 8:
    case "ITEM_TYPE_K":
      return TItemtype.ITEM_TYPE_K;
    case 9:
    case "ITEM_TYPE_Q":
      return TItemtype.ITEM_TYPE_Q;
    case 10:
    case "ITEM_TYPE_J":
      return TItemtype.ITEM_TYPE_J;
    case 11:
    case "ITEM_TYPE_10":
      return TItemtype.ITEM_TYPE_10;
    case 16:
    case "GOLD_MOD":
      return TItemtype.GOLD_MOD;
    case 19:
    case "ITEM_TYPE_INGOTS_GOLD":
      return TItemtype.ITEM_TYPE_INGOTS_GOLD;
    case 20:
    case "ITEM_TYPE_CARP_GOLD":
      return TItemtype.ITEM_TYPE_CARP_GOLD;
    case 21:
    case "ITEM_TYPE_FIRECRACKER_GOLD":
      return TItemtype.ITEM_TYPE_FIRECRACKER_GOLD;
    case 22:
    case "ITEM_TYPE_REDPACK_GOLD":
      return TItemtype.ITEM_TYPE_REDPACK_GOLD;
    case 23:
    case "ITEM_TYPE_A_GOLD":
      return TItemtype.ITEM_TYPE_A_GOLD;
    case 24:
    case "ITEM_TYPE_K_GOLD":
      return TItemtype.ITEM_TYPE_K_GOLD;
    case 25:
    case "ITEM_TYPE_Q_GOLD":
      return TItemtype.ITEM_TYPE_Q_GOLD;
    case 26:
    case "ITEM_TYPE_J_GOLD":
      return TItemtype.ITEM_TYPE_J_GOLD;
    case 27:
    case "ITEM_TYPE_10_GOLD":
      return TItemtype.ITEM_TYPE_10_GOLD;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TItemtype.UNRECOGNIZED;
  }
}

export function tItemtypeToJSON(object: TItemtype): string {
  switch (object) {
    case TItemtype.ITEM_TYPE_NIL:
      return "ITEM_TYPE_NIL";
    case TItemtype.ITEM_TYPE_WILD:
      return "ITEM_TYPE_WILD";
    case TItemtype.ITEM_TYPE_SCATTER:
      return "ITEM_TYPE_SCATTER";
    case TItemtype.ITEM_TYPE_INGOTS:
      return "ITEM_TYPE_INGOTS";
    case TItemtype.ITEM_TYPE_CARP:
      return "ITEM_TYPE_CARP";
    case TItemtype.ITEM_TYPE_FIRECRACKER:
      return "ITEM_TYPE_FIRECRACKER";
    case TItemtype.ITEM_TYPE_REDPACK:
      return "ITEM_TYPE_REDPACK";
    case TItemtype.ITEM_TYPE_A:
      return "ITEM_TYPE_A";
    case TItemtype.ITEM_TYPE_K:
      return "ITEM_TYPE_K";
    case TItemtype.ITEM_TYPE_Q:
      return "ITEM_TYPE_Q";
    case TItemtype.ITEM_TYPE_J:
      return "ITEM_TYPE_J";
    case TItemtype.ITEM_TYPE_10:
      return "ITEM_TYPE_10";
    case TItemtype.GOLD_MOD:
      return "GOLD_MOD";
    case TItemtype.ITEM_TYPE_INGOTS_GOLD:
      return "ITEM_TYPE_INGOTS_GOLD";
    case TItemtype.ITEM_TYPE_CARP_GOLD:
      return "ITEM_TYPE_CARP_GOLD";
    case TItemtype.ITEM_TYPE_FIRECRACKER_GOLD:
      return "ITEM_TYPE_FIRECRACKER_GOLD";
    case TItemtype.ITEM_TYPE_REDPACK_GOLD:
      return "ITEM_TYPE_REDPACK_GOLD";
    case TItemtype.ITEM_TYPE_A_GOLD:
      return "ITEM_TYPE_A_GOLD";
    case TItemtype.ITEM_TYPE_K_GOLD:
      return "ITEM_TYPE_K_GOLD";
    case TItemtype.ITEM_TYPE_Q_GOLD:
      return "ITEM_TYPE_Q_GOLD";
    case TItemtype.ITEM_TYPE_J_GOLD:
      return "ITEM_TYPE_J_GOLD";
    case TItemtype.ITEM_TYPE_10_GOLD:
      return "ITEM_TYPE_10_GOLD";
    case TItemtype.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface TItemtypeList {
  /** 列表 */
  item_type_list: TItemtype[];
}

function createBaseTItemtypeList(): TItemtypeList {
  return { item_type_list: [] };
}

export const TItemtypeList = {
  encode(message: TItemtypeList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.item_type_list) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TItemtypeList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTItemtypeList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 8) {
            message.item_type_list.push(reader.int32() as any);

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.item_type_list.push(reader.int32() as any);
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TItemtypeList {
    return {
      item_type_list: Array.isArray(object?.itemTypeList)
        ? object.itemTypeList.map((e: any) => tItemtypeFromJSON(e))
        : [],
    };
  },

  toJSON(message: TItemtypeList): unknown {
    const obj: any = {};
    if (message.item_type_list) {
      obj.itemTypeList = message.item_type_list.map((e) => tItemtypeToJSON(e));
    } else {
      obj.itemTypeList = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TItemtypeList>, I>>(base?: I): TItemtypeList {
    return TItemtypeList.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TItemtypeList>, I>>(object: I): TItemtypeList {
    const message = createBaseTItemtypeList();
    message.item_type_list = object.item_type_list?.map((e) => e) || [];
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
