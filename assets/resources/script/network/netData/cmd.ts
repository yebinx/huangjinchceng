

import { BaseCommand } from "./BaseCommand";
import { BYTE, DWORD, INT, LONGLONG, STRING, UINI64, WORD, create2DTypeArray, createTypeArray } from "./TypeDefine";
import { CmdLen } from "./cmdLen";

export enum MainCmd {
    MDM_KN_COMMAND = 0,
}

export enum RoomMainCmd {
    MDM_GF_GAME = 100,   // 游戏消息
    MDM_GF_FRAME = 101,   // 框架消息
}

export enum RoomSubCmd {
    SUB_C_START = 2,        // 开始游戏

    SUB_S_GAME_END = 102,    // 游戏结束(旋转结果)
    SUB_S_GAME_END_BEGIN = 108,
    SUB_S_GAME_END_END = 109,
    SUB_S_GAME_ERR = 103,    // 错误消息
    SUB_S_BASE_HIGHT = 109,    // 错误消息
}


export enum SceneSubCmd {
    //游戏配置
    SUB_GF_OPTION = 100,
    //场景信息
    SUB_GF_SCENE = 101,
    //游戏配置 小游戏登录 购买免费剩余次数或者断线重连也会下发
    SUB_GF_BUY_FREE_INFO = 102,
    //新增的线配置
    SUB_GF_SINGLEBET_INFO = 103,
    //用户聊天
    SUB_GF_USER_CHAT = 200,
}



export var KN_CMD = {
    MDM_KN_COMMAND: 0,  //内核命令
    SUB_KN_DETECT_SOCKET: 1,
    SUB_KN_XORKEY_REQ: 2,
    SUB_KN_CLIENT_DETECT: 4, //检测命令(客户端主动发的,服务器只回应)
    MDM_SOCKET_COMMAND: 66,
    SUB_SOCKET_TOKEN_REQ: 1,
    SUB_SOCKET_TOKEN_RES: 2,
    SUB_SOCKET_VERIFY_REQ: 3,
    SUB_SOCKET_VERIFY_RES: 4,
};

export var gameDaZhan = {
    LOGIN_KEY_LEN: 128,
    PASS_LEN: 33,
    MACHINE_LEN: 33,
    IPADDRESS_LEN: 48,
}

export var gameFramework = {
    INVALID_TABLE: 65535,
    INVALID_CHAIR: 65535,
}



export var KN_COMMAND = {
    CMD_TokenRes: function () {
        this.Token = new STRING(16);//token
    },
    CMD_MD5: function () {
        this.MD5 = new STRING(33);//token
    },
};

(function () {
    var keys = Object.keys(KN_COMMAND);
    for (var i = 0, len = keys.length; i < len; ++i) {
        if (typeof KN_COMMAND[keys[i]] === "function") {
            var cF = KN_COMMAND[keys[i]];
            cF.prototype = new BaseCommand();
            cF.prototype.constructor = cF;
            cF.prototype.size = (new cF()).size();
        }
    }
})();


export var loginCMD={
    //加密命令
    MDM_SOCKET_COMMAND: 66,
    SUB_SOCKET_TOKEN_REQ: 1,
    SUB_SOCKET_TOKEN_RES: 2,
    SUB_SOCKET_VERIFY_REQ: 3,
    SUB_SOCKET_VERIFY_RES: 4,
    SUB_SOCKET_DISCONNECT_TEST: 10,  //测试命令收到客户端的指令 服务器做断开处理

    MDM_PP_LOGON: 2,
    SUB_PP_LOGON_ERROR: 101,   //登陆失败
    SUB_PP_LOGON_PSPT_REQ: 102,   //通行证登陆请求
    SUB_PP_LOGON_PSPT_LOGON_RES: 103,   //通行证登陆成功
    SUB_PP_LOGON_PSPT_NEED_CFRM: 104,   //通行证需要安全验证
    SUB_PP_LOGON_SECURE_CONFRIM: 105,   //安全验证
    SUB_PP_LOGON_SECURE_CONFRIM_RES: 106,   //安全验证返回
    SUB_PP_LOGON_RELOG_REQ: 107,   //通行证重新登录(断线重连)
    SUB_PP_LOGON_PSPT_ISP_REQ: 108,   //通行证登陆请求，带线路信息
    SUB_PP_LOGON_RELOG_ISP_REQ: 109,   //通行证重新登录(断线重连)，带线路信息

    MDM_PP_REGISTER: 3,
    SUB_PP_REGISTER_CHECK_ACCOUNT_REQ: 101,						//验证帐号
    SUB_PP_REGISTER_CHECK_ACCOUNT_RSP_OK: 102,						//验证帐号成功
    SUB_PP_REGISTER_CHECK_ACCOUNT_RSP_ERROR: 103,						//验证帐号失败
    SUB_PP_REGISTER_REGISTER_ACCOUNT_REQ: 104,						//注册帐号
    SUB_PP_REGISTER_REGISTER_ACCOUNT_RSP_OK: 105,						//注册帐号成功
    SUB_PP_REGISTER_REGISTER_ACCOUNT_RSP_ERROR: 106,						//注册帐号失败

    PSPT_COMFIRM_TYPE: {
        PSPT_SEC_PHONE: 1,     // 手机安全认证
        PSPT_SEC_CARD: 2,     //  动态密保
        PSPT_SEC_PHONE_CARD: 3,     // 手机密令
        PSPT_SEC_QUESTION: 4,     // 安全问题
        PSPT_SEC_CERT: 5,     // 数字证书
        PSPT_SEC_PHONE_PSWD: 6      // 手机动态密码
    },
    CMD_PSPT_LoginOK:function () {
        this.dwUserID = new DWORD(0);     //用户ID 通行证登陆ID
        this.sSession = new STRING(33);  //会话ID 通行证授权码
        this.sAcIP = new STRING(16);     //大厅服务器地址
        //this.blank = new STRING(3);
        this.dwIPort = new DWORD(0);      //大厅服务器端口
    
        this.sOcws = new STRING(32);     //官网 100
        this.sDwon = new STRING(32);     //官网游戏下载 107
        this.sRech = new STRING(32);     //充值 108
        this.sNews = new STRING(32);     // 新闻
        this.sAdve = new STRING(32);     // 广告
        this.sVip = new STRING(32);      // VIP
        this.sBank = new STRING(32);     // 银行
    
        this.sBankList = new STRING(256);   //银行服务器列表
        this.sHallList = new STRING(256);   //大厅服务器列表
        this.dwServerTime = new DWORD();//服务器时间
    },
    CMD_PSPT_LoginError:function () {
        this.dwErrorCode = new DWORD(0);          // 错误代码
        this.nPswErrorTimes = new INT();
        this.nLeftTime = new INT();
        this.szErrorDescribe = new STRING(128);   // 错误信息
    }
};
(function () {
    var keys = Object.keys(loginCMD);
    for (var i = 0, len = keys.length; i < len; ++i) {
        if (typeof loginCMD[keys[i]] === "function") {
            var cF = loginCMD[keys[i]];
            cF.prototype = new BaseCommand();
            cF.prototype.constructor = cF;
            cF.prototype.size = (new cF()).size();
        }
    }
})();

//账号登录游戏 
export var roomCmd = {
   //游戏消息
   MDM_GF_GAME: 100,
   //框架消息
   MDM_GF_FRAME: 101,

   //游戏信息
   SUB_GF_INFO: 1,
   //用户同意
   SUB_GF_USER_READY: 2,
   //旁观控制
   SUB_GF_LOOKON_CONTROL: 3,
   //踢走用户
   SUB_GF_KICK_TABLE_USER: 4,

   //游戏结算显示
   //SUB_GF_GAME_RESULT  : 5,

   //游戏结算开始包
   SUB_GF_GAME_RESULT_START: 6,
   //游戏结算数据包
   SUB_GF_GAME_RESULT_INFO: 7,
   //游戏结算数据包根据ID来
   SUB_GF_GAME_RESULT_INFO_BYID: 8,
   //游戏结算结束包
   SUB_GF_GAME_RESULT_END: 9,
   //游戏换桌
   SUB_GF_USER_MOVE: 10,

   SUB_BUY_PROP_RET: 11,
   //PK 结束
   SUB_MATCH_RESULT: 700,
   //PK 连胜
   SUB_PK_CONTINUS: 701,


   //比倍
   SUB_TIGER_DICE_BET: 20,
   SUB_TIGER_DICE_BET_RES: 20,

   SUB_PROP_FREE_SPIN_RESULT: 22, //使用道具后游戏结算


   //游戏配置
   SUB_GF_OPTION: 100,
   //场景信息
   SUB_GF_SCENE: 101,
   //游戏配置 小游戏登录 购买免费剩余次数或者断线重连也会下发
   SUB_GF_BUY_FREE_INFO: 102,
   //新增的线配置
   SUB_GF_SINGLEBET_INFO: 103,
   //用户聊天
   SUB_GF_USER_CHAT: 200,

   //系统消息
   SUB_GF_MESSAGE: 300,

   //桌子解除锁定状态(非密码锁定,由桌子类调用)
   SUB_GF_TABLE_UN_HOLD: 400,
   //查询银行余额返回
   SUB_GF_QUERY_BANK_RET: 500,
   //存取款返回
   SUB_GF_TAKE_SAVE_MONEY: 600,
   //设置赠送礼物剩下的时间(秒)
   SUB_GF_SET_PRESENT_LEFT_TIME: 601,
   //得到礼物事件.
   SUB_GF_ON_PRSENT_GIF: 602,

   //房间登陆
   MDM_GR_LOGON: 1,

   //航户登录
   SUB_GR_LOGON_ACCOUNTS: 1,
   //ID 登录
   SUB_GR_LOGON_USERID: 2,
   SUB_GR_RELOGON_USERID: 3,//I D 重登录
   //登陆成功
   SUB_GR_LOGON_SUCCESS: 100,
   //登陆失败
   SUB_GR_LOGON_ERROR: 101,
   //登陆完成
   SUB_GR_LOGON_FINISH: 102,

   SUB_GR_RELOGON_SUCCESS: 103,          //重登陆成功
   SUB_GR_RELOGON_ERROR: 104,        //重登陆失败
   SUB_GR_RELOGON_FINISH: 105,          //重登陆完成

   //房间用户信息
   MDM_GR_USER: 2,

   //坐下请求
   SUB_GR_USER_SIT_REQ: 1,
   //旁观请求
   SUB_GR_USER_LOOKON_REQ: 2,
   //起立请求
   SUB_GR_USER_STANDUP_REQ: 3,
   //离开游戏
   SUB_GR_USER_LEFT_GAME_REQ: 4,
   //坐下等待加入游戏

   SUB_GR_USER_SIT_FOR_JOIN: 5,
   //交换椅子,由服务端发起
   SUB_GR_USER_EXCHANGE_CHAIR: 6,
   //查询游戏余额
   SUB_GR_USER_QUERY_BANK: 7,
   //存款款
   SUB_GR_USER_SAVE_GET_MONEY: 8,
   //设置用户关系(双向使用)
   SUB_GR_USER_SET_RELATION: 9,

   SUB_GR_USER_MATCH_REQ: 11,					//匹配请求

   //用户进入
   SUB_GR_USER_COME: 100,
   //用户状态
   SUB_GR_USER_STATUS: 101,
   //用户分数
   SUB_GR_USER_SCORE: 102,
   //坐下失败
   SUB_GR_SIT_FAILED: 103,
   //起立失败
   SUB_GR_STANDUP_FAILED: 104,
   //用户打宝相关信息
   SUB_GR_USER_PROP_DATA: 105,

   SUB_GR_USER_MATCH_OK: 106,      //匹配成功

   SUB_GR_USER_MATCH_START: 107, //开始匹配

   SUB_GR_USER_JACKPOT: 108, 	 //老虎机彩金中奖

   SUB_GR_USER_CHARGE_SCORE: 109,  //充值更新

   //聊天消息
   SUB_GR_USER_CHAT: 200,
   //私语消息
   SUB_GR_USER_WISPER: 201,
   //用户规则(用户登录时服务器往客户端发,用户设置的时候往后台发)
   SUB_GR_USER_RULE: 202,
   //表情消息
   SUB_GR_USER_EXPRESSION: 203,

   //邀请消息
   SUB_GR_USER_INVITE: 300,
   //邀请请求
   SUB_GR_USER_INVITE_REQ: 301,
   //呼叫用户
   SUB_GR_USER_CALL_REQ: 302,
   //呼叫用户
   SUB_GR_USER_CALL: 303,
   //查看客户端信息
   SUB_GR_USER_GET_CLIENTINFO: 304,
   //客户进程信息
   SUB_GR_USER_PROCESS_INFO: 305,
   //用户上传文件.
   SUB_GR_USER_TRANSFER_FILE: 306,
   //退出回调
   SUB_GR_QUIT_GAME: 307,
   //免费次数购买
   SUB_GR_BUY_FREE_RELL: 308,
   //PK 再次比赛      
   SUB_PK_REJOIN: 500,



   //房间配置信息
   //配置信息
   MDM_GR_INFO: 3,

   //房间配置
   SUB_GR_SERVER_INFO: 100,
   //等级配置
   SUB_GR_ORDER_INFO: 101,
   //会员配置
   SUB_GR_MEMBER_INFO: 102,
   //列表配置
   SUB_GR_COLUMN_INFO: 103,
   //自定义桌子的属性
   SUB_GR_TABLE_ATTRIBUTE: 104,
   //配置完成
   SUB_GR_CONFIG_FINISH: 105,




   //房间状态
   //状态信息
   MDM_GR_STATUS: 4,

   //桌子信息
   SUB_GR_TABLE_INFO: 100,
   //桌子状态
   SUB_GR_TABLE_STATUS: 101,

   //房间管
   //管理命令
   MDM_GR_MANAGER: 5,

   //道具相
   // 道具信息
   MDM_GR_PROPS: 6,

   //房间系统消
   // 系统信息
   MDM_GR_SYSTEM: 10,

   //系统消息
   SUB_GR_MESSAGE: 100,
   // 彩蛋消息
   SUB_GR_LUCKY_EGG: 101,

   SUB_GR_MESSAGE_CODE: 103,
   //SUB_GR_GROUND_NODE:103,//场节点信息

   //消息类型
   //信息消息
   SMT_INFO: 0x0001,
   //弹出消息
   SMT_EJECT: 0x0002,
   //全局消息
   SMT_GLOBAL: 0x0004,
   //关闭房间
   SMT_CLOSE_ROOM: 0x0008,
   //中断连接
   SMT_INTERMIT_LINE: 0x0010,
   //关闭客户端
   SMT_CLOSE_GAME: 0x0020,
   //举手状态超时
   SMT_TIMEOUT_READY: 0x0040,
   //弹出时自动关闭(30秒)
   SMT_EJECT_AUTO_CLOSE: 0x0080,
   //系统广播消息
   SMT_INFO_BROADCAST: 0x0100,
   //规则信息
   SMT_RULE_INFO: 0x0200,
   //坐下超时
   SMT_TIMEOUT_SIT: 0x0400,
   //彩蛋信息
   SMT_PRESENT_INFO: 0x0800,
   //发放彩蛋
   SMT_PRESNET_AWARD: 0x1000,

   SMT_INFO_ROOM_MSG: 0x2000,

   // 房间信息
   MDM_GR_SERVER_INFO: 11,

   SUB_GR_ONLINE_COUNT_INFO: 100,
   SUB_GR_ROUND20_WIN_RANK: 101,

   //游戏等级
   MDM_GP_GAME_LEVEL: 12,

   //发送开始
   SUB_GP_GAME_LEVEL_SENDSTART: 100,
   //发送游戏积分等级
   SUB_GP_GAME_LEVEL_SCORE: 101,
   //发送游戏金币等级
   SUB_GP_GAME_LEVEL_GOLD: 102,
   //发送完成
   SUB_GP_GAME_LEVEL_SENDEND: 103,

   //比赛信息
   MDM_GR_MATCH_INFO: 13,

   // 任务信息
   MDM_GR_TASK_INFO: 14,

   // http信息
   SUB_GR_HTTP_URL_REQ: 5,
   MDM_GR_PATH_INFO: 16,
   SUB_GR_HTTP_URL_RES: 105,


   SBWCT_CHAC_RANK_UP_AWARD: 34,          //升级奖励
   SBWCT_PIGGY_BANK_CHARGE: 35,            //储蓄罐充值+
   SBWCT_SUPER_DEAL_CHARGE: 36,            //特惠充值+
   SBWCT_SHOP_CHARGE: 37,                //商城充值+
   SBWCT_ACTIVITY_AWARD: 38,          //运营活动奖励
   SBWCT_USER_LEVEL_GIFT_AWARD: 39,      //玩家等级礼包
   SBWCT_USER_SUPRISE_GIFT_AWARD: 40,      //玩家惊喜礼包

   SBWCT_RECHARGE: 1000, //充值合并类型

    CMD_GR_LogonByTPAccount: function () {
        //广场版本
        this.dwPlazaVersion = new DWORD();
        //进程版本
        this.dwProcessVersion = new DWORD();
        //游戏等级积分版本
        this.wGLVerScore = new WORD();
        //游戏财富版本
        this.wGLVerGold = new WORD();
        //登录账号
        this.szTPAccount = new STRING(gameDaZhan.LOGIN_KEY_LEN);
        //登录密码
        this.szPassWord = new STRING(gameDaZhan.PASS_LEN)
        //设置唯一标识码
        this.szDeviceId = new STRING(gameDaZhan.PASS_LEN)
        //游戏类型
        this.gmtype = new WORD();
        //登录类型
        this.lgtype = new WORD();
        //登录节拍 当前的GetTickCount值,或者随机自增的整型值
        this.clock = new DWORD();
        //线路ID
        this.iISPID = new WORD();
        //运营商的独有代码
        this.iOperatoerID = new DWORD();
        //会话ID
        this.ulSessionID = new UINI64();
        //机器码
        this.szMac = new STRING(gameDaZhan.MACHINE_LEN)
        //ip地址-支持IPv6
        this.szIps = new STRING(gameDaZhan.IPADDRESS_LEN)
    },
    CMD_GR_LogonByTPAccountResp:function(){
        this.userId = new DWORD();
    },

    //房间配置
    CMD_GR_ServerInfoV2:function(){
       this.wKindID = new WORD()			//类型 I D
       this.wGameGenre = new WORD()	//游戏类型
        this.wTableCount = new WORD()		//桌子数目
        this.wChairCount = new WORD();		//椅子数目
        this.cbCanJoinWhenPlaying=new BYTE();	//是否可以在游戏开始时加入.
        this.cbAutoRun=new BYTE();			//是否自动运行客户端
        this.m_isFZBRoom=new BYTE();		//是否防作弊房间 0 =no, 1=yes
        this.iLuckyEggTaxRate=new INT();	//彩蛋税率，万分之
        this.wTableId = new WORD();//房间背景ID
        this.wChairId = new WORD();//椅子图片ID
        this.wTableLockedBkId = new WORD();//桌子锁住背景资源ID(保留,暂时没有)
        this.wTableGestureId = new WORD();//准备好后玩家手势ID
        this.wRunButtonId = new WORD();//启动游戏按纽ID
        this.wTableDataID = new WORD();//桌子数据文件ID
        this.szPromptMsg=new STRING(CmdLen.MAX_PROMPT_LEN);		//提示消息.
        this.iBigTableRoom = new INT();//百人游戏桌子，没有桌子
        this.wGameSign = new WORD();			//游戏签到标记1能签到0不能.
        this.tagCaiBetLevel = new roomCmd.tagCaiBetLevel();
    },
    tagCaiBetLevel:function () {
        /** 倍率 */
        this.nBet = new INT();
        /** 等级 */
        this.nChacLevel = new INT();
    },
    CMD_GR_UserSitReqNoPass: function () {
        //桌子位置
        this.wTableID = new WORD();
        //椅子位置
        this.wChairID = new WORD();
        //网络延时
        this.wNetTimelag = new WORD();
        //密码长度
        this.bPassLen = new BYTE();
    },

    CMD_GF_Info: function () {
        //旁观标志
        this.bAllowLookon = new BYTE();
        this.nTotalBet = new LONGLONG();//初始总下注
    },
    CMD_GP_JackPot: function () {
        this.nUserId = new INT();
    },
    tagUserInfoHead:function(){
        //头像索引
        this.wFaceID = new WORD();
        //坐下服饰索引
        this.wClothesID = new WORD();
        //饰品索引
        this.wAdornmentID = [];
        for (var i = 0; i < 5; ++i) {
            this.wAdornmentID[i] = new WORD();
        }
        //用户性别 0 woman 1 man
        this.bGender = new BYTE();
        //会员等级
        this.bMember = new BYTE();

        //用户ID
        this.dwUserID = new DWORD();
        //用户ID
        this.dwLogInID = new DWORD();
        //社团索引
        this.dwGroupID = new DWORD();
        //用户权限
        this.dwUserRight = new DWORD();
        //管理员权限
        this.dwMasterRight = new DWORD();
        //运势数值
        this.bLucky = new BYTE();
        //填充
        //this.blank_1       = new STRING(3);

        //基础体力值
        this.wBaseStrength = new WORD();
        //累计体力值
        this.wAccStrength = new WORD();

        //当天加成的体力值
        this.dwAddStrength = new DWORD();
        //当天最大体力值
        this.dwMaxStrength = new DWORD();

        //桌子ID
        this.wTableID = new WORD();
        //椅子ID
        this.wChairID = new WORD();

        //网络延时
        this.wNetDelay = new WORD();
        //用户状态
        this.bUserStatus = new BYTE();
        //this.blank_2       = new STRING(5);

        //用户排名
        this.wMatchRateOrginal = new WORD();          //用户初始排名

        //用户积分信息
        this.userScoreInfo = new roomCmd.UserScore();
        //系统权限
        this.dwSystemRight = new DWORD();
        //名字颜色
        this.iNameColour = new DWORD();
        //crazy最大下注值
        this.nCrazyMaxBet = new INT();

        this.nPropTriggerFrees = new INT(); //道具触发的免费游戏次数(正常轮盘)
        this.lCouponProcess = new LONGLONG(); //礼券进度条
    },
    UserScore:function () {
        //用户银子数
        this.lGold = new LONGLONG();
        this.dwScore = new LONGLONG();
        this.lGoldTotal = new LONGLONG();
        //赢的数目
        this.lWinCount = new DWORD();
        //输掉数目
        this.lLostCount = new DWORD();
        //平局数目
        this.lDrawCount = new DWORD();
        //断线数目
        this.lFleeCount = new DWORD();
        //用户经验
        this.lExperience = new LONGLONG();
        //游戏次数
        this.lPlayTime = new DWORD();
        //连赢次数
        this.lxWinCount = new DWORD();
    },
    /** 请求坐下 */
    CMD_GR_UserSitReq:function () {
        //桌子位置
        this.wTableID = new WORD();
        //椅子位置
        this.wChairID = new WORD();
        //网络延时
        this.wNetTimelag = new WORD();
        //密码长度
        this.bPassLen = new BYTE();
        //桌子密码
        this.szTablePass = new STRING(gameDaZhan.PASS_LEN);
    },
    /** 桌子状态信息 */
    CMD_GR_TableStatus:function () {
        //桌子号码
        this.wTableID = new WORD();
        //游戏状态
        this.bTableStatus = new BYTE();

        //this.blank1 = new STRING(1);

        //玩家数
        this.wUserCount = new WORD();
        //密码锁定状态
        this.bTableLock = new BYTE();
        //游戏锁定状态
        this.bTableHold = new BYTE();
        //桌主ID,如果是锁桌,则是锁定那人ID
        this.dwTableMasterID = new DWORD();
    },
    CMD_S_HandleError:function () {
        this.nResult = new INT();
    },
    CMD_GF_Option:function () {
        //金币比率
        this.nTigerExchangeRatio = new INT(1);
        //游戏状态
        this.bGameStatus = new BYTE();
        //允许旁观
        this.bAllowLookon = new BYTE();
    },
    CMD_GF_BuyFreeInfo:function () {
        this.nPropFrees = new INT();
        this.nPropBaseBet = new INT();
        this.nAllowBuyFreeProp = new INT()
        this.nBuyPropMaxMultiply = new INT()
    },
    CMD_GF_SingleBetInfo:function () {
        this.sSingleBetInfo = createTypeArray(150, INT);
    }
};


(function () {
    var keys = Object.keys(roomCmd);
    for (var i = 0, len = keys.length; i < len; ++i) {
        if (typeof roomCmd[keys[i]] === "function") {
            var cF = roomCmd[keys[i]];
            cF.prototype = new BaseCommand();
            cF.prototype.constructor = cF;
            cF.prototype.size = (new cF()).size();
        }
    }
})();

export var mssCmd = {
    SUB_C_START: 2,

    COL: 6, //5列
    ROW: 6, //每列4个图标

    //服务端下来数据
    AREA_LINE: 6,
    AREA_ROW: 6,

    NAME_LEN: 32,

    //线数
    nCurXianShu: 30,
    eComTypeMax:14,
    NodeInfo: function () {
        this.nIconType = new INT();
        this.lAwardGold = new LONGLONG();
        this.nLen = new INT();
        // this.nIconAwardPos = createTypeArray(mssCmd.AREA_ROW, INT);
        this.nIconAwardPos = createTypeArray(15, INT);
    },
    NodeTypeInfo:function(){
        this.iType = new BYTE(0); //图标类型
        this.isGold = new BYTE(0); //百搭数量
        this.nMaxColCount = new BYTE(0);//图标占最大列数
        this.nRow = new BYTE(0);//行
        this.nCol = new BYTE(0);//列
        this.isRemove = new BYTE(0); //1 表示删除 4 表示投掷变成金百搭 3 变成金百搭 3 变成百搭
        this.isAdd = new BYTE(0); //是否是新加图标
        this.nLockCount = new BYTE(0); 
    },
    CMD_C_GAME_START: function () {
        ////每注值
        this.nBet = new DWORD();
    },
    CMD_S_GameEnd:function(){
        this.lAwardGold=new LONGLONG(); //当前赢分
        this.llUserTotalScore=new LONGLONG(); //用户分
        this.nAwardMultply = new INT()  //赢的倍率
        this.nSuperRoll = new BYTE(0);				//超级转圈圈
        this.nFreeCount = new INT();				//当前剩余几次免费
        this.nTotalFreeCount = new INT();		//总共多少次免费
        this.nCurRoundFreeCount = new INT();		//本轮触发几次免费
        this.nBaseReelIndex = new BYTE(0);//base Reel使用 <Base Reel Set 1>  和 <Base Reel Set 2>
        this.nRollType = new INT();
        this.nRollPos = createTypeArray(mssCmd.COL, BYTE);
        this.nIconAreaDistri= create2DTypeArray(mssCmd.ROW,mssCmd.COL, mssCmd.NodeTypeInfo);//本轮图标
        this.nIconAwardPos=create2DTypeArray(mssCmd.ROW,mssCmd.COL, BYTE);//中奖位置
        this.nReplaceWildCol =  createTypeArray(mssCmd.COL, BYTE);//哪些列用wild滚轮列替代,值1表示替换
        this.nMaxRowCount= createTypeArray(mssCmd.COL, BYTE);//列的最大行数 可变行2~7
        this.nRemoveIcon= create2DTypeArray(mssCmd.ROW,mssCmd.COL, mssCmd.NodeTypeInfo);//消除图标
        this.nIconAfterRemove= create2DTypeArray(mssCmd.ROW,mssCmd.COL, mssCmd.NodeTypeInfo);//消除图标后的本轮图标
        this.nIconAfterFill= create2DTypeArray(mssCmd.ROW,mssCmd.COL, mssCmd.NodeTypeInfo);//填充图标后的下一轮图标
        this.nAvalanche = new INT();//图案山崩次数(计算含初始掉下)
        this.nMultiple = new INT();//倍数
        this.bEarthquake = new BYTE(0);//地震
        this.nAwardWays = new INT();//多少路中奖
        this.bRoll= new BYTE(0);//是否旋转
        this.bEndNormalDrop = new BYTE(0);//结束下落新图标
        this.lNormalTotalAwardGold=new LONGLONG();//一次押注总共获得金币
        this.bCostGold = new BYTE(0);//是否扣押注
        this.nSpecialFreeCol = createTypeArray(mssCmd.COL, BYTE);//某列为1表示 特殊免费滚轮动画
        this.uCurScene = new BYTE(0); //当前场景  已经转
        this.uNextScene = new BYTE(0); //下一个场景 下注下一次是否收费 0 是收费 
        this.nMaxIconCount=create2DTypeArray(mssCmd.ROW,mssCmd.COL, BYTE);//图标占最大列数
        this.nIsGoldIcon = create2DTypeArray(mssCmd.ROW,mssCmd.COL, BYTE);//是否是黄金图标
        this.nOutColIconCount=create2DTypeArray(14,mssCmd.COL, BYTE);//该图标在某列中奖数量
        this.isBuyFree = new BYTE(0); //是否是购买的免费
        this.nFreeTotalAwardGold=new LONGLONG(); //免费中奖分
        this.isBase_Hight = new BYTE(0); //是否加倍
        this.isStudy = new BYTE(0);//是否是体验模式
    },
    CMD_S_GameStatus: function () {
        this.nCurBaseScore = new INT(); //当前筹码==单线额度*30
        this.uCurScene = new INT();   //当前场景  
        this.uNextScene = new INT();   //下一个场景   //0 TGS_NORMAL  TGS_FREE  1
        this.nFreeCount = new INT();   //当前剩余几次免费
        this.lFreeTotalAwardGold = new LONGLONG();
        this.nRollType = new INT();
        this.nRollPos = createTypeArray(mssCmd.COL, BYTE);
        this.nIconAreaDistri = create2DTypeArray(mssCmd.ROW, mssCmd.COL, BYTE);    //本轮图标
        this.nMaxRowCount= createTypeArray(mssCmd.COL, BYTE);//列的最大行数 可变行2~7
        this.nIconAfterRemove= create2DTypeArray(mssCmd.ROW,mssCmd.COL, mssCmd.NodeTypeInfo);//消除图标后的本轮图标
        this.nIconAfterFill= create2DTypeArray(mssCmd.ROW,mssCmd.COL, mssCmd.NodeTypeInfo);//填充图标后的下一轮图标
        this.nAvalanche = new INT();//图案山崩次数(计算含初始掉下)
        this.nAwardMultply = new INT(); //当前轮倍数
        this.bEarthquake = new BYTE(0);//地震
        this.lNormalTotalAwardGold = new LONGLONG();   //一次押注总共获得金币
        this.nMaxIconCount = create2DTypeArray(mssCmd.ROW, mssCmd.COL, BYTE);    //图标占最大列数
        this.nIsGoldIcon = create2DTypeArray(mssCmd.ROW, mssCmd.COL, BYTE); //是否是黄金图标
        this.nOutColIconCount=create2DTypeArray(14,mssCmd.COL, BYTE);//该图标在某列中奖数量
        this.isBuyFree = new BYTE();
        this.isBase_Hight = new BYTE();
        this.isStudy = new BYTE();
        this.iPrice = new INT();
    },
    CMD_S_StatusFree:function(){
        // 游戏状态
        this.nCurBaseScore = new INT(0);
        this.nCurGameScene = new INT(0)
        this.nFreeCount = new INT(0)  //免费次数
        this.nTotalFreeCount = new INT(0)  //免费次数
        this.lFreeTotalAward = new LONGLONG()
    },
    Cmd_S_Base_Hight:function(){
        this.bBase_Hight=new BYTE(0);
        this.bResult=new BYTE(0);
    }

};

(function () {
    var keys = Object.keys(mssCmd);
    for (var i = 0, len = keys.length; i < len; ++i) {
        if (typeof mssCmd[keys[i]] === "function") {
            var cF = mssCmd[keys[i]];
            cF.prototype = new BaseCommand();
            cF.prototype.constructor = cF;
            cF.prototype.size = (new cF()).size();
        }
    }
})();