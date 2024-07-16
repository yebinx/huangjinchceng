/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";

export const protobufPackage = "";

export enum IconDefine {
  /** BLANK - 首值默认0，不代表任何意思 */
  BLANK = 0,
  WILD = 1,
  SCATTER = 2,
  GOLDMASK = 3,
  REDMASK = 4,
  TOTEM1 = 5,
  TOTEM2 = 6,
  TOTEM3 = 7,
  TOTEM4 = 8,
  ACE = 9,
  KING = 10,
  QUEEN = 11,
  JACK = 12,
  TEN = 13,
  UNRECOGNIZED = -1,
}

export function iconDefineFromJSON(object: any): IconDefine {
  switch (object) {
    case 0:
    case "BLANK":
      return IconDefine.BLANK;
    case 1:
    case "WILD":
      return IconDefine.WILD;
    case 2:
    case "SCATTER":
      return IconDefine.SCATTER;
    case 3:
    case "GOLDMASK":
      return IconDefine.GOLDMASK;
    case 4:
    case "REDMASK":
      return IconDefine.REDMASK;
    case 5:
    case "TOTEM1":
      return IconDefine.TOTEM1;
    case 6:
    case "TOTEM2":
      return IconDefine.TOTEM2;
    case 7:
    case "TOTEM3":
      return IconDefine.TOTEM3;
    case 8:
    case "TOTEM4":
      return IconDefine.TOTEM4;
    case 9:
    case "ACE":
      return IconDefine.ACE;
    case 10:
    case "KING":
      return IconDefine.KING;
    case 11:
    case "QUEEN":
      return IconDefine.QUEEN;
    case 12:
    case "JACK":
      return IconDefine.JACK;
    case 13:
    case "TEN":
      return IconDefine.TEN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return IconDefine.UNRECOGNIZED;
  }
}

export function iconDefineToJSON(object: IconDefine): string {
  switch (object) {
    case IconDefine.BLANK:
      return "BLANK";
    case IconDefine.WILD:
      return "WILD";
    case IconDefine.SCATTER:
      return "SCATTER";
    case IconDefine.GOLDMASK:
      return "GOLDMASK";
    case IconDefine.REDMASK:
      return "REDMASK";
    case IconDefine.TOTEM1:
      return "TOTEM1";
    case IconDefine.TOTEM2:
      return "TOTEM2";
    case IconDefine.TOTEM3:
      return "TOTEM3";
    case IconDefine.TOTEM4:
      return "TOTEM4";
    case IconDefine.ACE:
      return "ACE";
    case IconDefine.KING:
      return "KING";
    case IconDefine.QUEEN:
      return "QUEEN";
    case IconDefine.JACK:
      return "JACK";
    case IconDefine.TEN:
      return "TEN";
    case IconDefine.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum IconGrid {
  SPACE_NULL = 0,
  /** SPACEBASE - 没有100 */
  SPACEBASE = 100,
  /** SPACE2 - 2格 */
  SPACE2 = 200,
  /** SPACE3 - 3格 */
  SPACE3 = 300,
  /** SPACE4 - 4格 */
  SPACE4 = 400,
  UNRECOGNIZED = -1,
}

export function iconGridFromJSON(object: any): IconGrid {
  switch (object) {
    case 0:
    case "SPACE_NULL":
      return IconGrid.SPACE_NULL;
    case 100:
    case "SPACEBASE":
      return IconGrid.SPACEBASE;
    case 200:
    case "SPACE2":
      return IconGrid.SPACE2;
    case 300:
    case "SPACE3":
      return IconGrid.SPACE3;
    case 400:
    case "SPACE4":
      return IconGrid.SPACE4;
    case -1:
    case "UNRECOGNIZED":
    default:
      return IconGrid.UNRECOGNIZED;
  }
}

export function iconGridToJSON(object: IconGrid): string {
  switch (object) {
    case IconGrid.SPACE_NULL:
      return "SPACE_NULL";
    case IconGrid.SPACEBASE:
      return "SPACEBASE";
    case IconGrid.SPACE2:
      return "SPACE2";
    case IconGrid.SPACE3:
      return "SPACE3";
    case IconGrid.SPACE4:
      return "SPACE4";
    case IconGrid.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum IconFrame {
  ICON_NULL = 0,
  SILVER = 1,
  GOLD = 2,
  /** SILVERFRAME - 银 */
  SILVERFRAME = 1000,
  /** GOLDFRAME - 金 */
  GOLDFRAME = 2000,
  /** WILDFRAME - 金转百搭，客户端自己使用 */
  WILDFRAME = 3000,
  UNRECOGNIZED = -1,
}

export function iconFrameFromJSON(object: any): IconFrame {
  switch (object) {
    case 0:
    case "ICON_NULL":
      return IconFrame.ICON_NULL;
    case 1:
    case "SILVER":
      return IconFrame.SILVER;
    case 2:
    case "GOLD":
      return IconFrame.GOLD;
    case 1000:
    case "SILVERFRAME":
      return IconFrame.SILVERFRAME;
    case 2000:
    case "GOLDFRAME":
      return IconFrame.GOLDFRAME;
    case 3000:
    case "WILDFRAME":
      return IconFrame.WILDFRAME;
    case -1:
    case "UNRECOGNIZED":
    default:
      return IconFrame.UNRECOGNIZED;
  }
}

export function iconFrameToJSON(object: IconFrame): string {
  switch (object) {
    case IconFrame.ICON_NULL:
      return "ICON_NULL";
    case IconFrame.SILVER:
      return "SILVER";
    case IconFrame.GOLD:
      return "GOLD";
    case IconFrame.SILVERFRAME:
      return "SILVERFRAME";
    case IconFrame.GOLDFRAME:
      return "GOLDFRAME";
    case IconFrame.WILDFRAME:
      return "WILDFRAME";
    case IconFrame.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum TAccountStatus {
  /** ACCOUNT_STATUS_NORMAL - 普通 */
  ACCOUNT_STATUS_NORMAL = 0,
  /** ACCOUNT_STATUS_FROZEN - 冻结 */
  ACCOUNT_STATUS_FROZEN = 1,
  /** ACCOUNT_STATUS_FORBIDEN - 封号 */
  ACCOUNT_STATUS_FORBIDEN = 2,
  UNRECOGNIZED = -1,
}

export function tAccountStatusFromJSON(object: any): TAccountStatus {
  switch (object) {
    case 0:
    case "ACCOUNT_STATUS_NORMAL":
      return TAccountStatus.ACCOUNT_STATUS_NORMAL;
    case 1:
    case "ACCOUNT_STATUS_FROZEN":
      return TAccountStatus.ACCOUNT_STATUS_FROZEN;
    case 2:
    case "ACCOUNT_STATUS_FORBIDEN":
      return TAccountStatus.ACCOUNT_STATUS_FORBIDEN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TAccountStatus.UNRECOGNIZED;
  }
}

export function tAccountStatusToJSON(object: TAccountStatus): string {
  switch (object) {
    case TAccountStatus.ACCOUNT_STATUS_NORMAL:
      return "ACCOUNT_STATUS_NORMAL";
    case TAccountStatus.ACCOUNT_STATUS_FROZEN:
      return "ACCOUNT_STATUS_FROZEN";
    case TAccountStatus.ACCOUNT_STATUS_FORBIDEN:
      return "ACCOUNT_STATUS_FORBIDEN";
    case TAccountStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** // 银色变金色图标索引位置和 变为金色图标的ID */
export interface TS2G {
  /** 变的金色id */
  goldenid: number;
  /** 银色图标索引 */
  silverindex: number;
}

export interface TGoldenCityCardList {
  /** 这一盘的牌型的列表 */
  list: IconDefine[];
  /** 消除的位置 */
  winpos: number[];
  /** 每一列降落图标列表 */
  droplist: IconDefine[];
  /** 银变金信息 */
  s2glist: TS2G[];
}

export interface TRemoveList {
  /** 中奖图标 */
  iconid: IconDefine;
  /** 中奖线数 */
  winlines: number;
  /** 中奖数组类似[2 3 2 1 2] */
  wincount: number[];
}

export interface TResult {
  /** 图标列表 */
  card_list: TGoldenCityCardList[];
  /** 赢的金额 */
  win: number;
  /** 除开这局之前赢的总金额, 1.每次旋转的后的总赢，2.登录的值是所有的总赢包含免费游戏和普通游戏 */
  havewin: number;
  /** 消除具体信息 */
  removelist: TRemoveList[];
  /** 每一次旋转的回合ID，与每一次下注产生的orderid不同。orderid 包含或者等于roundid */
  roundid: string;
  /** 上一次免费回合里面的场景倍数 */
  sceneodds: number;
  /** 余额 */
  balance: number;
  /** 夺宝次数 */
  scattercount: number;
  /** 每次旋转的发生时间 */
  createtime: number;
}

export interface TPlayerInfo {
  id: string;
  /** 代理ID */
  agent_id: number;
  /** 玩家余额 */
  balance: number;
  /** 玩家冻结余额 */
  frozen: number;
  /** 玩家账户 */
  account: string;
  /** 玩家昵称(如果需要) */
  nickname: string;
  /** 是否购买 */
  is_buy: string;
  /** 玩家状态 */
  status: TAccountStatus;
  /** 目标金额 */
  target: number;
  /** 完成金额 */
  complete: number;
  /** 控制比例 */
  contr_rate: number;
  /** 1:黑名单  2:白名单 */
  special: number;
  /** 代理的名称 */
  agent_name: string;
  /** 最后登录的IP */
  client_ip: string;
  /** 来源标识码 */
  line_code: string;
  /** 玩家余额 */
  balance_s: string;
  /** 玩家类型:0-正常1-试玩 */
  type: number;
  /** 平台 1:Android 2:Macos 3:IOS 4:windows 5:Macos 6:ohters */
  platform: number;
  /** 音效状态 */
  mute: number;
  create_time: string;
  update_time: string;
}

export interface TGoldenCityGameInfo {
  id: string;
  /** 玩家ID */
  player_id: number;
  /** 上一次下注剩余次数 */
  free_play_times: number;
  /** 最后一次下注额度 */
  last_time_bet: number;
  /** 上一次下注ID */
  last_bet_id: number;
  /** 投注大小 */
  betsize: number;
  /** 投注倍数 */
  betmultiple: number;
  /** 订单ID，当触发了免费局后会更新这个字段 */
  orderid: number;
  /** 投注组合对应的ID */
  betid: number;
  /** 上一次免费回合里面的场景倍数 */
  sceneodds: number;
  /** 本次orderId，之前赢的总金额 */
  havewin: number;
  create_time: number;
  update_time: number;
}

function createBaseTS2G(): TS2G {
  return { goldenid: 0, silverindex: 0 };
}

export const TS2G = {
  encode(message: TS2G, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.goldenid !== 0) {
      writer.uint32(8).int32(message.goldenid);
    }
    if (message.silverindex !== 0) {
      writer.uint32(16).int32(message.silverindex);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TS2G {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTS2G();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.goldenid = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.silverindex = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TS2G {
    return {
      goldenid: isSet(object.goldenid) ? Number(object.goldenid) : 0,
      silverindex: isSet(object.silverindex) ? Number(object.silverindex) : 0,
    };
  },

  toJSON(message: TS2G): unknown {
    const obj: any = {};
    message.goldenid !== undefined && (obj.goldenid = Math.round(message.goldenid));
    message.silverindex !== undefined && (obj.silverindex = Math.round(message.silverindex));
    return obj;
  },

  create<I extends Exact<DeepPartial<TS2G>, I>>(base?: I): TS2G {
    return TS2G.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TS2G>, I>>(object: I): TS2G {
    const message = createBaseTS2G();
    message.goldenid = object.goldenid ?? 0;
    message.silverindex = object.silverindex ?? 0;
    return message;
  },
};

function createBaseTGoldenCityCardList(): TGoldenCityCardList {
  return { list: [], winpos: [], droplist: [], s2glist: [] };
}

export const TGoldenCityCardList = {
  encode(message: TGoldenCityCardList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.list) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(18).fork();
    for (const v of message.winpos) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(26).fork();
    for (const v of message.droplist) {
      writer.int32(v);
    }
    writer.ldelim();
    for (const v of message.s2glist) {
      TS2G.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TGoldenCityCardList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTGoldenCityCardList();
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
        case 2:
          if (tag === 16) {
            message.winpos.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.winpos.push(reader.int32());
            }

            continue;
          }

          break;
        case 3:
          if (tag === 24) {
            message.droplist.push(reader.int32() as any);

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.droplist.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.s2glist.push(TS2G.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TGoldenCityCardList {
    return {
      list: Array.isArray(object?.list) ? object.list.map((e: any) => iconDefineFromJSON(e)) : [],
      winpos: Array.isArray(object?.winpos) ? object.winpos.map((e: any) => Number(e)) : [],
      droplist: Array.isArray(object?.droplist) ? object.droplist.map((e: any) => iconDefineFromJSON(e)) : [],
      s2glist: Array.isArray(object?.s2glist) ? object.s2glist.map((e: any) => TS2G.fromJSON(e)) : [],
    };
  },

  toJSON(message: TGoldenCityCardList): unknown {
    const obj: any = {};
    if (message.list) {
      obj.list = message.list.map((e) => iconDefineToJSON(e));
    } else {
      obj.list = [];
    }
    if (message.winpos) {
      obj.winpos = message.winpos.map((e) => Math.round(e));
    } else {
      obj.winpos = [];
    }
    if (message.droplist) {
      obj.droplist = message.droplist.map((e) => iconDefineToJSON(e));
    } else {
      obj.droplist = [];
    }
    if (message.s2glist) {
      obj.s2glist = message.s2glist.map((e) => e ? TS2G.toJSON(e) : undefined);
    } else {
      obj.s2glist = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TGoldenCityCardList>, I>>(base?: I): TGoldenCityCardList {
    return TGoldenCityCardList.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TGoldenCityCardList>, I>>(object: I): TGoldenCityCardList {
    const message = createBaseTGoldenCityCardList();
    message.list = object.list?.map((e) => e) || [];
    message.winpos = object.winpos?.map((e) => e) || [];
    message.droplist = object.droplist?.map((e) => e) || [];
    message.s2glist = object.s2glist?.map((e) => TS2G.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTRemoveList(): TRemoveList {
  return { iconid: 0, winlines: 0, wincount: [] };
}

export const TRemoveList = {
  encode(message: TRemoveList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.iconid !== 0) {
      writer.uint32(8).int32(message.iconid);
    }
    if (message.winlines !== 0) {
      writer.uint32(16).int32(message.winlines);
    }
    writer.uint32(26).fork();
    for (const v of message.wincount) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TRemoveList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTRemoveList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.iconid = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.winlines = reader.int32();
          continue;
        case 3:
          if (tag === 24) {
            message.wincount.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.wincount.push(reader.int32());
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

  fromJSON(object: any): TRemoveList {
    return {
      iconid: isSet(object.iconid) ? iconDefineFromJSON(object.iconid) : 0,
      winlines: isSet(object.winlines) ? Number(object.winlines) : 0,
      wincount: Array.isArray(object?.wincount) ? object.wincount.map((e: any) => Number(e)) : [],
    };
  },

  toJSON(message: TRemoveList): unknown {
    const obj: any = {};
    message.iconid !== undefined && (obj.iconid = iconDefineToJSON(message.iconid));
    message.winlines !== undefined && (obj.winlines = Math.round(message.winlines));
    if (message.wincount) {
      obj.wincount = message.wincount.map((e) => Math.round(e));
    } else {
      obj.wincount = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TRemoveList>, I>>(base?: I): TRemoveList {
    return TRemoveList.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TRemoveList>, I>>(object: I): TRemoveList {
    const message = createBaseTRemoveList();
    message.iconid = object.iconid ?? 0;
    message.winlines = object.winlines ?? 0;
    message.wincount = object.wincount?.map((e) => e) || [];
    return message;
  },
};

function createBaseTResult(): TResult {
  return {
    card_list: [],
    win: 0,
    havewin: 0,
    removelist: [],
    roundid: "",
    sceneodds: 0,
    balance: 0,
    scattercount: 0,
    createtime: 0,
  };
}

export const TResult = {
  encode(message: TResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.card_list) {
      TGoldenCityCardList.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.win !== 0) {
      writer.uint32(16).int64(message.win);
    }
    if (message.havewin !== 0) {
      writer.uint32(24).int64(message.havewin);
    }
    for (const v of message.removelist) {
      TRemoveList.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.roundid !== "") {
      writer.uint32(42).string(message.roundid);
    }
    if (message.sceneodds !== 0) {
      writer.uint32(48).int32(message.sceneodds);
    }
    if (message.balance !== 0) {
      writer.uint32(56).int64(message.balance);
    }
    if (message.scattercount !== 0) {
      writer.uint32(64).int32(message.scattercount);
    }
    if (message.createtime !== 0) {
      writer.uint32(72).int64(message.createtime);
    }
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

          message.card_list.push(TGoldenCityCardList.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.win = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.havewin = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.removelist.push(TRemoveList.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.roundid = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.sceneodds = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.balance = longToNumber(reader.int64() as Long);
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.scattercount = reader.int32();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.createtime = longToNumber(reader.int64() as Long);
          continue;
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
      card_list: Array.isArray(object?.cardList)
        ? object.cardList.map((e: any) => TGoldenCityCardList.fromJSON(e))
        : [],
      win: isSet(object.win) ? Number(object.win) : 0,
      havewin: isSet(object.havewin) ? Number(object.havewin) : 0,
      removelist: Array.isArray(object?.removelist) ? object.removelist.map((e: any) => TRemoveList.fromJSON(e)) : [],
      roundid: isSet(object.roundid) ? String(object.roundid) : "",
      sceneodds: isSet(object.sceneodds) ? Number(object.sceneodds) : 0,
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      scattercount: isSet(object.scattercount) ? Number(object.scattercount) : 0,
      createtime: isSet(object.createtime) ? Number(object.createtime) : 0,
    };
  },

  toJSON(message: TResult): unknown {
    const obj: any = {};
    if (message.card_list) {
      obj.cardList = message.card_list.map((e) => e ? TGoldenCityCardList.toJSON(e) : undefined);
    } else {
      obj.cardList = [];
    }
    message.win !== undefined && (obj.win = Math.round(message.win));
    message.havewin !== undefined && (obj.havewin = Math.round(message.havewin));
    if (message.removelist) {
      obj.removelist = message.removelist.map((e) => e ? TRemoveList.toJSON(e) : undefined);
    } else {
      obj.removelist = [];
    }
    message.roundid !== undefined && (obj.roundid = message.roundid);
    message.sceneodds !== undefined && (obj.sceneodds = Math.round(message.sceneodds));
    message.balance !== undefined && (obj.balance = Math.round(message.balance));
    message.scattercount !== undefined && (obj.scattercount = Math.round(message.scattercount));
    message.createtime !== undefined && (obj.createtime = Math.round(message.createtime));
    return obj;
  },

  create<I extends Exact<DeepPartial<TResult>, I>>(base?: I): TResult {
    return TResult.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TResult>, I>>(object: I): TResult {
    const message = createBaseTResult();
    message.card_list = object.card_list?.map((e) => TGoldenCityCardList.fromPartial(e)) || [];
    message.win = object.win ?? 0;
    message.havewin = object.havewin ?? 0;
    message.removelist = object.removelist?.map((e) => TRemoveList.fromPartial(e)) || [];
    message.roundid = object.roundid ?? "";
    message.sceneodds = object.sceneodds ?? 0;
    message.balance = object.balance ?? 0;
    message.scattercount = object.scattercount ?? 0;
    message.createtime = object.createtime ?? 0;
    return message;
  },
};

function createBaseTPlayerInfo(): TPlayerInfo {
  return {
    id: "",
    agent_id: 0,
    balance: 0,
    frozen: 0,
    account: "",
    nickname: "",
    is_buy: "",
    status: 0,
    target: 0,
    complete: 0,
    contr_rate: 0,
    special: 0,
    agent_name: "",
    client_ip: "",
    line_code: "",
    balance_s: "",
    type: 0,
    platform: 0,
    mute: 0,
    create_time: "",
    update_time: "",
  };
}

export const TPlayerInfo = {
  encode(message: TPlayerInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.agent_id !== 0) {
      writer.uint32(16).int64(message.agent_id);
    }
    if (message.balance !== 0) {
      writer.uint32(24).int64(message.balance);
    }
    if (message.frozen !== 0) {
      writer.uint32(32).int64(message.frozen);
    }
    if (message.account !== "") {
      writer.uint32(42).string(message.account);
    }
    if (message.nickname !== "") {
      writer.uint32(50).string(message.nickname);
    }
    if (message.is_buy !== "") {
      writer.uint32(58).string(message.is_buy);
    }
    if (message.status !== 0) {
      writer.uint32(64).int32(message.status);
    }
    if (message.target !== 0) {
      writer.uint32(72).int64(message.target);
    }
    if (message.complete !== 0) {
      writer.uint32(80).int64(message.complete);
    }
    if (message.contr_rate !== 0) {
      writer.uint32(88).int32(message.contr_rate);
    }
    if (message.special !== 0) {
      writer.uint32(96).int32(message.special);
    }
    if (message.agent_name !== "") {
      writer.uint32(106).string(message.agent_name);
    }
    if (message.client_ip !== "") {
      writer.uint32(114).string(message.client_ip);
    }
    if (message.line_code !== "") {
      writer.uint32(122).string(message.line_code);
    }
    if (message.balance_s !== "") {
      writer.uint32(130).string(message.balance_s);
    }
    if (message.type !== 0) {
      writer.uint32(136).int32(message.type);
    }
    if (message.platform !== 0) {
      writer.uint32(144).int32(message.platform);
    }
    if (message.mute !== 0) {
      writer.uint32(152).int32(message.mute);
    }
    if (message.create_time !== "") {
      writer.uint32(794).string(message.create_time);
    }
    if (message.update_time !== "") {
      writer.uint32(802).string(message.update_time);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TPlayerInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTPlayerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.agent_id = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.balance = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.frozen = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.account = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.nickname = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.is_buy = reader.string();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.target = longToNumber(reader.int64() as Long);
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.complete = longToNumber(reader.int64() as Long);
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.contr_rate = reader.int32();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.special = reader.int32();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.agent_name = reader.string();
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.client_ip = reader.string();
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.line_code = reader.string();
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.balance_s = reader.string();
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }

          message.type = reader.int32();
          continue;
        case 18:
          if (tag !== 144) {
            break;
          }

          message.platform = reader.int32();
          continue;
        case 19:
          if (tag !== 152) {
            break;
          }

          message.mute = reader.int32();
          continue;
        case 99:
          if (tag !== 794) {
            break;
          }

          message.create_time = reader.string();
          continue;
        case 100:
          if (tag !== 802) {
            break;
          }

          message.update_time = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TPlayerInfo {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      agent_id: isSet(object.agentId) ? Number(object.agentId) : 0,
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      frozen: isSet(object.frozen) ? Number(object.frozen) : 0,
      account: isSet(object.account) ? String(object.account) : "",
      nickname: isSet(object.nickname) ? String(object.nickname) : "",
      is_buy: isSet(object.isBuy) ? String(object.isBuy) : "",
      status: isSet(object.status) ? tAccountStatusFromJSON(object.status) : 0,
      target: isSet(object.target) ? Number(object.target) : 0,
      complete: isSet(object.complete) ? Number(object.complete) : 0,
      contr_rate: isSet(object.contrRate) ? Number(object.contrRate) : 0,
      special: isSet(object.special) ? Number(object.special) : 0,
      agent_name: isSet(object.agentName) ? String(object.agentName) : "",
      client_ip: isSet(object.clientIp) ? String(object.clientIp) : "",
      line_code: isSet(object.lineCode) ? String(object.lineCode) : "",
      balance_s: isSet(object.balanceS) ? String(object.balanceS) : "",
      type: isSet(object.type) ? Number(object.type) : 0,
      platform: isSet(object.platform) ? Number(object.platform) : 0,
      mute: isSet(object.mute) ? Number(object.mute) : 0,
      create_time: isSet(object.createTime) ? String(object.createTime) : "",
      update_time: isSet(object.updateTime) ? String(object.updateTime) : "",
    };
  },

  toJSON(message: TPlayerInfo): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.agent_id !== undefined && (obj.agentId = Math.round(message.agent_id));
    message.balance !== undefined && (obj.balance = Math.round(message.balance));
    message.frozen !== undefined && (obj.frozen = Math.round(message.frozen));
    message.account !== undefined && (obj.account = message.account);
    message.nickname !== undefined && (obj.nickname = message.nickname);
    message.is_buy !== undefined && (obj.isBuy = message.is_buy);
    message.status !== undefined && (obj.status = tAccountStatusToJSON(message.status));
    message.target !== undefined && (obj.target = Math.round(message.target));
    message.complete !== undefined && (obj.complete = Math.round(message.complete));
    message.contr_rate !== undefined && (obj.contrRate = Math.round(message.contr_rate));
    message.special !== undefined && (obj.special = Math.round(message.special));
    message.agent_name !== undefined && (obj.agentName = message.agent_name);
    message.client_ip !== undefined && (obj.clientIp = message.client_ip);
    message.line_code !== undefined && (obj.lineCode = message.line_code);
    message.balance_s !== undefined && (obj.balanceS = message.balance_s);
    message.type !== undefined && (obj.type = Math.round(message.type));
    message.platform !== undefined && (obj.platform = Math.round(message.platform));
    message.mute !== undefined && (obj.mute = Math.round(message.mute));
    message.create_time !== undefined && (obj.createTime = message.create_time);
    message.update_time !== undefined && (obj.updateTime = message.update_time);
    return obj;
  },

  create<I extends Exact<DeepPartial<TPlayerInfo>, I>>(base?: I): TPlayerInfo {
    return TPlayerInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TPlayerInfo>, I>>(object: I): TPlayerInfo {
    const message = createBaseTPlayerInfo();
    message.id = object.id ?? "";
    message.agent_id = object.agent_id ?? 0;
    message.balance = object.balance ?? 0;
    message.frozen = object.frozen ?? 0;
    message.account = object.account ?? "";
    message.nickname = object.nickname ?? "";
    message.is_buy = object.is_buy ?? "";
    message.status = object.status ?? 0;
    message.target = object.target ?? 0;
    message.complete = object.complete ?? 0;
    message.contr_rate = object.contr_rate ?? 0;
    message.special = object.special ?? 0;
    message.agent_name = object.agent_name ?? "";
    message.client_ip = object.client_ip ?? "";
    message.line_code = object.line_code ?? "";
    message.balance_s = object.balance_s ?? "";
    message.type = object.type ?? 0;
    message.platform = object.platform ?? 0;
    message.mute = object.mute ?? 0;
    message.create_time = object.create_time ?? "";
    message.update_time = object.update_time ?? "";
    return message;
  },
};

function createBaseTGoldenCityGameInfo(): TGoldenCityGameInfo {
  return {
    id: "",
    player_id: 0,
    free_play_times: 0,
    last_time_bet: 0,
    last_bet_id: 0,
    betsize: 0,
    betmultiple: 0,
    orderid: 0,
    betid: 0,
    sceneodds: 0,
    havewin: 0,
    create_time: 0,
    update_time: 0,
  };
}

export const TGoldenCityGameInfo = {
  encode(message: TGoldenCityGameInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.player_id !== 0) {
      writer.uint32(16).int64(message.player_id);
    }
    if (message.free_play_times !== 0) {
      writer.uint32(24).int32(message.free_play_times);
    }
    if (message.last_time_bet !== 0) {
      writer.uint32(32).int64(message.last_time_bet);
    }
    if (message.last_bet_id !== 0) {
      writer.uint32(40).int64(message.last_bet_id);
    }
    if (message.betsize !== 0) {
      writer.uint32(48).int32(message.betsize);
    }
    if (message.betmultiple !== 0) {
      writer.uint32(56).int32(message.betmultiple);
    }
    if (message.orderid !== 0) {
      writer.uint32(64).int32(message.orderid);
    }
    if (message.betid !== 0) {
      writer.uint32(72).int32(message.betid);
    }
    if (message.sceneodds !== 0) {
      writer.uint32(80).int32(message.sceneodds);
    }
    if (message.havewin !== 0) {
      writer.uint32(88).int64(message.havewin);
    }
    if (message.create_time !== 0) {
      writer.uint32(792).int64(message.create_time);
    }
    if (message.update_time !== 0) {
      writer.uint32(800).int64(message.update_time);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TGoldenCityGameInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTGoldenCityGameInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.player_id = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.free_play_times = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.last_time_bet = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.last_bet_id = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.betsize = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.betmultiple = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.orderid = reader.int32();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.betid = reader.int32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.sceneodds = reader.int32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.havewin = longToNumber(reader.int64() as Long);
          continue;
        case 99:
          if (tag !== 792) {
            break;
          }

          message.create_time = longToNumber(reader.int64() as Long);
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }

          message.update_time = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TGoldenCityGameInfo {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      player_id: isSet(object.playerId) ? Number(object.playerId) : 0,
      free_play_times: isSet(object.freePlayTimes) ? Number(object.freePlayTimes) : 0,
      last_time_bet: isSet(object.lastTimeBet) ? Number(object.lastTimeBet) : 0,
      last_bet_id: isSet(object.lastBetId) ? Number(object.lastBetId) : 0,
      betsize: isSet(object.betsize) ? Number(object.betsize) : 0,
      betmultiple: isSet(object.betmultiple) ? Number(object.betmultiple) : 0,
      orderid: isSet(object.orderid) ? Number(object.orderid) : 0,
      betid: isSet(object.betid) ? Number(object.betid) : 0,
      sceneodds: isSet(object.sceneodds) ? Number(object.sceneodds) : 0,
      havewin: isSet(object.havewin) ? Number(object.havewin) : 0,
      create_time: isSet(object.createTime) ? Number(object.createTime) : 0,
      update_time: isSet(object.updateTime) ? Number(object.updateTime) : 0,
    };
  },

  toJSON(message: TGoldenCityGameInfo): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.player_id !== undefined && (obj.playerId = Math.round(message.player_id));
    message.free_play_times !== undefined && (obj.freePlayTimes = Math.round(message.free_play_times));
    message.last_time_bet !== undefined && (obj.lastTimeBet = Math.round(message.last_time_bet));
    message.last_bet_id !== undefined && (obj.lastBetId = Math.round(message.last_bet_id));
    message.betsize !== undefined && (obj.betsize = Math.round(message.betsize));
    message.betmultiple !== undefined && (obj.betmultiple = Math.round(message.betmultiple));
    message.orderid !== undefined && (obj.orderid = Math.round(message.orderid));
    message.betid !== undefined && (obj.betid = Math.round(message.betid));
    message.sceneodds !== undefined && (obj.sceneodds = Math.round(message.sceneodds));
    message.havewin !== undefined && (obj.havewin = Math.round(message.havewin));
    message.create_time !== undefined && (obj.createTime = Math.round(message.create_time));
    message.update_time !== undefined && (obj.updateTime = Math.round(message.update_time));
    return obj;
  },

  create<I extends Exact<DeepPartial<TGoldenCityGameInfo>, I>>(base?: I): TGoldenCityGameInfo {
    return TGoldenCityGameInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TGoldenCityGameInfo>, I>>(object: I): TGoldenCityGameInfo {
    const message = createBaseTGoldenCityGameInfo();
    message.id = object.id ?? "";
    message.player_id = object.player_id ?? 0;
    message.free_play_times = object.free_play_times ?? 0;
    message.last_time_bet = object.last_time_bet ?? 0;
    message.last_bet_id = object.last_bet_id ?? 0;
    message.betsize = object.betsize ?? 0;
    message.betmultiple = object.betmultiple ?? 0;
    message.orderid = object.orderid ?? 0;
    message.betid = object.betid ?? 0;
    message.sceneodds = object.sceneodds ?? 0;
    message.havewin = object.havewin ?? 0;
    message.create_time = object.create_time ?? 0;
    message.update_time = object.update_time ?? 0;
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
