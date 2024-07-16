// 长度定义
var gameDaZhan = gameDaZhan || {};

gameDaZhan.COIN_RATE = 1000;
gameDaZhan.DEFAULT_COIN_RATE = 1000;
gameDaZhan.COIN_POINT_COUNT = 0;
gameDaZhan.NAME_LEN = 32;
gameDaZhan.PASS_LEN = 33;
gameDaZhan.ORDERID = 64;
gameDaZhan.LOGIN_KEY_LEN = 128;
gameDaZhan.MACHINE_LEN = 33
gameDaZhan.IPADDRESS_LEN = 48
//房间提示消息
gameDaZhan.MAX_PROMPT_LEN = 512;
//金币如果不足提示信息
gameDaZhan.B_TIP_MONEY = true;
gameDaZhan.TIP_MONEY = 50;

gameDaZhan.AUTH_LEN = 33;
gameDaZhan.PHONE_LEN = 12;
gameDaZhan.USER_NAME_LEN = 16;
gameDaZhan.COMMENT_LEN = 256;
gameDaZhan.ERROR_INFO_LEN = 128;
gameDaZhan.URL_LEN = 128;
gameDaZhan.KIND_LEN = 32;
gameDaZhan.DEAL_INFO_LEN = 128;
gameDaZhan.IOSBANDMONEY = 20 * gameDaZhan.COIN_RATE

gameDaZhan.TAX = 0.05

gameDaZhan.MAN = 0;
gameDaZhan.FEMALE = 1;

gameDaZhan.ISCHARGESHOW = false;


gameDaZhan.PAUSE = false;

//默认信息
//无效数据
gameDaZhan.DTP_NULL = 0;

//基础信息
//用户 I D
gameDaZhan.DTP_USER_ID = 1;
//用户帐号
gameDaZhan.DTP_USER_ACCOUNTS = 2;
//用户密码
gameDaZhan.DTP_USER_PASS = 3;
//用户性别
gameDaZhan.DTP_USER_GENDER = 4;
//用户头像
gameDaZhan.DTP_USER_FACE = 5;
//用户权限
gameDaZhan.DTP_USER_RIGHT = 6;
//管理权限
gameDaZhan.DTP_MASTER_RIGHT = 7;

//状态信息
//用户状态
gameDaZhan.DTP_USER_STATUS = 100;
//游戏桌号
gameDaZhan.DTP_USER_TABLE = 101;
//椅子号码
gameDaZhan.DTP_USER_CHAIR = 102;
//网络延时
gameDaZhan.DTP_USER_PING = 103;
//用户索引
gameDaZhan.DTP_USER_INDEX = 104;
//循环计数
gameDaZhan.DTP_USER_ROUND = 105;
//VIP状态
gameDaZhan.DTP_USER_VIPSTATUS = 106;
//积分信息
//胜局盘数
gameDaZhan.DTP_USER_WIN = 200;
//输局盘数
gameDaZhan.DTP_USER_LOST = 201;
//和局盘数
gameDaZhan.DTP_USER_DRAW = 202;
//逃局盘数
gameDaZhan.DTP_USER_FLEE = 203;
//用户胜率
gameDaZhan.DTP_WIN_RATE = 204;
//用户输率
gameDaZhan.DTP_LOST_RATE = 205;
//用户和率
gameDaZhan.DTP_DRAW_RATE = 206;
//用户逃率
gameDaZhan.DTP_FLEE_RATE = 207;
//用户税收
gameDaZhan.DTP_USER_TAX = 208;
//用户金币
gameDaZhan.DTP_USER_GOLD = 209;
//用户分数
gameDaZhan.DTP_USER_SCORE = 210;
//总局盘数
gameDaZhan.DTP_USER_PLAY_COUNT = 211;
//用户经验
gameDaZhan.DTP_USER_EXPERIENCE = 212;
//游戏等级
gameDaZhan.DTP_GAME_LEVEL = 213;
//社区等级
gameDaZhan.DTP_COMMUNITY_LEVEL = 214;

//扩展信息
//社团 I D
gameDaZhan.DTP_USER_GROUP_ID = 300;
//用户备注
gameDaZhan.DTP_USER_NOTE = 302;
//用户描述
gameDaZhan.DTP_USER_DESCRIBE = 303;
//用户关系
gameDaZhan.DTP_USER_COMPANION = 304;

//用户战况
//积分输赢
gameDaZhan.DTP_USER_SCORE_GAIN = 305;
//金币输赢
gameDaZhan.DTP_USER_GOLD_GAIN = 306;
//用户总金币,原来的金币用来显示桌子最大限额
//用户总金币(房间显示) Added by zhaofeng on 2009-10-22
gameDaZhan.DTP_USER_GOLD_TOTAL = 307;
//用户签名
gameDaZhan.DTP_USER_SIGNATURE = 308;
//用户排名
gameDaZhan.DTP_USER_RANK = 309;
//用户禁止时间
gameDaZhan.DTP_USER_BANTIME = 310;
//用户比赛id
gameDaZhan.DTP_USER_MATCHID = 311;

gameDaZhan.DTP_USER_IPAREA = 312;
//系统信息
//机器序列
gameDaZhan.DTP_COMPUTER_ID = 1000;
//站点页面
gameDaZhan.DTP_STATION_PAGE = 1001;
//配置信息
gameDaZhan.DTP_OPTION_BUFFER = 1002;

var gameFramework = gameFramework || {};
//当前金币比例
gameFramework.COIN_RATE = 1;
//桌子状态
gameFramework.INVALID_TABLE = 65535; // (WORD)-1
//椅子状态
gameFramework.INVALID_CHAIR = 65535; // (WORD)-1

//游戏状态
gameFramework.GS_FREE    = 0;
gameFramework.GS_PLAYING = 100;
gameFramework.GS_WAITING = 200;

//用户状态
//没有状态
gameFramework.US_NULL    = 0x00;
//站立状态
gameFramework.US_FREE    = 0x01;
//坐下状态
gameFramework.US_SIT     = 0x02;
//同意状态
gameFramework.US_READY   = 0x03;
//旁观状态
gameFramework.US_LOOKON  = 0x04;
//游戏状态
gameFramework.US_PLAY    = 0x05;
//断线状态
gameFramework.US_OFFLINE = 0x06;
//等待加入
gameFramework.US_FORJOIN = 0x07;
//在等待列表中
gameFramework.US_FORPLAY = 0x08;

//桌子状态
gameFramework.TABLE_STATUS_WAITING = 0;  //未开始
gameFramework.TABLE_STATUS_PLAYING = 1;  //游戏中
gameFramework.TABLE_STATUS_BROKEN  = 2; //断线
gameFramework.TABLE_STATUS_DISMISS = 3;  //解散（防作弊专用）

//斗地主
gameFramework.Positive = 1;
gameFramework.Negative = 2;
gameFramework.MAN   = 0 ;    
gameFramework.WOMaN = 1 ; 

gameFramework.CT_INVALID = 0;	//错误类型
gameFramework.CT_SINGLE = 1;	//单牌类型
gameFramework.CT_DOUBLE = 2;	//对牌类型
gameFramework.CT_THREE = 3;	//三条类型
gameFramework.CT_ONE_LINE = 4;	//单连类型
gameFramework.CT_DOUBLE_LINE = 5;	//对连类型
gameFramework.CT_THREE_LINE = 6;	//三连类型
gameFramework.CT_THREE_TAKE_ONE = 7;	//三带1单或1对
gameFramework.CT_FOUR_TAKE_DOUBLE = 8;	//四带两单或两对
gameFramework.CT_THREE_LINE_TAKE_CARD = 9;	//三连带牌
gameFramework.CT_BOMB_CARD = 10;	//炸弹类型
gameFramework.CT_MISSILE_CARD = 11;	//火箭类型
//比较结果
gameFramework.CT_COMPARE_ERROR = 20;	//错误类型
gameFramework.CT_COMPARE_SMALL = 22;	//小于类型
gameFramework.CT_COMPARE_EQUAL = 23;	//相等类型
gameFramework.CT_COMPARE_BIG = 24;	//大于类型

export var CmdLen = gameDaZhan;

export var CmdFramework = gameFramework;