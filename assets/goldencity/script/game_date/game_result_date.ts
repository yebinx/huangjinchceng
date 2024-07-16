import { IconDefine, IconFrame, TGoldenCityCardList, TResult, TS2G } from "../../proto/base";
import { ConfigMethod } from "../config/config_method";
import { COLUMN_COUNT, COLUMN_HORIZONTAL, COLUMN_LAST_IDX, MultipleBonus, MultipleNormal, SCATTER_BONUS_NEED } from "../config/game_config";
import { GmaeNeighbor } from "./game_neighbor";

export class GameResultData {
    private betBalanceBefore = 0; // 押注后剩余的金额
    private balance = 0; // 余额
    private totalFreeTimes = 0; // 一个orderId 总共获得多少次免费次数
    private currentFreeTimes = 0; // 当前剩余多少次免费次数 
    private spinFreeTimes = 0; // 本次旋转获得多少次免费次数
    private freeTimesTotalWin = 0; // 免费次数总共赢多少
    private spinWin = 0; // 本次旋转，总赢

    private resultList:TResult[] = null;
    private resultIdx: number = 0; // 当前显示第几轮
    private currentMuitiple = 0; // 当前游戏倍数
    private isSpinBonusGame: boolean = false; // 当前摇奖是否是免费游戏
    private currentSpinGetFreeTimes: number = 0; // 本次旋转获得免费次数

    private resultDataDecord: Map<number, number[]> =  new Map<number, number[]>();
    private resultScatterIdx: Map<number, number[][]> = new Map<number, number[][]>();
    private resultScatterCount: Map<number, number> =  new Map<number, number>();
    
    reqReset(){
        // console.warn("重置 resultIdx");
        this.resultIdx = 0;
        this.resultList = null;
        this.resultDataDecord.clear();
        this.resultScatterIdx.clear();
        this.resultScatterCount.clear();
        this.spinWin = 0;
    }

    getTotalFreeTimes(){return this.totalFreeTimes;}
    getFreeTimes(){return this.currentFreeTimes;}
    getFreeTimesTotalWin(){return this.freeTimesTotalWin;}
    // 获取总赢，不包含本次旋转
    getFreeTimesTotalWinBefore(){ return Math.max(0, this.freeTimesTotalWin - this.spinWin); }

    // 获取下注后的金币，需要获得服务器数据后
    getBalanceBefore() {return this.betBalanceBefore;}
    getBalance(){return this.balance;}
    getResultIdx(){return this.resultIdx;}
    getSpinBonusGame(){return this.isSpinBonusGame;}
    getCurrentSpinGetFreeTimes() {return this.currentSpinGetFreeTimes;}

    getResultRoundCount(){
        if (!this.resultList){
            return 0;
        }

        return this.resultList.length;
    }

    // 获取本局赢的分数服务器发的
    getSpinWin(){return this.spinWin;}

    getCurrentMultiple(){return this.currentMuitiple;}

    protected setSpinWin(win: number){this.spinWin = win;}
    setCurrentMultiple(currentMultiple: number){this.currentMuitiple = currentMultiple;}
    setNextMultiple(){
        this.currentMuitiple = this.currentMuitiple + (this.isSpinBonusGame ? MultipleBonus : MultipleNormal);
    }

    // setRoundNo(roundNo: string){ return this.roundNo = roundNo;}
    // resetRoundNo(){ this.roundNo = null; }

    protected setBalanceBefore(balanceBefore:number){this.betBalanceBefore = balanceBefore;}
    protected setBalance(balance: number){ this.balance = balance;}
    protected setResultData(resultData: TResult[]){this.resultList = resultData;}
    protected setTotalFreeTimes(totalFreeTimes: number){this.totalFreeTimes = totalFreeTimes;}
    protected setFreeTimes(freeTimes: number) {this.currentFreeTimes = freeTimes;}
    protected setSpinFreeTimes(freeTimes: number) { this.spinFreeTimes = freeTimes; }
    protected setSpinBonusGame(bonusGame: boolean){this.isSpinBonusGame = bonusGame;}
    protected setCurrentSpinGetFreeTimes(freeTimes: number) {this.currentSpinGetFreeTimes = freeTimes;}

    // 扣除免费次数次数
    deductFreeTimes(){
        this.currentFreeTimes -= 1;
        return this.currentFreeTimes;
    }

    setFreeTimesTotalWin(freeTimesTotalWin: number){this.freeTimesTotalWin = freeTimesTotalWin;}

    // 游戏总赢要记录到单局总赢
    bonusFinish(){
        this.setSpinWin(this.freeTimesTotalWin);
        this.setFreeTimesTotalWin(0)
    }

    // 增加免费次数总赢
    protected addFreeTimesTotalWin(add: number){this.freeTimesTotalWin += add;}

    addResultIdx(){this.resultIdx++;}

    // 是否有中奖
    isReward(resultIdx:number){
        if (!this.resultList){
            return false;
        }

        return this.resultList[resultIdx].removelist.length > 0
    }

    // 本次是否获得scatter 
    isScatterGame(){
        return this.getScatterCount(this.resultIdx, COLUMN_LAST_IDX) >= SCATTER_BONUS_NEED
    }

    // 获得免费次数
    getScatterFreeTimes(){return this.spinFreeTimes;}

    // 获取列的开奖结果
    getRollData(resultIdx:number, rollIdx: number){
        if (!this.resultList[resultIdx].card_list[rollIdx]){
            return null
        }
        
        return this.resultList[resultIdx].card_list[rollIdx].list;
    }

    // 获取开奖数据
    getRollDataList(resultIdx:number, range: number){
        let sz = []
        for (let i=0; i<=range; i++){
            sz.push(this.resultList[resultIdx].card_list[i].list)
        }
        return sz;
    }

    // 获取掉落数据
    getDropData(resultIdx:number, rollIdx: number){
        return this.resultList[resultIdx].card_list[rollIdx].droplist;
    }

    // 获取每列开奖位置
    getRewardIdx(resultIdx:number, rollIdx:number){
        return this.resultList[resultIdx].card_list[rollIdx].winpos;
    }

    // 获取框转换的数据
    getFrameChange(resultIdx:number){
        let map = new Map<number, TS2G[]>();
        let itemList = this.resultList[resultIdx].card_list;
        itemList.forEach((data, k)=>{
            if (data.s2glist){
                map.set(k, data.s2glist);
            }
        })
        return map
    }

    getRoundWin(resultIdx:number){
        if (!this.resultList){
            return 0;
        }
        return this.resultList[resultIdx].win
    }

    getTotalWin(lastRoundIdx: number){
        if (lastRoundIdx == this.resultList.length - 1){
            return this.resultList[lastRoundIdx].havewin;
        }

        return this.resultList[lastRoundIdx].win + this.resultList[lastRoundIdx].havewin;
    }

    // 特殊符号位置，消除后会转换wild
    getRewardIdxFilterWild(resultIdx:number, rollIdx:number){
        let rewardIdxList = this.getRewardIdx(resultIdx, rollIdx);
        let rollData = this.getRollData(resultIdx, rollIdx);

        let szSpecialWild:number[] = [];
        for (let i=0, len=rewardIdxList.length; i<len; i++) {
            let itemIdx = rewardIdxList[i];
            if (rollData[itemIdx] > IconFrame.SILVERFRAME) {
                continue
            }

            szSpecialWild.push(itemIdx);
        }

        if (szSpecialWild.length > 1){
            szSpecialWild.sort()
        }

        return  szSpecialWild;
    }

    // 之前是否出现过3个scatter
    isMaybeScatter(resultIdx:number,rollIdx: number) {
        return (this.getScatterCount(resultIdx, rollIdx) >= SCATTER_BONUS_NEED - 1);
    }

    /**
     * 获取scatter数量
     * @param resultIdx 
     * @param rollIdx 循环包含的
     * @returns 
     */
    getScatterCount(resultIdx:number, rollIdx: number){
        let key = resultIdx * 1000 + rollIdx;
        let scatterCount = this.resultScatterCount.get(key);
        if (scatterCount !== undefined){
            return scatterCount;
        }

        let startRollIdx: number;
        scatterCount = this.resultScatterCount.get(key-1);
        if (scatterCount !== undefined){
            startRollIdx = rollIdx
        }else{
            startRollIdx = COLUMN_HORIZONTAL;
            scatterCount = 0;
        }

        let data = this.resultList[resultIdx];
        for (let col=startRollIdx; col<=rollIdx; col++){
            data.card_list[col].list.forEach(v => {
                if (v % 100 == IconDefine.SCATTER){
                    scatterCount = scatterCount + 1;
                }
            });
        }

        this.resultScatterCount.set(key, scatterCount);
        return scatterCount;
    }

    /**
     * 获取单轴scatter数量
     * @param resultIdx 
     * @param rollIdx 
     * @returns 
     */
    getScatterCountOnlyOnceRoll(resultIdx:number, rollIdx: number){
        let scatterCount = 0;
        let data = this.resultList[resultIdx];
        data.card_list[rollIdx].list.forEach(v => {
            if (v % 100 == IconDefine.SCATTER){
                scatterCount = scatterCount + 1;
            }
        });

        return scatterCount;
    }
    
    /**
     * 获取scatter Idx
     * @param resultIdx 
     * @returns 二位数组，[roll][scatteridxlist]
     */
    getScatterIdx(resultIdx:number){
        let szScatterIdx = this.resultScatterIdx.get(resultIdx);
        if (szScatterIdx){
            return szScatterIdx;
        }

        szScatterIdx = [];
        for (let i=0; i<COLUMN_COUNT; i++){
            szScatterIdx[i] = [];
        }
        
        if (this.resultList.length <= resultIdx){
            return szScatterIdx;
        }

        this.resultList[resultIdx].card_list.forEach((value: TGoldenCityCardList, col: number)=>{
            value.list.forEach((symbol:number, index: number)=>{
                if (symbol % 100 == IconDefine.SCATTER){
                    szScatterIdx[col].push(index);
                }
            })
        });

        this.resultScatterIdx.set(resultIdx, szScatterIdx);

        return szScatterIdx;
    }

    // 获取scatterIdx 掉落后数据
    getScatterIdxDropAfter(resultIdx:number){
        let szScatterIdx = [];
        for (let i=0; i<COLUMN_COUNT; i++){
            szScatterIdx[i] = [];
        }

        this.resultList[resultIdx].card_list.forEach((value: TGoldenCityCardList, col: number)=>{
            let data = [].concat(value.list);
            if (value.winpos && value.winpos.length > 0){
                if (value.s2glist && value.s2glist.length > 0){ // 过滤转换的符号
                    value.winpos.forEach(element => {
                        for (let i=0, len=value.s2glist.length; i < len; i++){
                            if (value.s2glist[i].silverindex == element){
                                return 
                            }
                        }
                        data[element] = IconDefine.BLANK;
                    });
                }else{
                    value.winpos.forEach(element => {
                        data[element] = IconDefine.BLANK;
                    });
                }
            }

            let index = 0;
            data.forEach((symbol:number)=>{
                if (symbol == IconDefine.BLANK){
                    return;
                }

                if (symbol % 100 == IconDefine.SCATTER){
                    szScatterIdx[col].push(index);
                }

                index += 1;
            })
        });

        return szScatterIdx;
    }

      /**
     * 获取百搭数量
     */
    getWildIndexList(resultIdx:number, rollIdx: number){
        let sz = []
        let data = this.resultList[resultIdx];
        data.card_list[rollIdx].list.forEach((symbol, index) => {
            if (symbol % 100 == IconDefine.WILD){
                sz.push(index)
            }
        });

        return sz;
    }

    //
    getWinNeighbor(resultIdx:number) {
        let szRoll:GmaeNeighbor[][] = []
        szRoll.push([new GmaeNeighbor(), new GmaeNeighbor(), new GmaeNeighbor(), new GmaeNeighbor()])
        for (let i=1; i<COLUMN_COUNT; i++){
            szRoll.push([new GmaeNeighbor(), new GmaeNeighbor(), new GmaeNeighbor(), new GmaeNeighbor(), new GmaeNeighbor()])
        }

        let addTopBottom = (rollIdx: number, lastSpace: number, isTop: boolean)=>{
            if (rollIdx <= COLUMN_HORIZONTAL || rollIdx >= COLUMN_COUNT){
                return 
            }

            if (lastSpace < 0 || lastSpace >= szRoll[rollIdx].length){
                return 
            }

            if (isTop){
                szRoll[rollIdx][lastSpace].addTop();
                return 
            }
            szRoll[rollIdx][lastSpace].addBottom();
        }

        let resultData = this.resultList[resultIdx];
        for (let rollIdx=COLUMN_HORIZONTAL; rollIdx < COLUMN_COUNT; rollIdx++){
            let date = resultData.card_list[rollIdx];
            if (!date.winpos || date.winpos.length <= 0){
                continue;
            }

            let winIndex = 0;
            let lastSpace = 0;

            if (rollIdx == COLUMN_HORIZONTAL){
                date.list.forEach((symbol: number, symbolIndex: number)=>{
                    let space = 1;
                    if (symbolIndex != date.winpos[winIndex]){
                        lastSpace = lastSpace + space
                        return;
                    }
    
                    szRoll[rollIdx][lastSpace].addSelf();
                    if (lastSpace-1 >= 0){
                        szRoll[rollIdx][lastSpace-1].addRight();
                    }
                    
                    if (lastSpace+1 < szRoll[rollIdx].length){
                        szRoll[rollIdx][lastSpace+1].addLeft();
                    }

                    winIndex++;
                    lastSpace = lastSpace + space;
                })
            }else{
                date.list.forEach((symbol: number, symbolIndex: number)=>{
                    let {space} = ConfigMethod.decodeItemType(symbol);
                    if (symbolIndex != date.winpos[winIndex]){
                        lastSpace = lastSpace + space
                        return;
                    }
                    
                    addTopBottom(rollIdx, lastSpace-1, true);
                    for (let index=0; index < space; index++){
                        szRoll[rollIdx][lastSpace+index].addSelf();

                        if (rollIdx-1 > 0){
                            szRoll[rollIdx-1][lastSpace+index].addRight();
                        }
                        
                        if (rollIdx+1 < szRoll.length){
                            szRoll[rollIdx+1][lastSpace+index].addLeft();
                        }
                    }

                    winIndex++;
                    lastSpace = lastSpace + space;
                    addTopBottom(rollIdx, lastSpace, false);
                })
            }
        }

        // 
        // szRoll.forEach((data, rollIdx)=>{
        //     console.log("rollIdx", rollIdx)
        //     data.forEach(element => {
        //         element.dump()
        //     });
        // })
        ///

        return szRoll;
    }
}


