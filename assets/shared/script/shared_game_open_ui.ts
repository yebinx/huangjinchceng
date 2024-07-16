import { Component, Prefab, _decorator, instantiate, Node, game, isValid } from "cc";
import { l10n } from "../../../extensions/localization-editor/static/assets/l10n";
import { Emitter } from "../../shared/script/lib/Emitter";
import { IAudio, IGame } from "./interface";
import { SharedConfig } from "./config/shared_config";
import { EMIT_BALANCE_OPEN, EMIT_EXIT_GAME_OPEN, EMIT_HEART_BEAT_TIME_OUT, EMIT_INSUFFICIENT_BALANCE_TIPS, EMIT_RATE_RULE_OPEN, EMIT_REQUEST_FAIL_RETRY, EMIT_RESPONE_ERROR_CODE, EMIT_SCORE_BET, EMIT_SCORE_GET, EMIT_SCORE_TOTAL, EMIT_SETTING_ADD_BET, EMIT_SETTING_BET_OPEN, EMIT_SETTING_MINUS_BET, EMIT_SETTING_OPEN_START, EMIT_SETTING_QUICK, EMIT_SETTING_START_OPEN, EMIT_SHOW_NOTICE_INFO, EMIT_UPDATA_AUTO_START_TIMES, EMIT_VIEW_RESIZE_FLUSH } from "./config/shared_emit_event";
import { SharedSettingBet } from "./shared_setting/shared_setting_bet";
import { SharedAdaptation } from "./shared_adaptation/shared_adaptation";
import { SharedSettingAutoStart } from "./shared_setting/shared_setting_auto_start";
import { SharedSettingBalance } from "./shared_setting/shared_setting_balance";
import { I_EMIT_SCORE_BET, I_EMIT_SCORE_GET } from "./config/shared_emit_interface";
import { SharedNoticeBox } from "./commom/shared_notice_box";
import { SharedRetryNotice } from "./commom/shared_retry_notice";
import { SharedNormalQuickTips } from "./commom/shared_normal_quick_tips";
import { SharedNoticeBar2 } from "./commom/shared_notice_bar2";
import { SystemEx } from "./lib/SystemEx";
const { ccclass, property } = _decorator;

@ccclass('SharedGameOpenUi')
export class SharedGameOpenUi extends Component {
    @property({type:Node})
    ndPopLayer:Node // 弹窗层

    @property({type:Node})
    ndMiddleLayer:Node // 中间层，比弹窗低

    @property({type:Node})
    ndNormalQuickTipsLayer:Node; // 快速旋转提示显示位置

    @property({type:Prefab})
    sharedGameRule:Prefab  // 游戏规则

    @property({type:Prefab})
    sharedGameRate:Prefab;  // 游戏赔率

    // @property({type:Prefab})
    // sharedRecord:Prefab // 历史记录

    @property({type:Prefab})
    sharedSettingAutoStart:Prefab // 设置自动开始次数

    @property({type:Prefab})
    sharedSettingBet:Prefab // 设置自动投注

    @property({type:Prefab})
    sharedSettingBalance:Prefab // 设置余额

    @property({type:Prefab}) // 提示框
    sharedNoticeBox:Prefab;

    @property({type:Prefab})
    sharedRetryNotice:Prefab; // 重试提示条

    @property({type:Prefab})
    sharedNormalQuickTips:Prefab; // 更改极速旋转提示

    @property({type:Prefab})
    sharedNoticeBar2:Prefab; // 提示条

    private game:IGame = null;
    private audio:IAudio = null;
    private emitter:Emitter;

    private currentSharedNoticeBar2:SharedNoticeBar2 = null;
    private currentSharendNormalQuickTips:SharedNormalQuickTips = null;
    private insufficientBanlance:SharedNoticeBox  = null; // 余额不足提示
    private errCode:SharedNoticeBox  = null;
    private currentRetryNotice:SharedRetryNotice = null;

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);
    }

    setEmitter(emitter:Emitter){this.emitter = emitter;}
    setAudio(audio: IAudio){this.audio = audio;}
    setGame(game:IGame){this.game = game;}

    register(){
        this.emitter.addEventListener(EMIT_SETTING_ADD_BET, this.onEmitSettingAddBet, this);
        this.emitter.addEventListener(EMIT_SETTING_MINUS_BET, this.onEmitSettingMinusBet, this);
        this.emitter.addEventListener(EMIT_SETTING_QUICK, this.onEmitSettingQuick, this);
        this.emitter.addEventListener(EMIT_SETTING_BET_OPEN, this.onEmitOpenSettingBet, this);
        this.emitter.addEventListener(EMIT_SETTING_START_OPEN, this.onEmitOpenSettingAutoStart, this);
        // this.emitter.addEventListener(EMIT_GAME_HISTORY_OPEN, this.onEmitOpenGameHistory, this);
        this.emitter.addEventListener(EMIT_HEART_BEAT_TIME_OUT, this.onEmitHeartbeatTimeOut, this);
        this.emitter.addEventListener(EMIT_EXIT_GAME_OPEN, this.onEmitExitGame, this);
        this.emitter.addEventListener(EMIT_BALANCE_OPEN, this.onEmitBalanceOpen, this);
        this.emitter.addEventListener(EMIT_RESPONE_ERROR_CODE, this.onEmitResponeErrorCode, this);
        this.emitter.addEventListener(EMIT_INSUFFICIENT_BALANCE_TIPS, this.onEmitInsufficientBanlanceTips, this);
        this.emitter.addEventListener(EMIT_REQUEST_FAIL_RETRY, this.onEmitRequestFailRetry, this);
        this.emitter.addEventListener(EMIT_SHOW_NOTICE_INFO, this.onEmitShowNoticeInfo, this);
        
    }

    // 增加投注
    private onEmitSettingAddBet(){
        if (!this.game.isGameFreeStatus()){
            return 
        }

        let emitArgs:I_EMIT_SCORE_BET = {isAction: true}
        if (!this.game.addBetLevel()){
            this.emitter.emit(EMIT_SHOW_NOTICE_INFO, l10n.t("shared_setting_bet_max_bet"))
        }else{
            emitArgs.isChange = true;
        }

        emitArgs.totalBet = SharedConfig.ScoreFormat(this.game.getTotalBet());

        this.emitter.emit(EMIT_SCORE_BET, emitArgs);
    }

    // 减少投注
    private onEmitSettingMinusBet(){
        if (!this.game.isGameFreeStatus()){
            return 
        }

        let emitArgs:I_EMIT_SCORE_BET = {isAction: true}
        if (!this.game.minusBetLevel()){
            this.emitter.emit(EMIT_SHOW_NOTICE_INFO, l10n.t("shared_setting_bet_min_bet"))
        }else{
            emitArgs.isChange = true;
        }

        emitArgs.totalBet = SharedConfig.ScoreFormat(this.game.getTotalBet());

        this.emitter.emit(EMIT_SCORE_BET, emitArgs);
    }

    // 正常模式和极速模式切换
    private onEmitSettingQuick(isQuick: boolean){
        if (isValid(this.currentSharedNoticeBar2)){
            this.currentSharedNoticeBar2.destroySelf();
            this.currentSharedNoticeBar2 = null;
        }

        if (!isValid(this.currentSharendNormalQuickTips)){
            let nd = instantiate(this.sharedNormalQuickTips);
            nd.parent = this.ndNormalQuickTipsLayer;
            this.currentSharendNormalQuickTips = nd.getComponent(SharedNormalQuickTips);
        }

        this.currentSharendNormalQuickTips.setInfo(isQuick)
    }

    // 显示提示信息条
    private onEmitShowNoticeInfo(info: string){
        if (isValid(this.currentSharendNormalQuickTips)){
            this.currentSharendNormalQuickTips.destroySelf();
            this.currentSharendNormalQuickTips = null;
        }

        if (!isValid(this.currentSharedNoticeBar2)){
            let nd = instantiate(this.sharedNoticeBar2);
            nd.parent = this.ndNormalQuickTipsLayer;
            this.currentSharedNoticeBar2 = nd.getComponent(SharedNoticeBar2);
        }

        this.currentSharedNoticeBar2.setInfo(info)
    }
  
    // 打开投注设置页面
    private onEmitOpenSettingBet(){
        if (!this.game.isGameFreeStatus()){
            return 
        }

        let nd = instantiate(this.sharedSettingBet)
        let settingBet = nd.getComponent(SharedSettingBet);
        settingBet.setEmitter(this.emitter);
        settingBet.register();
        settingBet.setLine(this.game.getBaseBet())
        settingBet.setBetData(this.game.getBaseBetList());
        settingBet.setMultipleData(this.game.getMultipleBetList());
        settingBet.setCallback((baseBetIdx:number, multipleIdx:number)=>{
            this.game.setBaseBetIndex(baseBetIdx);
            this.game.setMultipleBetIndex(multipleIdx);
            this.emitter.emit(EMIT_SCORE_BET, {totalBet: SharedConfig.ScoreFormat(this.game.getTotalBet()), isAction: true, isChange: true} as I_EMIT_SCORE_BET);
        })
        settingBet.setDestroyCallback(()=>{
            this.game.cancelBetSetting();
        })
        nd.parent = this.ndPopLayer
        settingBet.flush(this.game.getBaseBetIndex(), this.game.getMultipleBetIndex());

        this.game.addBetSetting()
        this.emitter.emit(EMIT_SCORE_BET, {totalBet: SharedConfig.ScoreFormat(this.game.getTotalBet()), isChange: false, isAction:false});
        this.emitter.emit(EMIT_SCORE_TOTAL,  SharedConfig.ScoreFormat(this.game.getBalance()));
        this.emitter.emit(EMIT_SCORE_GET,  {score: this.game.getSpinWin(), action:false} as I_EMIT_SCORE_GET );
        this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    }

    // 打开设置旋转次数页面
    private onEmitOpenSettingAutoStart(){
        let nd = instantiate(this.sharedSettingAutoStart);
        let settingAutoStart = nd.getComponent(SharedSettingAutoStart);
        settingAutoStart.setEmitter(this.emitter);
        settingAutoStart.register();
        settingAutoStart.setAutoStartCallback((selectTimes: number)=>{
            this.game.setAutoStartTimes(selectTimes);
            this.emitter.emit(EMIT_UPDATA_AUTO_START_TIMES, this.game.getAutoStartTimes());
            this.emitter.emit(EMIT_SETTING_OPEN_START, this.game.getAutoStartTimes());
        })
        settingAutoStart.setDestroyCallback(()=>{
            this.game.cancelAutoSpinSetting();
        })

        nd.parent = this.ndPopLayer;

        this.game.addAutoSpinSetting()
        this.emitter.emit(EMIT_SCORE_BET, {totalBet: SharedConfig.ScoreFormat(this.game.getTotalBet()), isAction:false, isChange:false} as I_EMIT_SCORE_BET);
        this.emitter.emit(EMIT_SCORE_TOTAL,  SharedConfig.ScoreFormat(this.game.getBalance()));
        this.emitter.emit(EMIT_SCORE_GET, {score:this.game.getSpinWin(), action: false} as I_EMIT_SCORE_GET);
        this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    }

    // // 打开历史记录
    // private onEmitOpenGameHistory(){
    //     if (!this.game.isGameFreeStatus()){
    //         return 
    //     }

    //     let nd = instantiate(this.sharedRecord);
    //     nd.parent = this.ndPopLayer;

    //     let record = nd.getComponent(SharedRecord);
    //     record.setEmitter(this.emitter);
    //     record.register();
    //     record.showLoadingTips();
    //     this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    // }

    // 打开余额
    private onEmitBalanceOpen(){
        let nd = instantiate(this.sharedSettingBalance);
        let sharedSettingBalance = nd.getComponent(SharedSettingBalance);
        sharedSettingBalance.setEmitter(this.emitter);
        sharedSettingBalance.setAudio(this.audio);
        sharedSettingBalance.register();
        sharedSettingBalance.setMoneyBag(SharedConfig.ScoreFormat(this.game.getBalance()))
        sharedSettingBalance.setDestroyCallback(()=>{
            this.game.cancelMoneyBag();
        })
        
        nd.parent = this.ndPopLayer;
        this.game.addMoneyBag();
    }

    // 心跳超时提示
    private onEmitHeartbeatTimeOut(){
        let nd = instantiate(this.sharedNoticeBox);
        nd.parent = this.ndPopLayer;
        let noticeBox = nd.getComponent(SharedNoticeBox);
        noticeBox.setInfo(l10n.t("shared_title_tips"), l10n.t("shared_note_heart_beat_time_out"), l10n.t("shared_title_reload"), l10n.t("shared_title_exit_game"));
        noticeBox.setClickCallback(
        ()=>{
            this.game.cancelPopBox();
            SystemEx.restart();
        },
        ()=>{
            this.game.cancelPopBox();
            SystemEx.gameEnd();
        });
        this.audio.playOpenMenu();
        this.game.addPopBox();
    }

    // 退出游戏
    private onEmitExitGame() {
        let nd = instantiate(this.sharedNoticeBox);
        nd.parent = this.ndPopLayer;
        let noticeBox = nd.getComponent(SharedNoticeBox);
        noticeBox.setInfo(l10n.t("shared_title_tips"), l10n.t("shared_exit_game_tips_content"), l10n.t("shared_title_cancel"), l10n.t("shared_btn_success"));
        noticeBox.setClickCallback(
        ()=>{
            this.game.cancelPopBox();
        },
        ()=>{
            this.game.cancelPopBox();
            SystemEx.gameEnd();
        });
        this.audio.playOpenMenu();
        this.game.addPopBox();
    }

    // 错误码提示
    private onEmitResponeErrorCode(track: string){
        if (!isValid(this.errCode)){
            let nd = instantiate(this.sharedNoticeBox);
            nd.parent = this.ndPopLayer;
            this.errCode = nd.getComponent(SharedNoticeBox);
            this.audio.playOpenMenu();
        }
        
        this.errCode.setInfo(l10n.t("shared_note_title_transaction_fail"), "", l10n.t("shared_title_reload"), l10n.t("shared_btn_exit"));
        this.errCode.setContent(`${l10n.t("shared_note_title_transaction_fail")}. (${track})`);
        this.errCode.setClickCallback(
        ()=>{
            this.game.cancelPopBox();
            this.errCode = null;
            SystemEx.restart();
        },
        ()=>{
            this.game.cancelPopBox();
            this.errCode = null;
            
        });

        this.game.addPopBox();
    }

    // 金币不足提示
    private onEmitInsufficientBanlanceTips(money:number){
        if (this.insufficientBanlance){ // 多次点击开始，可能是空格
            return 
        }

        let nd = instantiate(this.sharedNoticeBox);
        nd.parent = this.ndPopLayer;
        let noticeBox = nd.getComponent(SharedNoticeBox);
        noticeBox.setInfo(l10n.t("shared_note_title_transaction_fail"), "", "", "");
        noticeBox.showSuccess();
        noticeBox.setContent(`${l10n.t("shared_insufficient_balance_tips")}[${SharedConfig.ScoreFormat(money)}]`)
        noticeBox.setClickCallback(
        ()=>{
            this.game.cancelPopBox();
            this.insufficientBanlance = null;
        },
        ()=>{
            this.game.cancelPopBox();
            this.insufficientBanlance = null;
        });

        this.insufficientBanlance = noticeBox;
        this.audio.playOpenMenu();
        this.game.addPopBox();
    }

    // 失败重试提示
    private onEmitRequestFailRetry(times: number){
        if (!times){
            if (this.currentRetryNotice != null){
                this.currentRetryNotice.destroySelf();
                this.currentRetryNotice = null;
            }

            return 
        }

        if (!this.currentRetryNotice){
            let nd = instantiate(this.sharedRetryNotice);
            nd.parent = this.ndMiddleLayer;
    
            let adaptation = nd.getComponent(SharedAdaptation);
            adaptation.setEmitter(this.emitter);
            adaptation.register();
            this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);

            this.currentRetryNotice = nd.getComponent(SharedRetryNotice);
        }
       
        this.currentRetryNotice.setTimes(times);
    }
}
