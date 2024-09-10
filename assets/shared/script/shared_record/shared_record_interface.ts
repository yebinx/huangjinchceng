// export interface SharedRecordInfo{
//     /** 创建时间-时间戳-毫秒 */
//     create_timestamp: number;
//     /** 交易单号 */
//     round_no: string;
//     /** 下注的额度 */
//     bet: number;
//     /** 盈利 */
//     win: number;
//     /** int32    round               = 6; // 消除几轮  放到下面去了, normal_round_times */
//     free_times: number;
//     /** 普通游戏 */
//     normal_round_times: number;
//     /** 普通游戏 */
//     free_round_times: number;
// }

// 0总是正常旋转，>= 1是免费旋转
export const NORMAL_SPIN_INDEX = 0;

// 游戏记录
export interface IGameRecord{
    /**
     * 获取记录简介 目录总条数
     */
    getRecordProfileTotalLenght(): number;
    /**
     * 获取记录简介当前条数，当前已经请求的目录条数
     */
    getRecordProfileLenght():number; // 
    /**
     * 获取数据记录，目录也，每条目录数据
     * @param index 
     */
    getRecordProfileData(index: number):IRecordProfile; 
    /**
     * 记录简介总计，目录页，底部的数据
     */
    getRecordProfileSummary():IRecordProfileSummary; // 


    /**
     * 获取记录详情，全部总的回合，消除和没消除都算
     * @param orderId 
     */
    getRecordDetailRoundTotalCount(orderId: string): number;
    /**
     * 
     * @param orderId 订单id
     * @param spinIndex 0总是正常旋转，>= 1是免费旋转
     */
    getRecordDetailCreateTime(orderId: string, spinIndex: number): number; 
    /**
     * 获取免费次数
     * @param orderId 
     */
    getRecordDetaiFreeTimes(orderId: string):number;
    /**
     * 获取总共旋转几次
     */
    getRecordDetailSpinTotalCount(orderId: string):number;
    /**
     * 记录详情
     * @param orderId 
     * @param index  消除和没消除都算1个
     */
    getRecordDetailData(orderId: string, index: number):IRecordDetail;
    /**
     * 获取记录偏移几条
     * @param spinIndex 第几次旋转
     */
    getRecordDetailSpinOffsetCount(orderId: string, spinIndex: number); 

    /**
     * 根据偏移位置找到 第几次旋转,旋转次数从0开始
     * @param offsetIdx 
     */
    getRecordDetailSpinIndex(orderId: string, offsetIdx: number):number; 
    /**
     * 获取旋转总赢
     */
    getRecoredDetailSpinWin(orderId: string, spinIndex: number): number;
}

// 记录简介总计
export interface IRecordProfileSummary{
    profileTotalLenght: number; // 总条数
    betTotal: number; // 总投注
    winTotal: number; // 总输赢
}

// 记录简介
export interface IRecordProfile{ 
    createTime: number; //记录创建时间
    orderId: string; // 订单id
    bet: number; // 投注
    win: number; // 盈利
    freeTimes: number; // 免费游戏次数
    removeNormalRound: number; // 总正常游戏总消除次数
    removeFreeRound: number; // 免费游戏总消除次数
}

// 记录详情
export interface IRecordDetail {
    createTime: number | null; //记录创建时间
    roundId: string| null; // 每回合的id
    bet: number| null; // 投注
    win: number| null; // 盈利
    balance: number| null; // 余额
    round: number| null; // 第几回合
    betSize: number| null; // 投注大小
    betMultiple: number| null; // 投注倍数
    rewardMultiple: number| null; // 奖金倍数
    lineInfoList: IRocordLineInfo[]| null; // 中奖线路信息
    result?:any; // 结算数据
    otherArgs?:any; // 其他参数
}

// 中奖线信息
export interface IRocordLineInfo{
    symbolId: number; // 符号id
    rewardLine: number; // 中奖线,夺宝个数
    win: number; // 1倍赢分
    winTotal: number; // n倍赢分
    rewardMultiple: number; // 奖金倍数
    winLine: number; // n星连珠
    betSize: number; // 投注大小
    betMultiple: number; // 投注倍数
    rate: number; // 符号赔付值，或夺宝次数
    isScatter: boolean; // 是否是夺宝
}
