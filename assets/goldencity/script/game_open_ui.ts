import { Component, Prefab, _decorator, instantiate, Node, game, isValid } from "cc";
import { Emitter } from "../../shared/script/lib/Emitter";
import { EMIT_BTN_STAR, EMIT_GAME_HISTORY_OPEN, EMIT_GAME_RULE_OPEN, EMIT_INSUFFICIENT_BALANCE_TIPS, EMIT_RATE_RULE_OPEN, EMIT_VIEW_RESIZE_FLUSH } from "../../shared/script/config/shared_emit_event";
import { SharedGameRule } from "../../shared/script/shared_game_rule/shared_game_rule";
import { SharedMenuAdaptation } from "../../shared/script/shared_adaptation/shared_menu_adaptation";
import { SharedGameRate } from "../../shared/script/shared_game_rate/shared_game_rate";
import { BuyBonus } from "./buy_bonus/buy_bonus";
import { BuyBonusButton } from "./buy_bonus/buy_bonus_button";
import { EMIT_OPEN_BUY_BONUS } from "./config/emit_event";
import { SharedRecord } from "../../shared/script/shared_record/shared_record";
import { GameData } from "./game_date/game_data";
import { Record } from "./record/record";
import { GameRule } from "./rule/game_rule";

const { ccclass, property } = _decorator;

@ccclass('GameOpenUi')
export class GameOpenUi extends Component{
    @property({type:Node})
    ndPopLayer:Node // 弹窗层

    @property({type:Node})
    ndMiddleLayer:Node // 中间层，比弹窗低

    @property({type:Prefab})
    buyBonus:Prefab;  // 购买免费次数弹框

    @property({type:Prefab})
    gameRule:Prefab  // 游戏规则

    @property({type:Prefab})
    gameRate:Prefab;  // 游戏赔率

    @property({type:Prefab})
    record:Prefab // 历史记录

    // @property({type:Prefab})
    // record:Prefab // 历史记录

    // @property({type:Prefab}) // 提示框
    // noticeBox:Prefab;

    // @property({type:Prefab})
    // retryNotice:Prefab; // 重试提示条

    private gameData:GameData;
    @property({type:BuyBonusButton})
    buyBonusButton:BuyBonusButton;

    private emitter:Emitter;

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
        this.buyBonusButton.setEmitter(emitter);
    }

    setGameData(gameData:GameData){
        this.gameData = gameData;
    }

    register(){
        // this.emitter.addEventListener(EMIT_SETTING_BET_OPEN, this.onEmitOpenSettingBet, this);
        // this.emitter.addEventListener(EMIT_SETTING_START_OPEN, this.onEmitOpenSettingAutoStart, this);
        this.emitter.addEventListener(EMIT_GAME_RULE_OPEN, this.onEmitOpenGameRule, this);
        this.emitter.addEventListener(EMIT_RATE_RULE_OPEN, this.onEmitOpenRateRule, this);
        this.emitter.addEventListener(EMIT_GAME_HISTORY_OPEN, this.onEmitOpenGameHistory, this);
        // this.emitter.addEventListener(EMIT_HEART_BEAT_TIME_OUT, this.onEmitHeartbeatTimeOut, this);
        // this.emitter.addEventListener(EMIT_EXIT_GAME_OPEN, this.onEmitExitGame, this);
        // this.emitter.addEventListener(EMIT_RESPONE_ERROR_CODE, this.onEmitResponeErrorCode, this);
        // this.emitter.addEventListener(EMIT_INSUFFICIENT_BALANCE_TIPS, this.onEmitInsufficientBanlanceTips, this);
        // this.emitter.addEventListener(EMIT_REQUEST_FAIL_RETRY, this.onEmitRequestFailRetry, this);

        this.emitter.addEventListener(EMIT_OPEN_BUY_BONUS, this.onEmitOpenBuyBonus, this);

        this.buyBonusButton.register();
    }
  
    // // 打开投注设置页面
    // onEmitOpenSettingBet(){
    //     if (!this.gameData.getGameStatusType().isInit()){
    //         return;
    //     }

    //     let nd = instantiate(this.settingBet)
    //     let settingBet = nd.getComponent(SettingBet);
    //     settingBet.setEmitter(this.emitter);
    //     settingBet.register();
    //     settingBet.setLine(TOTAL_LINE)
    //     settingBet.setBetData(this.gameData.getBaseBetList());
    //     settingBet.setMultipleData(this.gameData.getMultipleList());
    //     settingBet.setCallback((baseBetIdx:number, multipleIdx:number)=>{
    //         this.gameData.setBaseBetIdx(baseBetIdx);
    //         this.gameData.setMultipleIdx(multipleIdx);
    //         this.emitter.emit(EMIT_SCORE_BET, SharedConfig.ScoreFormat(this.gameData.getBetAllLine()), true);
    //     })
    //     nd.parent = this.ndPopLayer
    //     settingBet.flush(this.gameData.getBaseBetIdx(), this.gameData.getMultipleIdx());

    //     this.emitter.emit(EMIT_SCORE_BET,  SharedConfig.ScoreFormat(this.gameData.getBetAllLine()), false);
    //     this.emitter.emit(EMIT_SCORE_TOTAL,  SharedConfig.ScoreFormat(this.gameData.getUserBalance()));
    //     this.emitter.emit(EMIT_SCORE_GET,  SharedConfig.ScoreFormat(this.gameData.getPrize()));
    //     this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    // }

    // // 打开设置旋转次数页面
    // onEmitOpenSettingAutoStart(){
    //     let nd = instantiate(this.settingAutoStart);
    //     let settingAutoStart = nd.getComponent(SettingAutoStart);
    //     settingAutoStart.setEmitter(this.emitter);
    //     settingAutoStart.register();
    //     settingAutoStart.setAutoStartCallback((selectTimes: number)=>{
    //         this.gameData.setAutoStartTimes(selectTimes);
    //         this.emitter.emit(EMIT_UPDATA_AUTO_START_TIMES, this.gameData.getAutoStartTimes());
    //         this.emitter.emit(EMIT_SETTING_OPEN_START, this.gameData.getAutoStartTimes());
    //     })
  

    //     nd.parent = this.ndPopLayer;

    //     this.emitter.emit(EMIT_SCORE_BET, SharedConfig.ScoreFormat(this.gameData.getBetAllLine()), false);
    //     this.emitter.emit(EMIT_SCORE_TOTAL,  SharedConfig.ScoreFormat(this.gameData.getUserBalance()));
    //     this.emitter.emit(EMIT_SCORE_GET,  SharedConfig.ScoreFormat(this.gameData.getPrize()));
    //     this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    // }

    // 打开规则页面
    private onEmitOpenGameRule(){
        this.gameData.getGameOpenUiStatus().addRule();

        let gameRule = GameRule.New(this.gameRule, this.ndPopLayer)

        let sharedGameRule = gameRule.getComponentInChildren(SharedGameRule)
        sharedGameRule.setRoot(gameRule.node);
        sharedGameRule.setExitCallback(()=>{
            this.gameData.getGameOpenUiStatus().cancelRule();
        })

        gameRule.setRule(this.gameData.getBetInfoCount(), 
        this.gameData.getMultipleMin(), 
        this.gameData.getMultipleMax(), 
        this.gameData.getBaseBetMin(), 
        this.gameData.getBaseBetMax())

        let sharedMenuAdaptation = sharedGameRule.getComponent(SharedMenuAdaptation);
        sharedMenuAdaptation.setEmitter(this.emitter);
        sharedMenuAdaptation.register();
        this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    }

    // 打开赔率页面
    private onEmitOpenRateRule(){
        let nd = instantiate(this.gameRate);
        nd.parent = this.ndPopLayer;
        this.gameData.getGameOpenUiStatus().addRate();

        let sharedGameRule = nd.getComponentInChildren(SharedGameRate)
        sharedGameRule.setRoot(nd);
        sharedGameRule.setExitCallback(()=>{
            this.gameData.getGameOpenUiStatus().cancelRate();
        })
        
        let menuAdaptation = sharedGameRule.getComponent(SharedMenuAdaptation);
        menuAdaptation.setEmitter(this.emitter);
        menuAdaptation.register();
        this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    }

    // 打开购买免费游戏
    private onEmitOpenBuyBonus(){
        this.gameData.getGameOpenUiStatus().addBuyBonus();

        let buyBonus = BuyBonus.New(this.buyBonus, this.ndPopLayer)
        buyBonus.register();
        buyBonus.setBuyCallback(()=> {
            if (this.gameData.getBuyBonusGameNeed() > this.gameData.getBalance()){ // 金币不足
                this.emitter.emit(EMIT_INSUFFICIENT_BALANCE_TIPS, this.gameData.getBalance() - this.gameData.getBuyBonusGameNeed())
                return 
            }

            this.gameData.setBuyBonusGame(true);
            this.emitter.emit(EMIT_BTN_STAR);
        })

        buyBonus.setCloseCallback(()=>{
            this.buyBonusButton.setTouchEnable(true);
            this.gameData.getGameOpenUiStatus().cancelBuyBonus();
        })
        buyBonus.setPrice(this.gameData.getBuyBonusGameNeed());
    }

    // 打开历史记录
    private onEmitOpenGameHistory(){
        if (!this.gameData.getGameStatusType().isInit()){
            return 
        }

        this.gameData.getGameOpenUiStatus().addRecord();
        let record = Record.New(this.record, this.ndPopLayer)
        record.setEmitter(this.emitter);
        record.register();

        // 通用记录逻辑
        let sharedRecord = record.getComponentInChildren(SharedRecord);
        sharedRecord.setGameRecord(this.gameData.getGameRecord())
        sharedRecord.setEmitter(this.emitter);
        sharedRecord.register();
        //sharedRecord.showLoadingTips();
        sharedRecord.setDestroyCallback(()=>{
            this.gameData.getGameOpenUiStatus().cancelRecord();
        })

        if (this.gameData.isFirstEnter()){
            this.gameData.saveFistEnter();
            sharedRecord.showFirstEnterTips(5.0);
        }

        this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    }
}
