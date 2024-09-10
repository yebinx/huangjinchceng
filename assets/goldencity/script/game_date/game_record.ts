import { IRecordDetail, IRecordProfile, IRecordProfileSummary, IRocordLineInfo, NORMAL_SPIN_INDEX } from "../../../shared/script/shared_record/shared_record_interface";
import { IconDefine, TGoldenCityCardList, TResult } from "../../proto/base";
import { TProtoGoldenCityBetType } from "../../proto/v1.goldencity.bet";
import { TGoldenCityRecordRsp } from "../../proto/v1.goldencity.record";
import { TGoldenCityRecordDetailRsp } from "../../proto/v1.goldencity.record.detail";
import { ConfigMethod } from "../config/config_method";
import { COLUMN_COUNT, SCATTER_BONUS_FREE_TIMES, SCATTER_BONUS_FREE_TIMES_EXTRA, SCATTER_BONUS_NEED } from "../config/game_config";

// 游戏记录
export class GameRecord{
    private recordList: TGoldenCityRecordRsp = null;
    private recordDetailMap = new Map<string, TGoldenCityRecordDetailRsp>();   

    getRecordList(){return this.recordList.record;}
    setRecordListRsp(rsp:TGoldenCityRecordRsp){
        this.recordList = rsp;
    }

    addRecordListRsp(rsp:TGoldenCityRecordRsp){
        this.recordList.record = this.recordList.record.concat(rsp.record);
    }

    addRecordDetail(orderId: string, rsp:TGoldenCityRecordDetailRsp){
        this.recordDetailMap.set(orderId, rsp)
    }

    getRecordDetail(orderId: string){
        return this.recordDetailMap.get(orderId)
    }

    // override IGameRecord
    // 获取记录简介总条数
    getRecordProfileTotalLenght(): number{
        return this.recordList.totalcount;
    }

    // 获取记录
    getRecordProfileLenght():number { 
        if (!this.recordList){
            return 0
        }
        return this.recordList.record.length;
    }

     // 获取数据记录，简况
    getRecordProfileData(index: number): IRecordProfile{
        let data = this.recordList.record[index];
        return {
            createTime: data.createtime, //记录创建时间
            orderId: data.orderid, // 订单id
            bet: data.bet, // 投注
            win: data.wintotal, // 盈利
            freeTimes: data.freetimes, // 免费游戏次数
            removeNormalRound: data.normalremovecount, // 总正常游戏总消除次数
            removeFreeRound: data.freeremovecount, // 免费游戏总消除次数
        }
    }

    // 记录简介总计
    getRecordProfileSummary():IRecordProfileSummary{
        return {
            profileTotalLenght: this.recordList.totalcount, 
            betTotal: this.recordList.totalbet, 
            winTotal: this.recordList.totalprofit,
        }
    }
   
     // 获取记录详情，全部总的回合，消除和没消除都算
     getRecordDetailRoundTotalCount(orderId: string): number{
        let data = this.recordDetailMap.get(orderId);
        if (!data){
            return 0;
        }

        let total = data.normalresult.length;
        if (!data.freeresult){
            return total;
        }

        data.freeresult.forEach(element => {
            total += element.freearray.length
        });

        return total;
     }
     /**
      * 
      * @param orderId 订单id
      * @param spinIndex 0总是正常旋转，>= 1是免费旋转
      */
     getRecordDetailCreateTime(orderId: string, spinIndex: number): number{
        let data = this.recordDetailMap.get(orderId);
        if (!data){
            return 0;
        }

        if (spinIndex == 0){
            return data.normalresult[0].createtime
        }

        return data.freeresult[spinIndex-1].freearray[0].createtime;
     }
     /**
      * 获取免费次数
      * @param orderId 
      */
     getRecordDetaiFreeTimes(orderId: string):number{
        let data = this.recordDetailMap.get(orderId);
        if (!data){
            return 0;
        }

        return data.freetimes;
     }
     /**
      * 获取总共旋转几次
      */
     getRecordDetailSpinTotalCount(orderId: string):number{
        let data = this.recordDetailMap.get(orderId);
        if (!data){
            return 0;
        }

        return data.freetimes + 1;
     }
     /**
      * 记录详情
      * @param orderId 
      * @param index  消除和没消除都算1个
      */
     getRecordDetailData(orderId: string, index: number):IRecordDetail{
        let data = this.recordDetailMap.get(orderId);
        if (!data){
            return null;
        }
        
        let recordDetail:IRecordDetail = {
            createTime: 0, //记录创建时间
            roundId: null, // 每回合的id
            bet: 0, // 投注
            win: 0, // 盈利
            balance: 0, // 余额
            round: 0, // 第几回合
            betSize: data.betsize, // 投注大小
            betMultiple: data.betmultiple, // 投注倍数
            rewardMultiple: 0, // 奖金倍数
            lineInfoList: [] as IRocordLineInfo[], // 中奖线路信息
            otherArgs: TProtoGoldenCityBetType.NORMAL,
        } 

        let result:TResult;
        if (data.normalresult.length > index){
            result = data.normalresult[index];
            recordDetail.round = index + 1;
            if (index == 0){
                recordDetail.bet = data.bet;
            }
        }else{
            index -= data.normalresult.length;
            for (let i=0, len=data.freeresult.length; i<len; i++){
                if (data.freeresult[i].freearray.length <= index){
                    index = index - data.freeresult[i].freearray.length;
                    continue
                }
                result = data.freeresult[i].freearray[index];
                recordDetail.round = index + 1;
                break;
            }
        }

        recordDetail.roundId = result.roundid;
        recordDetail.result = result;
        recordDetail.win = result.win - recordDetail.bet;
        recordDetail.rewardMultiple = result.sceneodds;
        recordDetail.balance = result.balance;
        recordDetail.createTime = result.createtime; // 使用每次旋转的时间

        // 中奖线处理
        if (result.removelist && result.removelist.length > 0){
            for (let idx=0, len = result.removelist.length; idx < len; idx++){
                let info = result.removelist[idx];
                // 服务器发的win是所有符号的
                let totalWin = data.betsize * data.betmultiple * ConfigMethod.getSymbolRate(info.iconid, info.wincount.length) * info.winlines * result.sceneodds;
                recordDetail.lineInfoList.push({
                    symbolId: info.iconid, // 符号id
                    rewardLine: info.winlines, // 中奖线,夺宝个数
                    win: totalWin / result.sceneodds, // 1倍赢分
                    winTotal: totalWin, // n倍赢分
                    rewardMultiple: result.sceneodds, // 奖金倍数
                    winLine: info.wincount.length, // n星连珠
                    betSize: data.betsize, // 投注大小
                    betMultiple: data.betmultiple, // 投注倍数
                    rate: ConfigMethod.getSymbolRate(info.iconid, info.wincount.length), // 符号赔付值，或夺宝次数
                    isScatter: false, // 是否是夺宝
                })
            }
        }else if (result.scattercount >= SCATTER_BONUS_NEED){// 夺宝
            recordDetail.lineInfoList.push({
                symbolId: IconDefine.SCATTER, // 符号id
                rewardLine: result.scattercount, // 中奖线,夺宝个数
                win: 0, // 1倍赢分
                winTotal: 0, // n倍赢分
                rewardMultiple: result.sceneodds, // 奖金倍数
                winLine: 0, // n星连珠
                betSize: data.betsize, // 投注大小
                betMultiple: data.betmultiple, // 投注倍数
                rate: (result.scattercount - SCATTER_BONUS_NEED) * SCATTER_BONUS_FREE_TIMES_EXTRA + SCATTER_BONUS_FREE_TIMES, // 符号赔付值，或夺宝次数
                isScatter: true, // 是否是夺宝
            });

            if (index == 0){// 购买奖金游戏处理
                let recordInfo = this.findRecord(orderId)
                if (recordInfo != null){
                    recordDetail.otherArgs = recordInfo.buytype;
                }
            }
        }

        return recordDetail;
     }
     /**
      * 获取记录偏移几条
      * @param spinIndex 第几次旋转
      */
     getRecordDetailSpinOffsetCount(orderId: string, spinIndex: number){
        let data = this.recordDetailMap.get(orderId);
        if (!data){
            return null;
        }

        if (spinIndex == NORMAL_SPIN_INDEX){
            return 0
        }

        let offset = data.normalresult.length;
        for(let index=0, len = data.freeresult.length; index < len; index++){
            spinIndex--;
            if (spinIndex <= 0){
                break
            }

            offset += data.freeresult[index].freearray.length
        }
        return offset;
     }
 
     /**
      * 根据偏移位置找到 第几次旋转,旋转次数从1开始
      * @param offsetIdx 
      */
     getRecordDetailSpinIndex(orderId: string, offsetIdx: number):number{
        let data = this.recordDetailMap.get(orderId);
        if (!data){
            return null;
        }

        if (offsetIdx < data.normalresult.length){
            return NORMAL_SPIN_INDEX
        }

        offsetIdx -= data.normalresult.length
        let spinIndex = 1;
        for(let index=0, len = data.freeresult.length; index < len; index++){
            if (data.freeresult[index].freearray.length <= offsetIdx){
                offsetIdx -= data.freeresult[index].freearray.length;
                spinIndex = spinIndex + 1;
                continue
            }
          
            break
        }

        return spinIndex
     }

      /**
     * 获取旋转总赢
     */
    getRecoredDetailSpinWin(orderId: string, spinIndex: number): number{
        let data = this.recordDetailMap.get(orderId);
        if (!data){
            return null;
        }

        if (spinIndex == NORMAL_SPIN_INDEX){
            let lastIndex = data.normalresult.length - 1;
            return data.normalresult[lastIndex].havewin;
        }

        spinIndex = spinIndex - 1;
        let lastIndex = data.freeresult[spinIndex].freearray.length - 1;
        return data.freeresult[spinIndex].freearray[lastIndex].havewin;
    }

    // private getScatterCount(cardList: TGoldenCityCardList[]) {
    //     let scatterCount = 0;
    //     for (let i=0; i<COLUMN_COUNT; i++) {
    //         cardList[i].list.forEach(v => {
    //             if (v % 100 == IconDefine.SCATTER){
    //                 scatterCount = scatterCount + 1;
    //             }
    //         });
    //     }
    //     return scatterCount;
    // }

    private findRecord(orderId: string){
        let recordList = this.recordList.record;
        for (let i=0, len=recordList.length; i<len; i++){
            if (orderId == recordList[i].orderid){
                return recordList[i]
            }
        }
        return null
    }
}


