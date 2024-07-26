import { GameConfig } from "../../../resources/script/game_config";
import { HeartBeatData } from "./heart_beat_data";
import { HttpRequest } from "./http_request";
import { GameResultData } from "./game_result_date";
import { GameRecord } from "./game_record";
import { GameStatusType } from "./game_status_type";
import { Emitter } from "../../../shared/script/lib/Emitter";
import { ConfigMethod } from "../config/config_method";
import { BONUS_BUY_MULTIPLE, COLUMN_COUNT, COLUMN_HORIZONTAL, TOTAL_LINE } from "../config/game_config";
import { EMIT_SCORE_TOTAL, EMIT_SHOW_GAME_RECORD, EMIT_SHOW_GAME_RECORD_DETAIL } from "../../../shared/script/config/shared_emit_event";
import { SharedConfig } from "../../../shared/script/config/shared_config";
import { EMIT_RECEIVE_RESULT } from "../config/emit_event";
import { TProtoGoldenCityUserInfoRsp } from "../../proto/v1.goldencity.user.info";
import { BetInfo, TGoldenCityBetInfoRsp } from "../../proto/v1.goldencity.bet.info";
import { TProtoGoldenCityBetRsp, TProtoGoldenCityBetType } from "../../proto/v1.goldencity.bet";
import { TProtoGoldenCityFreeRsp } from "../../proto/v1.goldencity.free";
import { GameOpenUiStatus } from "./game_open_ui";
import { GameKeyBoard } from "./game_keyboard";
import { GameTime } from "./game_time";
import { GameTryRequestAgain } from "./game_try_request_again";
import { AudioSwitchType } from "../../proto/v1.goldencity.mute";
import { NetworkSend } from "../../../resources/script/network/NetworkSend";

export class GameData extends GameResultData{
    // 数据从game_loading 登录完成后，通过数据挂载传递过来的
    private gameConfig: GameConfig = null;
    userInfo:TProtoGoldenCityUserInfoRsp = null;
    // bloc ----
    private emitter:Emitter;
    
    private autoStartTimes:number = 0; // 自动开始次数
    private gameKeyboard = new GameKeyBoard();
    private gameTime = new GameTime();
    private heartbeatData:HeartBeatData = new HeartBeatData();
    private httpRequest:HttpRequest = new HttpRequest();
    private gameRecord:GameRecord = new GameRecord();
    private gameStatusType:GameStatusType = new GameStatusType();
    private isBuyBonusGame:boolean = false; // 是否购买免费游戏
    private gameOpenUiStatus:GameOpenUiStatus = new GameOpenUiStatus();
    private gameTryRequestAgain:GameTryRequestAgain = new GameTryRequestAgain();
//------------------------------------------
    private szBaseBet = [100, 500, 2500]; // 投注大小
    private baseBetIdx:number = 0; // 投注大小idx
    private szMultiple = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 投注倍率
    private multipleIdx:number = 0;// 投注倍率idx
    private mapTotalBet:Map<number, number[]> = new Map(); // <totalBet, id>
    private buyFreeBetId:Map<number, boolean> = new Map(); // 购买免费游戏id <id, true>
    private firstEnter = true; // 是否首次进入，首次进入有些提示信息要做

    constructor() {
        super();
        this.heartbeatData.updateLastHeartBeatTime();
    }
   
    // 切换场景，通过 attr挂载到节点身上
    parserData(mountNode: any) {
        this.gameConfig = mountNode["game_config"];
        delete mountNode["game_config"];

        this.userInfo = this.gameConfig.userInfo;
        this.httpRequest.setToken(this.gameConfig.token);
        this.httpRequest.setGetApiMethod(this.gameConfig.getApi.bind(this.gameConfig));

        this.parserResultData()
        this.preserBetInfo(this.gameConfig.betInfo);
        this.parserBetSelect(this.gameConfig.betInfo);
    }

    preserBetInfo(betInfo: TGoldenCityBetInfoRsp){
        let betBaseSet = new Map();
        let multipleSet = new Map();

        
        let totalSet = new Map();
        this.szBaseBet = [];
        this.szMultiple = [];
        this.mapTotalBet = new Map<number, number[]>();
        betInfo.betinfo.forEach((v: BetInfo, id:number) => {
            if (!betBaseSet[v.betsize]){
                this.szBaseBet.push(v.betsize);
                betBaseSet[v.betsize] = true;
            }

            if (!multipleSet[v.betmultiple]){
                this.szMultiple.push(v.betmultiple);
                multipleSet[v.betmultiple] = true;
            }

            let total = v.betsize * v.betmultiple * v.betbase;
            if (!totalSet[total]){
                this.mapTotalBet.set(total, [v.betid]); // 服务器id从1开始
                totalSet[total] = true;
            }else{
                this.mapTotalBet.get(total).push(v.betid);
            }
        });

        this.buyFreeBetId = new Map<number, boolean>();
        betInfo.buyfreebetid.forEach((id)=>{
            this.buyFreeBetId.set(id, true);
        })

        // // 校验倍数是否都在总数中找到
        // this.szBaseBet.forEach((bet: number) => {
        //     this.szMultiple.forEach((multiple: number) => {
        //         if (!totalSet[bet*multiple*TOTAL_LINE]){
        //             console.error(`unfind total bet. base bet=${bet} multiple=${multiple}`)
        //         }
        //     });
        // });
    }

    // 解析默认选中的投注值
    parserBetSelect(betInfo: TGoldenCityBetInfoRsp){
        let lastBetId = this.userInfo.GoldenCity_info?.betid || betInfo.defaultbetid;
        if (betInfo.betinfo.length - 1 > lastBetId) { // 初始化默认选择
            let info = this.findBetInfo(lastBetId, betInfo.defaultbetid);
            this.baseBetIdx = this.findBetIdx(info.betsize)
            this.multipleIdx = this.findMultipleIdx(info.betmultiple);
        }
    }

    // 解析结算的数据
    parserResultData(){
        this.setBalance(this.userInfo.player_info.balance);
        this.setCurrentMultiple(this.userInfo.GoldenCity_info.sceneodds);
        this.setFreeTimes(this.userInfo.GoldenCity_info.free_play_times);
        this.setTotalFreeTimes(this.userInfo.GoldenCity_info.free_play_times); // 这个值是不正确的，这个是剩余
        if (this.userInfo.GoldenCity_info.free_play_times <= 0){
            this.setFreeTimesTotalWin(0);
        }else{
            this.setFreeTimesTotalWin(this.userInfo.GoldenCity_info?.havewin || 0);
        }
    }

    private findBetInfo(betId: number, defaultBetID: number){
        let betInfo: TGoldenCityBetInfoRsp = this.gameConfig.betInfo;
        for (let i=0; i<betInfo.betinfo.length; i++){
            if (betInfo.betinfo[i].betid == betId){
                return betInfo.betinfo[i]
            }
        }

        for (let i=0; i<betInfo.betinfo.length; i++){
            if (betInfo.betinfo[i].betid == defaultBetID){
                return betInfo.betinfo[i]
            }
        }
        return betInfo.betinfo[0];
    }

    private findBetIdx(betSize: number){
        for (let i=0; i<this.szBaseBet.length; i++){
            if (this.szBaseBet[i] == betSize){
                return i
            }
        }
        return 0
    }

    private findMultipleIdx(betmultiple: number){
        for (let i=0; i<this.szMultiple.length; i++){
            if (this.szMultiple[i] == betmultiple){
                this.multipleIdx = i
                return i
            }
        }
        return 0
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
        this.httpRequest.setEmitter(emitter);
    }

    clearResult(){
        this.httpRequest.clearDate();
    }

    // 更新自动旋转次数
    setAutoStartTimes(value:number){this.autoStartTimes = value;}

    // 扣除自动开始次数
    deductAutoStartTimes(): boolean{
        if (this.autoStartTimes > 0){
            this.setAutoStartTimes(this.autoStartTimes - 1);
            return true;
        }
        return false;
    }

    setBaseBetIdx(baseBetIdx: number){this.baseBetIdx = baseBetIdx;}
    setMultipleIdx(multipleIdx: number){this.multipleIdx = multipleIdx;}

    setBuyBonusGame(buy: boolean){this.isBuyBonusGame = buy;}

    getAudioSwitch(){return this.userInfo.player_info.mute == AudioSwitchType.ON;}
    getGameRecord(){return this.gameRecord;}

    getBaseBetIdx(){return this.baseBetIdx;}
    getBaseBetLeng(){return this.szBaseBet?.length || 0}
    getMultipleIdx(){return this.multipleIdx;}
    getMultipleLeng(){return this.szMultiple?.length || 0}

    getAutoStartTimes(){return this.autoStartTimes;}

    getBaseBetList(){return this.szBaseBet;}
    getBaseBetMin(){
        if (this.szBaseBet.length > 0){
            return this.szBaseBet[0]
        }
        return 0;
    }

    getBaseBetMax(){
        if (this.szBaseBet.length > 0){
            return this.szBaseBet[this.szBaseBet.length-1]
        }
        return 0;
    }

    getMultipleList(){return this.szMultiple;}
    getMultipleMin(){
        if (this.szMultiple.length > 0){
            return this.szMultiple[0]
        }
        return 0;
    }

    getMultipleMax(){
        if (this.szMultiple.length > 0){
            return this.szMultiple[this.szMultiple.length - 1]
        }
        return 0;
    }

    getBetInfoCount(){
        let betInfo: TGoldenCityBetInfoRsp = this.gameConfig.betInfo;
        if (betInfo){
            return betInfo.betinfo.length;
        }
        return 0;
    }

    getBuyBonusGame(){ return this.isBuyBonusGame; }

    private tryAddBetNextLevel(){
        let totalBet = this.getBetAllLine()
        let betInfo = this.getBetId(totalBet)
        let betInfoRsp = (this.gameConfig.betInfo as TGoldenCityBetInfoRsp);
        let nextBetInfo:BetInfo = null;
     
        let currBet =  betInfo.betsize * betInfo.betmultiple * betInfo.betbase;
        let betMin = 0;
        let betTemp = 0;
        for (let i=0, len=betInfoRsp.betadjust.length, key=0; i<len; i++) {
            key = betInfoRsp.betadjust[i] - 1;
            betTemp = betInfoRsp.betinfo[key].betsize * betInfoRsp.betinfo[key].betmultiple * betInfoRsp.betinfo[key].betbase;
            if (currBet < betTemp){
                if (betTemp < betMin || betMin == 0){
                    betMin = betTemp
                    nextBetInfo = betInfoRsp.betinfo[key];
                }
            }
        }
        
        if (nextBetInfo == null ||  currBet >= betMin){
            return null;
        }

        return nextBetInfo;
    }

    // 增加等级投注
    addBetNextLevel(){
        let nextBetInfo:BetInfo = this.tryAddBetNextLevel();
        if (nextBetInfo == null){
            return false;
        }

        this.baseBetIdx = this.findBetIdx(nextBetInfo.betsize)
        this.multipleIdx = this.findMultipleIdx(nextBetInfo.betmultiple);
        return true
    }

    isMaxBetLevel(){return this.tryAddBetNextLevel() == null;}

    private tryMinusBetNextLevel(){
        let totalBet = this.getBetAllLine()
        let betInfo = this.getBetId(totalBet)
        let betInfoRsp = (this.gameConfig.betInfo as TGoldenCityBetInfoRsp);
        let prevBetInfo:BetInfo = null;

        let currBet =  betInfo.betsize * betInfo.betmultiple * betInfo.betbase;
        let betMax = 0;
        let betTemp = 0;
        for (let i=0, len=betInfoRsp.betadjust.length, key=0; i<len; i++) {
            key = betInfoRsp.betadjust[i] - 1;
            betTemp = betInfoRsp.betinfo[key].betsize * betInfoRsp.betinfo[key].betmultiple * betInfoRsp.betinfo[key].betbase;
            if (currBet > betTemp){
                if (betTemp > betMax || betMax == 0){ // 处理离当前值最近的
                    betMax = betTemp
                    prevBetInfo = betInfoRsp.betinfo[key];
                }
            }
        }
        
        if (prevBetInfo == null || currBet <= betMax){
            return null
        }

        return prevBetInfo;
    }

    // 减少等级投注
    minusBetNextLevel(){
        let prevBetInfo:BetInfo = this.tryMinusBetNextLevel();
        if (prevBetInfo == null){
            return false
        }

        this.baseBetIdx = this.findBetIdx(prevBetInfo.betsize)
        this.multipleIdx = this.findMultipleIdx(prevBetInfo.betmultiple);
        return true
    }

    isMinBetLevel(){return this.tryMinusBetNextLevel() == null;}

    // 检查是否可以购买免费游戏
    checkBuyFreeBetId(id: number){return this.buyFreeBetId.get(id)}

    // 获取投注金币
    getBetAllLine(){return this.getBaseBet() * TOTAL_LINE;}
    // 获取一条线的下注分
    getBaseBet(){
        return this.szBaseBet[this.baseBetIdx] * this.szMultiple[this.multipleIdx];
    }

    // 购买免费游戏
    getBuyBonusGameNeed(){return this.getBetAllLine() * BONUS_BUY_MULTIPLE;}
  
    // 获取心跳数据
    getHeartbeatData(){return this.heartbeatData;}

    // 默认排序的图标
    getDefaultSymbol(){
        if (!this.userInfo.lastresult){
            return ConfigMethod.getDefaultSymbol()
        }

        let lastSymbol = [];
        for (let i=COLUMN_HORIZONTAL; i<COLUMN_COUNT; i++){
            lastSymbol.push(this.userInfo.lastresult.card_list[i].list);
        }

        return lastSymbol;
    }

    // 获取游戏状态
    getGameStatusType(){return this.gameStatusType;}
    getGameOpenUiStatus(){return this.gameOpenUiStatus;}

    getGameKeyBoared() {return this.gameKeyboard; }
    getGameTime(){ return this.gameTime; }

    private getBetId(score: number){
        let idList = this.mapTotalBet.get(score); // 同个分数有不同id
        for (let index = 0, len = idList.length; index < len; index++) {
            let betInfo = (this.gameConfig.betInfo as TGoldenCityBetInfoRsp).betinfo[idList[index] - 1];
            if (betInfo.betsize == this.szBaseBet[this.baseBetIdx] && betInfo.betmultiple == this.szMultiple[this.multipleIdx]){
                return  betInfo;
            }
        }
        return null;
    }

    getBetIdList(score: number) {return this.mapTotalBet.get(score);}

    isFirstEnter() {return this.firstEnter;}
    saveFistEnter(){ this.firstEnter = false; }

    async reqBet(score: number, buyType:TProtoGoldenCityBetType=TProtoGoldenCityBetType.NORMAL) {
        this.reqReset();

        let balance_before_score = this.getBalance() - (buyType == TProtoGoldenCityBetType.NORMAL ? score : score * BONUS_BUY_MULTIPLE);
        let betInfo = this.getBetId(score);
        let respone:any = await NetworkSend.Instance.sendStartSpinPromise({mTotalAmount:score})
        // let respone:any = await this.httpRequest.reqBet(betInfo, score, buyType) as TProtoGoldenCityBetRsp; 
        if (respone == null){
            return
        }

        this.heartbeatData.updateLastHeartBeatTime();
        this.setBalanceBefore(balance_before_score);
        this.setBalance(respone.balance);
        this.setFreeTimes(respone.freetimes);
        this.setCurrentSpinGetFreeTimes(respone.freetimes);
        this.setTotalFreeTimes(respone.freetimes);
        this.setSpinFreeTimes(respone.freetimes);
        this.setResultData(respone.result);
        this.setSpinWin(respone.wintotal);
        this.setSpinBonusGame(false);
        this.emitter.emit(EMIT_SCORE_TOTAL, SharedConfig.ScoreFormat(this.getBalanceBefore()))
        this.emitter.emit(EMIT_RECEIVE_RESULT)
    }

    // 请求免费游戏
    async reqFree(){
        this.reqReset();
        let respone:any = await NetworkSend.Instance.sendStartSpinPromise({mTotalAmount:0})
        //let respone = await this.httpRequest.reqFree() as TProtoGoldenCityFreeRsp;
        if (respone == null){
            return
        }

        this.heartbeatData.updateLastHeartBeatTime();
        this.setBalanceBefore(this.getBalance());
        this.setBalance(respone.balance);
        this.setFreeTimes(this.getFreeTimes() + respone.freetimes);
        this.setCurrentSpinGetFreeTimes(respone.freetimes);
        this.setTotalFreeTimes(this.getTotalFreeTimes() + respone.freetimes);
        this.setSpinFreeTimes(respone.freetimes);
        this.addFreeTimesTotalWin(respone.wintotal);
        this.setSpinWin(respone.wintotal);
        this.setResultData(respone.result);
        this.setSpinBonusGame(true);
        this.emitter.emit(EMIT_RECEIVE_RESULT);
    }

    // 请求心跳事件
    async reqHeartBeat(){
        // let respone = await this.httpRequest.reqHeartBeat();
        // if (respone == null){
        //     return
        // }

        this.heartbeatData.updateLastHeartBeatTime();
        // console.log("heartbeat 2")
    }

    // 请求游戏记录
    async reqGameRecord(startTimestamp: number, endTimestamp: number, offset: number){
        this.gameTryRequestAgain.saveReqGameRecord(startTimestamp, endTimestamp, offset);
        let respone = await this.httpRequest.reqGameRecord(startTimestamp, endTimestamp, offset, 30);
        if (respone == null){
            return
        }

        this.gameTryRequestAgain.clearReqGameRecord();

        if (offset == 0){
            this.gameRecord.setRecordListRsp(respone);
        }else{
            this.gameRecord.addRecordListRsp(respone);
        }
        
        this.emitter.emit(EMIT_SHOW_GAME_RECORD, offset, startTimestamp, endTimestamp);
    }
    
    async reqGameRecordRetry(){
        let  {startTimestamp, endTimestamp, offset} = this.gameTryRequestAgain.getReqGameRecord();
        this.reqGameRecord(startTimestamp, endTimestamp, offset);
    }

    // 请求游戏记录单条详情
    async reqRecordDetail(orderId:string){
        let recordDetail = this.gameRecord.getRecordDetail(orderId);
        if (recordDetail){
            this.emitter.emit(EMIT_SHOW_GAME_RECORD_DETAIL, orderId, recordDetail);
            return 
        }

        this.gameTryRequestAgain.saveReqRecordDetail(orderId);
        let respone = await this.httpRequest.reqRecordDetail(orderId);
        if (respone == null){
            return
        }

        this.gameTryRequestAgain.clearReqRecordDetail();

        this.gameRecord.addRecordDetail(orderId, respone);
        this.emitter.emit(EMIT_SHOW_GAME_RECORD_DETAIL, orderId, respone);
    }

    // 
    async reqRecordDetailRetry(){
        let  orderId = this.gameTryRequestAgain.getReqRecordDetail();
        this.reqRecordDetail(orderId);
    }

    // 更新音效
    async reqAudioMuteReq(audioSwitch: boolean){
        this.httpRequest.reqAudioMuteReq(audioSwitch)
    }
}

