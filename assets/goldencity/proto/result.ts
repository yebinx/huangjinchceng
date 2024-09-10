/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { TItemtype, tItemtypeFromJSON, TItemtypeList, tItemtypeToJSON } from "./itemtype";

export const protobufPackage = "";

/** 一列符号 */
export interface TColSymbol {
  list: TItemtype[];
}

export interface TResult {
  /**  */
  round_list: TRound[];
  /** 本轮中奖的基本倍率 */
  rate: number;
  /** 夺宝数量 */
  scatter_count: number;
  /** 获得几次免费次数 */
  free_play: number;
  /** 开奖位置, 列*100 + 开奖idx */
  scatter_symbol_point: number[];
}

/**
 * 4   9  14
 * 0   5  10  15  19
 * 1   6  11  16  20
 * 2   7  12  17  21
 * 3   8  13  18  22
 */
export interface TRound {
  /** 本次所有卡牌, 0-22, */
  item_type_list: TItemtype[];
  /** 本次中奖的 */
  round_rate: number;
  /** 轮号 */
  round: number;
  /** 翻倍倍数表 */
  multi_time: number;
  /** 奖励列表 */
  prize_list: TPrize[];
  /** 下一次要出的列表 */
  next_list: TItemtype[];
  /** 数组形态, 这个形态下会出更多的内容 */
  list: TItemtypeList[];
  /** 胜利位置, 所有一起的胜利的位置 */
  win_pos_list: number[];
  /** 二维数组 */
  dyadic_list: TDyadic[];
  /** 用来垫底的列表 */
  previous_list: TItemtype[];
  /** 用来垫底的列表, 左右2个 */
  two_bottom_list: TItemtype[];
  /** 从左边往右， 从下往上 */
  col_symbol_list: TColSymbol[];
  /** 开奖位置, 列*100 + 开奖idx */
  win_symbol_point: number[];
  /**
   * int32                  win_balance       = 23; // 赢多少
   * int32                  round             = 24; // 轮号
   * int32                  rate              = 25; // 本轮总赢倍率 总额 / 线数 / 押分
   */
  free_play: number;
}

/** 奖励的具体详情 */
export interface TPrize {
  /** 胜利位置, 给客户端做连线和消除用 */
  win_pos_list: number[];
  /** 连线数量, 正常是1线, 多个 */
  count: number;
  /** 轴, 至少是3, 至多是5 */
  level: number;
  /** 中奖麻将类型 */
  item_type: TItemtype;
  /** 图标倍数 */
  rate: number;
}

/** 展示用的二维数组 */
export interface TDyadic {
  list: number[];
}

function createBaseTColSymbol(): TColSymbol {
  return { list: [] };
}

export const TColSymbol = {
  encode(message: TColSymbol, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.list) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TColSymbol {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTColSymbol();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 8) {
            message.list.push(reader.int32() as any);

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.list.push(reader.int32() as any);
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

  fromJSON(object: any): TColSymbol {
    return { list: Array.isArray(object?.list) ? object.list.map((e: any) => tItemtypeFromJSON(e)) : [] };
  },

  toJSON(message: TColSymbol): unknown {
    const obj: any = {};
    if (message.list) {
      obj.list = message.list.map((e) => tItemtypeToJSON(e));
    } else {
      obj.list = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TColSymbol>, I>>(base?: I): TColSymbol {
    return TColSymbol.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TColSymbol>, I>>(object: I): TColSymbol {
    const message = createBaseTColSymbol();
    message.list = object.list?.map((e) => e) || [];
    return message;
  },
};

function createBaseTResult(): TResult {
  return { round_list: [], rate: 0, scatter_count: 0, free_play: 0, scatter_symbol_point: [] };
}

export const TResult = {
  encode(message: TResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.round_list) {
      TRound.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.rate !== 0) {
      writer.uint32(16).int32(message.rate);
    }
    if (message.scatter_count !== 0) {
      writer.uint32(24).int32(message.scatter_count);
    }
    if (message.free_play !== 0) {
      writer.uint32(32).int32(message.free_play);
    }
    writer.uint32(42).fork();
    for (const v of message.scatter_symbol_point) {
      writer.uint32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TResult {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.round_list.push(TRound.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.rate = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.scatter_count = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.free_play = reader.int32();
          continue;
        case 5:
          if (tag === 40) {
            message.scatter_symbol_point.push(reader.uint32());

            continue;
          }

          if (tag === 42) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.scatter_symbol_point.push(reader.uint32());
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

  fromJSON(object: any): TResult {
    return {
      round_list: Array.isArray(object?.roundList) ? object.roundList.map((e: any) => TRound.fromJSON(e)) : [],
      rate: isSet(object.rate) ? Number(object.rate) : 0,
      scatter_count: isSet(object.scatterCount) ? Number(object.scatterCount) : 0,
      free_play: isSet(object.freePlay) ? Number(object.freePlay) : 0,
      scatter_symbol_point: Array.isArray(object?.scatterSymbolPoint)
        ? object.scatterSymbolPoint.map((e: any) => Number(e))
        : [],
    };
  },

  toJSON(message: TResult): unknown {
    const obj: any = {};
    if (message.round_list) {
      obj.roundList = message.round_list.map((e) => e ? TRound.toJSON(e) : undefined);
    } else {
      obj.roundList = [];
    }
    message.rate !== undefined && (obj.rate = Math.round(message.rate));
    message.scatter_count !== undefined && (obj.scatterCount = Math.round(message.scatter_count));
    message.free_play !== undefined && (obj.freePlay = Math.round(message.free_play));
    if (message.scatter_symbol_point) {
      obj.scatterSymbolPoint = message.scatter_symbol_point.map((e) => Math.round(e));
    } else {
      obj.scatterSymbolPoint = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TResult>, I>>(base?: I): TResult {
    return TResult.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TResult>, I>>(object: I): TResult {
    const message = createBaseTResult();
    message.round_list = object.round_list?.map((e) => TRound.fromPartial(e)) || [];
    message.rate = object.rate ?? 0;
    message.scatter_count = object.scatter_count ?? 0;
    message.free_play = object.free_play ?? 0;
    message.scatter_symbol_point = object.scatter_symbol_point?.map((e) => e) || [];
    return message;
  },
};

function createBaseTRound(): TRound {
  return {
    item_type_list: [],
    round_rate: 0,
    round: 0,
    multi_time: 0,
    prize_list: [],
    next_list: [],
    list: [],
    win_pos_list: [],
    dyadic_list: [],
    previous_list: [],
    two_bottom_list: [],
    col_symbol_list: [],
    win_symbol_point: [],
    free_play: 0,
  };
}

export const TRound = {
  encode(message: TRound, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.item_type_list) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.round_rate !== 0) {
      writer.uint32(16).int32(message.round_rate);
    }
    if (message.round !== 0) {
      writer.uint32(24).uint32(message.round);
    }
    if (message.multi_time !== 0) {
      writer.uint32(32).uint32(message.multi_time);
    }
    for (const v of message.prize_list) {
      TPrize.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    writer.uint32(50).fork();
    for (const v of message.next_list) {
      writer.int32(v);
    }
    writer.ldelim();
    for (const v of message.list) {
      TItemtypeList.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    writer.uint32(66).fork();
    for (const v of message.win_pos_list) {
      writer.uint32(v);
    }
    writer.ldelim();
    for (const v of message.dyadic_list) {
      TDyadic.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    writer.uint32(82).fork();
    for (const v of message.previous_list) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(90).fork();
    for (const v of message.two_bottom_list) {
      writer.int32(v);
    }
    writer.ldelim();
    for (const v of message.col_symbol_list) {
      TColSymbol.encode(v!, writer.uint32(170).fork()).ldelim();
    }
    writer.uint32(178).fork();
    for (const v of message.win_symbol_point) {
      writer.uint32(v);
    }
    writer.ldelim();
    if (message.free_play !== 0) {
      writer.uint32(216).int32(message.free_play);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TRound {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTRound();
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
        case 2:
          if (tag !== 16) {
            break;
          }

          message.round_rate = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.round = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.multi_time = reader.uint32();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.prize_list.push(TPrize.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag === 48) {
            message.next_list.push(reader.int32() as any);

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.next_list.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.list.push(TItemtypeList.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag === 64) {
            message.win_pos_list.push(reader.uint32());

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.win_pos_list.push(reader.uint32());
            }

            continue;
          }

          break;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.dyadic_list.push(TDyadic.decode(reader, reader.uint32()));
          continue;
        case 10:
          if (tag === 80) {
            message.previous_list.push(reader.int32() as any);

            continue;
          }

          if (tag === 82) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.previous_list.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 11:
          if (tag === 88) {
            message.two_bottom_list.push(reader.int32() as any);

            continue;
          }

          if (tag === 90) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.two_bottom_list.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.col_symbol_list.push(TColSymbol.decode(reader, reader.uint32()));
          continue;
        case 22:
          if (tag === 176) {
            message.win_symbol_point.push(reader.uint32());

            continue;
          }

          if (tag === 178) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.win_symbol_point.push(reader.uint32());
            }

            continue;
          }

          break;
        case 27:
          if (tag !== 216) {
            break;
          }

          message.free_play = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TRound {
    return {
      item_type_list: Array.isArray(object?.itemTypeList)
        ? object.itemTypeList.map((e: any) => tItemtypeFromJSON(e))
        : [],
      round_rate: isSet(object.roundRate) ? Number(object.roundRate) : 0,
      round: isSet(object.round) ? Number(object.round) : 0,
      multi_time: isSet(object.multiTime) ? Number(object.multiTime) : 0,
      prize_list: Array.isArray(object?.prizeList) ? object.prizeList.map((e: any) => TPrize.fromJSON(e)) : [],
      next_list: Array.isArray(object?.nextList) ? object.nextList.map((e: any) => tItemtypeFromJSON(e)) : [],
      list: Array.isArray(object?.list) ? object.list.map((e: any) => TItemtypeList.fromJSON(e)) : [],
      win_pos_list: Array.isArray(object?.winPosList) ? object.winPosList.map((e: any) => Number(e)) : [],
      dyadic_list: Array.isArray(object?.dyadicList) ? object.dyadicList.map((e: any) => TDyadic.fromJSON(e)) : [],
      previous_list: Array.isArray(object?.previousList)
        ? object.previousList.map((e: any) => tItemtypeFromJSON(e))
        : [],
      two_bottom_list: Array.isArray(object?.twoBottomList)
        ? object.twoBottomList.map((e: any) => tItemtypeFromJSON(e))
        : [],
      col_symbol_list: Array.isArray(object?.colSymbolList)
        ? object.colSymbolList.map((e: any) => TColSymbol.fromJSON(e))
        : [],
      win_symbol_point: Array.isArray(object?.winSymbolPoint) ? object.winSymbolPoint.map((e: any) => Number(e)) : [],
      free_play: isSet(object.freePlay) ? Number(object.freePlay) : 0,
    };
  },

  toJSON(message: TRound): unknown {
    const obj: any = {};
    if (message.item_type_list) {
      obj.itemTypeList = message.item_type_list.map((e) => tItemtypeToJSON(e));
    } else {
      obj.itemTypeList = [];
    }
    message.round_rate !== undefined && (obj.roundRate = Math.round(message.round_rate));
    message.round !== undefined && (obj.round = Math.round(message.round));
    message.multi_time !== undefined && (obj.multiTime = Math.round(message.multi_time));
    if (message.prize_list) {
      obj.prizeList = message.prize_list.map((e) => e ? TPrize.toJSON(e) : undefined);
    } else {
      obj.prizeList = [];
    }
    if (message.next_list) {
      obj.nextList = message.next_list.map((e) => tItemtypeToJSON(e));
    } else {
      obj.nextList = [];
    }
    if (message.list) {
      obj.list = message.list.map((e) => e ? TItemtypeList.toJSON(e) : undefined);
    } else {
      obj.list = [];
    }
    if (message.win_pos_list) {
      obj.winPosList = message.win_pos_list.map((e) => Math.round(e));
    } else {
      obj.winPosList = [];
    }
    if (message.dyadic_list) {
      obj.dyadicList = message.dyadic_list.map((e) => e ? TDyadic.toJSON(e) : undefined);
    } else {
      obj.dyadicList = [];
    }
    if (message.previous_list) {
      obj.previousList = message.previous_list.map((e) => tItemtypeToJSON(e));
    } else {
      obj.previousList = [];
    }
    if (message.two_bottom_list) {
      obj.twoBottomList = message.two_bottom_list.map((e) => tItemtypeToJSON(e));
    } else {
      obj.twoBottomList = [];
    }
    if (message.col_symbol_list) {
      obj.colSymbolList = message.col_symbol_list.map((e) => e ? TColSymbol.toJSON(e) : undefined);
    } else {
      obj.colSymbolList = [];
    }
    if (message.win_symbol_point) {
      obj.winSymbolPoint = message.win_symbol_point.map((e) => Math.round(e));
    } else {
      obj.winSymbolPoint = [];
    }
    message.free_play !== undefined && (obj.freePlay = Math.round(message.free_play));
    return obj;
  },

  create<I extends Exact<DeepPartial<TRound>, I>>(base?: I): TRound {
    return TRound.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TRound>, I>>(object: I): TRound {
    const message = createBaseTRound();
    message.item_type_list = object.item_type_list?.map((e) => e) || [];
    message.round_rate = object.round_rate ?? 0;
    message.round = object.round ?? 0;
    message.multi_time = object.multi_time ?? 0;
    message.prize_list = object.prize_list?.map((e) => TPrize.fromPartial(e)) || [];
    message.next_list = object.next_list?.map((e) => e) || [];
    message.list = object.list?.map((e) => TItemtypeList.fromPartial(e)) || [];
    message.win_pos_list = object.win_pos_list?.map((e) => e) || [];
    message.dyadic_list = object.dyadic_list?.map((e) => TDyadic.fromPartial(e)) || [];
    message.previous_list = object.previous_list?.map((e) => e) || [];
    message.two_bottom_list = object.two_bottom_list?.map((e) => e) || [];
    message.col_symbol_list = object.col_symbol_list?.map((e) => TColSymbol.fromPartial(e)) || [];
    message.win_symbol_point = object.win_symbol_point?.map((e) => e) || [];
    message.free_play = object.free_play ?? 0;
    return message;
  },
};

function createBaseTPrize(): TPrize {
  return { win_pos_list: [], count: 0, level: 0, item_type: 0, rate: 0 };
}

export const TPrize = {
  encode(message: TPrize, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.win_pos_list) {
      writer.uint32(v);
    }
    writer.ldelim();
    if (message.count !== 0) {
      writer.uint32(16).uint32(message.count);
    }
    if (message.level !== 0) {
      writer.uint32(24).uint32(message.level);
    }
    if (message.item_type !== 0) {
      writer.uint32(32).int32(message.item_type);
    }
    if (message.rate !== 0) {
      writer.uint32(40).int32(message.rate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TPrize {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTPrize();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 8) {
            message.win_pos_list.push(reader.uint32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.win_pos_list.push(reader.uint32());
            }

            continue;
          }

          break;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.count = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.level = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.item_type = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.rate = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TPrize {
    return {
      win_pos_list: Array.isArray(object?.winPosList) ? object.winPosList.map((e: any) => Number(e)) : [],
      count: isSet(object.count) ? Number(object.count) : 0,
      level: isSet(object.level) ? Number(object.level) : 0,
      item_type: isSet(object.itemType) ? tItemtypeFromJSON(object.itemType) : 0,
      rate: isSet(object.rate) ? Number(object.rate) : 0,
    };
  },

  toJSON(message: TPrize): unknown {
    const obj: any = {};
    if (message.win_pos_list) {
      obj.winPosList = message.win_pos_list.map((e) => Math.round(e));
    } else {
      obj.winPosList = [];
    }
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.level !== undefined && (obj.level = Math.round(message.level));
    message.item_type !== undefined && (obj.itemType = tItemtypeToJSON(message.item_type));
    message.rate !== undefined && (obj.rate = Math.round(message.rate));
    return obj;
  },

  create<I extends Exact<DeepPartial<TPrize>, I>>(base?: I): TPrize {
    return TPrize.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TPrize>, I>>(object: I): TPrize {
    const message = createBaseTPrize();
    message.win_pos_list = object.win_pos_list?.map((e) => e) || [];
    message.count = object.count ?? 0;
    message.level = object.level ?? 0;
    message.item_type = object.item_type ?? 0;
    message.rate = object.rate ?? 0;
    return message;
  },
};

function createBaseTDyadic(): TDyadic {
  return { list: [] };
}

export const TDyadic = {
  encode(message: TDyadic, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.list) {
      writer.uint32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TDyadic {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTDyadic();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 8) {
            message.list.push(reader.uint32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.list.push(reader.uint32());
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

  fromJSON(object: any): TDyadic {
    return { list: Array.isArray(object?.list) ? object.list.map((e: any) => Number(e)) : [] };
  },

  toJSON(message: TDyadic): unknown {
    const obj: any = {};
    if (message.list) {
      obj.list = message.list.map((e) => Math.round(e));
    } else {
      obj.list = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TDyadic>, I>>(base?: I): TDyadic {
    return TDyadic.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TDyadic>, I>>(object: I): TDyadic {
    const message = createBaseTDyadic();
    message.list = object.list?.map((e) => e) || [];
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
