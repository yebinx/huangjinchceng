import { _decorator, Button, Component, EventKeyboard, EventTouch, Game, game, input, Input, instantiate, isValid, KeyCode, Node,  Prefab, Sprite,  Tween,  UITransform, Vec3 } from 'cc';
import { Roll } from './roll/roll';
import { Bigwin, BigwinType } from './big_win/big_win';
import { BonusEnter } from './bonus/bonus_enter';
import { BonusResult } from './bonus/bonus_result';
import { Infoframe } from './game/info_frame';
import Cell from './roll/cell';
import { SymbolInfo } from './symbol_info/symbol_info';
import { MultipleTitle } from './multiple_title/multiple_title';
import { ColScatterEffect } from './scatter_effect/col_scatter_effect';
import { FreeTimes } from './game/free_times';
import { GameData } from './game_date/game_data';
import { HeartBeat } from './heart_beat/heart_beat';
import { AddFreePlay } from './add_free_play/add_free_play';
import {Audio} from "./sound/audio"
import { Emitter } from '../../shared/script/lib/Emitter';
import { PromiseEx } from '../../shared/script/lib/PromiseEx';
import { TweenEx } from '../../shared/script/lib/TweenEx';
import { COLUMN_COUNT, COLUMN_HORIZONTAL, COLUMN_LAST_IDX, MultipleBonus, MultipleNormal, NORMAL_START_SCROLL_INTERVAL, NORMAL_STOP_SCROLL_INTERVAL, SCATTER_BONUS_NEED, SCORE_MULTIPLE } from './config/game_config';
import { SystemEx } from '../../shared/script/lib/SystemEx';
import { SharedConfig } from '../../shared/script/config/shared_config';
import { EMIT_BTN_STAR, EMIT_BTN_STOP, EMIT_COLUME_DONE, EMIT_COLUME_DONE_BEFORE, EMIT_GAME_START, EMIT_INSUFFICIENT_BALANCE_TIPS, EMIT_REQ_GAME_RECORD, EMIT_REQ_GAME_RECORD_RETRY, EMIT_REQ_RECORD_DETAIL, EMIT_REQ_RECORD_DETAIL_RETRY, EMIT_SCORE_BET, EMIT_SCORE_GET, EMIT_SCORE_TOTAL, EMIT_SETTING_OPEN_START, EMIT_SETTING_QUICK, EMIT_SWITCH_AUDIO, EMIT_UPDATA_AUTO_START_TIMES, EMIT_VIEW_RESIZE, EMIT_VIEW_RESIZE_FLUSH } from '../../shared/script/config/shared_emit_event';
import { SharedGameOpenUi } from '../../shared/script/shared_game_open_ui';
import { GameImplement } from './game';
import { EMIT_COLUME_START, EMIT_RECEIVE_RESULT, EMIT_SYMBOL_INFO_OPEN, EMIT_UPDATE_FREE_TIMES } from './config/emit_event';
import { SharedUserInfo } from '../../shared/script/shared_user_info/shared_user_info';
import { I_EMIT_SCORE_BET, I_EMIT_SCORE_GET } from '../../shared/script/config/shared_emit_interface';
import { GameOpenUi } from './game_open_ui';
import { BtnList } from './btn_list/btn_list';
import { NodeEx } from '../../shared/script/lib/NodeEx';
import { DustLayer } from './dust/dust_layer';
import { MultipleLine } from './multiple_line/multiple_line';
import { ConfigMethod } from './config/config_method';
import { IconFrame, TRemoveList } from '../proto/base';
import { RemoveEffectLayer } from './xiaochu/remove_effect_layer';
import { RandomSymbolLayer } from './random_symbol/random_symbol_layer';
import { GameBackgroundList } from './game/game_background_list';
import { BuyBonusButton } from './buy_bonus/buy_bonus_button';
import { TProtoGoldenCityBetType } from '../proto/v1.goldencity.bet';
import { ScatterWaitOneLayer } from './scatter_effect/scatter_wait_one_layer';
import { EventAfter } from '../../shared/script/lib/event_after_callback';
import { AudioSwitchType } from '../proto/v1.goldencity.mute';
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {
    emitter:Emitter = new Emitter();
    gameData:GameData = new GameData()
    game = new GameImplement();

    @property({type:[Roll]})
    szRoll:Roll[] = []; // 滚动列，从左到右边

    @property({type:ColScatterEffect}) 
    colScatterEffect:ColScatterEffect = null; // 即将出现第四个scatter特效

    @property({type:SharedUserInfo}) 
    userInfo:SharedUserInfo = null;

    @property({type:MultipleTitle})
    multipleTitle:MultipleTitle;

    @property({type:MultipleLine})
    multipleLine:MultipleLine;

    @property({type:Infoframe})
    infoframe:Infoframe

    @property({type:BtnList})
    btnList:BtnList

    @property({type:DustLayer})
    dustLayer:DustLayer;// 掉落灰尘效果层

    @property({type:HeartBeat})
    heartbeat:HeartBeat; // 心跳时间检查

    @property({type:SharedGameOpenUi})
    sharedGameOpenUi:SharedGameOpenUi;

    @property({type:GameOpenUi})
    gameOpenUi:GameOpenUi;

    @property({type:RemoveEffectLayer})
    removeEffectLayer:RemoveEffectLayer;

    @property({type:RandomSymbolLayer})
    randomSymbolLayer:RandomSymbolLayer;

    @property({type:GameBackgroundList})
    gameBackgroundList:GameBackgroundList;

    @property({type:ScatterWaitOneLayer})
    scatterWaitOneLayer:ScatterWaitOneLayer;

    @property({type:Node}) 
    spColScatterEffectLayer:Node; // scatter层

    @property({type:Node}) 
    spColScatterEffectRoll:Node; // scatter层

    @property({type:Sprite}) 
    spRoundRewardLayer:Sprite; // 每轮开奖灰色层

    @property({type:Node}) 
    ndSymbolRewardLayer:Node; // 符号开奖切换层

    @property({type:Node}) 
    ndScatterStopLayer:Node; // 夺宝符号停止后，切换的图层

    @property({type:Node}) 
    ndScatterStopLayerLeftRight:Node; // 夺宝符号停止后，切换的图层, 第1轴和最后轴

    @property({type:Node})
    ndTopEffectLayer:Node // 游戏特效层

    @property({type:Node})
    ndPopLayer:Node // 弹窗层

    @property({type:Button})
    btnTouchStop:Button; // 开奖后点击旋转区需要停止

    @property({type:Node})
    ndSymbolInfoLayer:Node // 符号信息层

    @property({type:Node})
    ndSymbolInfoLayer2:Node // 符号信息层2

    @property({type:Node})
    ndBottomContent:Node // 底部按钮列表
    
    @property({type:BuyBonusButton})
    buyBonusButton:BuyBonusButton; // 购买彩金按钮

    @property({type:Prefab}) 
    symbolInfo:Prefab // 符号信息

    @property({type:Prefab})
    freeTimes:Prefab // 免费次数

    @property({type:Prefab})
    bigWin:Prefab; // 大奖表现

    @property({type:Prefab})
    addFreePlay:Prefab; // 增加免费次数表现

    @property({type:Prefab})
    bonusEnter:Prefab;// 免费次数进入页面

    @property({type:Prefab})
    bonusResult:Prefab; // 免费次数结算

    @property({type:Prefab})
    clickEffect:Prefab; // 点击特效

    private offsetY:number;// 适配参数
    private limitOffsetY:number;// 适配参数

    private delayStartReset: boolean = false;// 一些ui要在开始的时候才重置，比如倍数和跑马灯
    private currSymbolInfo:SymbolInfo = null;// 当前是否打开符号列表
    private currFreeTimes:FreeTimes = null;// 免费次数
    private clientRoundId:number = null;
    private lastStopRoll:number = -1; // 最后停止的轴

    private delaySetAudio:Tween<Node> = null;
    private lastAudioSwitch: boolean = false; // 最后的音效开关状态

    onLoad(){
        // 初始化组件顺序

        this.gameData.parserData(this.node);
        this.game.setGameData(this.gameData);
        this.game.setGameCtrl(this);

        // init gamedata
        this.heartbeat.setGameData(this.gameData);
        this.gameOpenUi.setGameData(this.gameData);

        // init game
        this.sharedGameOpenUi.setGame(this.game);
        this.btnList.setGame(this.game);

        // init emitter 
        this.gameData.setEmitter(this.emitter);
        this.userInfo.setEmitter(this.emitter);
        this.infoframe.setEmitter(this.emitter);
        this.btnList.setEmitter(this.emitter);
        this.heartbeat.setEmitter(this.emitter);
        this.sharedGameOpenUi.setEmitter(this.emitter);
        this.gameOpenUi.setEmitter(this.emitter);

        // register emit
        this.userInfo.register();
        this.btnList.register();
        this.sharedGameOpenUi.register();
        this.gameOpenUi.register();
        this.register();

        this.szRoll.forEach((v:Roll, k: number)=>{
            v.setEmitter(this.emitter);
            v.setHorizontal(k == COLUMN_HORIZONTAL);
            v.setScatterColumn(!(k != 1 && k != COLUMN_LAST_IDX))
            v.setColumnValue(k);
            v.setRealCellIdx(0);
            v.setShowColNum(k == COLUMN_HORIZONTAL ? 4 : 5);
            v.setGrayLayer(this.ndSymbolRewardLayer);
            v.setScatterStopLayer(k == 1 || k == COLUMN_LAST_IDX ? this.ndScatterStopLayerLeftRight : this.ndScatterStopLayer);
            v.setScatterLayer(this.spColScatterEffectRoll);
            v.setRemoveEffectLayer(this.removeEffectLayer);
            v.setRandomSymbolLayer(this.randomSymbolLayer);
            v.addCellClick();
        });

        // do other
        this.btnList.setCancelAutoStartCb(this.onCbCancelAutoStart.bind(this));
        this.btnList.setCheckTouchSpaceKeyboard(()=>{
            return this.gameData.getGameKeyBoared().isOnlyTouch();
        })
    }

    start() {
        this.lastAudioSwitch = this.gameData.getAudioSwitch();
        Audio.i.setAudio(this.lastAudioSwitch);
        this.sharedGameOpenUi.setAudio(Audio.i);
        this.touchStopEnable(false);
        this.spRoundRewardLayer.node.active = false;
        this.spColScatterEffectLayer.active = false;

        let szRollPos = this.szRoll.map((value: Roll, index: number)=>{
            let pos = value.getWorldPosition();
            return this.colScatterEffect.getComponent(UITransform).convertToNodeSpaceAR(pos)
        })

        this.colScatterEffect.setRollPosition(szRollPos);
        
        let defaultSymbol = this.gameData.getDefaultSymbol();
        this.szRoll.forEach((v, k)=>{
            v.defaultSymbol(defaultSymbol[k]);
            v.setDustLayer(this.dustLayer);
        })

        this.multipleLine.setLine(ConfigMethod.getLines(defaultSymbol, defaultSymbol.length));
        let tdata = {totalBet: SharedConfig.ScoreFormat(this.gameData.getBetAllLine()), isChange: true, isAction:false} as I_EMIT_SCORE_BET;
        this.emitter.emit(EMIT_SCORE_BET,tdata );
        this.emitter.emit(EMIT_SCORE_TOTAL, SharedConfig.ScoreFormat(this.gameData.getBalance()));
        this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    }

    StartAfter(){
        this.continueBonusGame()
    }

    // 通过管理，控制roll的更新，保证roll是按照轴顺序更新，如果是每轴都一个update，会造成乱序
    protected lateUpdate(dt: number): void {
        this.szRoll.forEach((roll)=>{
            roll.updateTick(dt)
        })
    }

    protected onDestroy(): void {
    }

    // 适配
    private onViewResize(offsetY:number, limitOffsetY:number){
        this.offsetY = offsetY;
        this.limitOffsetY = limitOffsetY;
        this.emitter.emit(EMIT_VIEW_RESIZE, offsetY, limitOffsetY);
    }

    private register(){
        if (this.node["splash"]){
            this.offsetY = this.node["offset_y"];
            this.limitOffsetY = this.node["limit_offset_y"];
            let splash = this.node["splash"] as Node; // 监听底图适配
            splash.on("view_resize", this.onViewResize, this);
            this.emitter.addEventListener(EMIT_VIEW_RESIZE_FLUSH, this.onEmitViewResizeFlush, this)
        }
        
        game.on(Game.EVENT_HIDE, this.onEventHide, this)
        game.on(Game.EVENT_SHOW, this.onEventShow, this)
        this.node.on(EventAfter.START_AFTER, this.StartAfter, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyboard, this);
        input.on(Input.EventType.KEY_UP, this.onKeyboard, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKeyboard, this);
        
        this.emitter.addEventListener(EMIT_BTN_STAR, this.onEmitStar, this);
        this.emitter.addEventListener(EMIT_BTN_STOP, this.onEmitStop, this);
        this.emitter.addEventListener(EMIT_COLUME_START, this.onEmitColumeStart, this);
        this.emitter.addEventListener(EMIT_COLUME_DONE, this.onEmitColumeDone, this);
        this.emitter.addEventListener(EMIT_COLUME_DONE_BEFORE, this.onEmitColumeDoneBefore, this);
        this.emitter.addEventListener(EMIT_RECEIVE_RESULT, this.onEmitReceiveData, this);
        this.emitter.addEventListener(EMIT_SETTING_OPEN_START, this.onEmitSettingOpenStart, this);
        this.emitter.addEventListener(EMIT_SYMBOL_INFO_OPEN, this.onEmitOpenSymbolInfo, this);
        this.emitter.addEventListener(EMIT_REQ_GAME_RECORD, this.onEmitReqGameRecord, this);
        this.emitter.addEventListener(EMIT_REQ_GAME_RECORD_RETRY, this.onEmitReqGameRecordRetry, this);
        this.emitter.addEventListener(EMIT_REQ_RECORD_DETAIL, this.onEmitReqRecordDetail, this);
        this.emitter.addEventListener(EMIT_REQ_RECORD_DETAIL_RETRY, this.onEmitReqRecordDetailRetry, this);
        this.emitter.addEventListener(EMIT_SETTING_QUICK, this.onEmitSettingQuick, this);
        this.emitter.addEventListener(EMIT_SCORE_BET, this.onEmitScoreBet, this);
        this.emitter.addEventListener(EMIT_SWITCH_AUDIO, this.onEmitSwitchAudio, this);
    }

    // 有免费游戏则继续
    private continueBonusGame(){
        if (this.gameData.getFreeTimes() > 0) {
            this.emitter.emit(EMIT_SCORE_GET, {score: this.gameData.getFreeTimesTotalWin(), action: false} as I_EMIT_SCORE_GET);
            this.infoframe.reset(true)
            this.enterFreeGmae();
            this.scheduleOnce(()=>{this.onEmitStar();}, 1.5)
            Audio.i.playBonusBgm();
        }
    }

    // 更新开奖数据
    private updateRollResult(col:number) {
        this.szRoll[col].setResult(this.gameData.getRollData(this.gameData.getResultIdx(), col), this.gameData.getGameStatusType().isSnapeDoneSetting());
    }

    // 关闭符号信息提示
    private closeSymbolInfo() {
        if (!isValid(this.currSymbolInfo)){
           return 
        }
        this.currSymbolInfo.destroySelf();
        this.currSymbolInfo = null;
    }

    // 每一轮的开奖
    private async doRoundReward(){
        let resultIdx = this.gameData.getResultIdx();
        this.emitter.emit(EMIT_SCORE_GET, {score: this.gameData.getFreeTimesTotalWinBefore() + this.gameData.getTotalWin(resultIdx), action: true} as I_EMIT_SCORE_GET);
        this.infoframe.showScore(this.gameData.getRoundWin(resultIdx), this.gameData.getTotalWin(resultIdx) / this.gameData.getBaseBet(), this.gameData.getCurrentMultiple(),  false);
        this.multipleTitle.playScaleBonus();

        this.playRewardGrayShow();
        this.updateFrameChange();
        // await PromiseEx.CallDelayOnly(0.1);
        
        let szWinIdx = this.szRoll.map((roll:Roll, k:number)=>{
            return this.gameData.getRewardIdx(resultIdx, k);
        })

        let winNeighbor = this.gameData.getWinNeighbor(resultIdx);

        await PromiseEx.CallDelayOnly(0);

       
        let waitRandomSymbol: number = 0; // 等待符号转换
        // 播放转换效果
        this.szRoll.forEach((roll:Roll, k:number)=>{
            if (szWinIdx[k] == null || szWinIdx[k].length == 0){
                return 
            }
            waitRandomSymbol |= roll.playReward(szWinIdx[k]);
        })

        Audio.i.playMultiple(this.gameData.getCurrentMultiple());
        this.gameData.setNextMultiple();

        await PromiseEx.CallDelayOnly(0.0);
        this.szRoll.forEach((roll:Roll, k:number)=>{
            roll.playNeighbor(winNeighbor[k]);
        })

        await PromiseEx.CallDelayOnly(0.20);
        Audio.i.playSymbolBoom();

        await PromiseEx.CallDelayOnly(0.1);
       
        if (!!waitRandomSymbol){
            Audio.i.playRandomSymbol();
        }

        await PromiseEx.CallDelayOnly(0.18);
        this.removeEffectLayer.clearNeighborLight();

        await PromiseEx.CallDelayOnly(0.22);
        this.playRewardGrayHide()

        await PromiseEx.CallDelayOnly(0.95);
        if (!!waitRandomSymbol){
            Audio.i.stopRandomSymbol();
        }

        Audio.i.playAddMultiple();
        this.multipleTitle.setNextMultiple(this.gameData.getCurrentMultiple());

        await PromiseEx.CallDelayOnly(0.55); // 总共动画2.23,但是不能等待播放完成

        if (!!waitRandomSymbol){ // 等待转换效果，从0.5开始， 总共2.0, 确认0.53
            await PromiseEx.CallDelayOnly(0.405);
        }

        this.doFillSymbol();
    }

    // 更新框转换的数据
    private updateFrameChange(){
        let dataMap = this.gameData.getFrameChange(this.gameData.getResultIdx());
        dataMap.forEach((dataList, roll)=>{
            dataList.forEach(data => {
                if (data.goldenid < IconFrame.SILVERFRAME){ // 金转百搭
                    this.szRoll[roll].setCellChangeSymbolData(data.silverindex, data.goldenid + IconFrame.WILDFRAME)
                }else{
                    this.szRoll[roll].setCellChangeSymbolData(data.silverindex, data.goldenid)
                }
            });
        })
    }

    // 播放夺宝
    private async doGetScatter(){
        let szScatterIdx = this.gameData.getScatterIdxDropAfter(this.gameData.getResultIdx());
        // this.playRewardGrayShow();
        this.szRoll.forEach((roll:Roll, k:number)=>{
            if (szScatterIdx[k] == null || szScatterIdx[k].length == 0){
                return 
            }
            let szCell = roll.playScatterWaitOne(szScatterIdx[k], 1.5);
            this.scatterWaitOneLayer.playWaitOne(szCell); // 等待进入夺宝页面出现后在隐藏
        })

        Audio.i.playScatterBonus();
        await PromiseEx.CallDelayOnly(1.5)
        // this.playRewardGrayHide()
    }

    private playRewardGrayShow(){
        this.spRoundRewardLayer.node.active = true;
        TweenEx.FadeIn(this.spRoundRewardLayer, 0.2, "quintOut").start();
    }

    private playRewardGrayHide(){
        TweenEx.FadeOut(this.spRoundRewardLayer, 0.2, null, ()=>{
            this.spRoundRewardLayer.node.active = false;
        }).start();
    }

    private fillSymbol(col: number, emptyDrop: boolean, step: number){
        let resultIdx = this.gameData.getResultIdx();
        let szIdx = this.gameData.getRewardIdxFilterWild(resultIdx, col);
        if (szIdx == null || szIdx.length == 0){
            return false;
        }

        if (emptyDrop){
            if (step == 0){
                return this.szRoll[col].playFillEmptySymbol(szIdx); // 只掉落，不填充
            }else{
                this.szRoll[col].playFillNewSymbol(this.gameData.getDropData(resultIdx, col).length,  this.gameData.getRollData(resultIdx + 1, col)); // 填充之前掉落的
            }
        }else{
            this.szRoll[col].playFillSymbol(szIdx, this.gameData.getDropData(resultIdx, col).length,  this.gameData.getRollData(resultIdx + 1, col)); // 播放掉落
        }

        return true
    }

    // 掉落下来还要播放放大效果
    private playScaleBounce(){
        let resultIdx = this.gameData.getResultIdx();
        let szScatterIdx = this.gameData.getScatterIdxDropAfter(resultIdx);
        for (let col=COLUMN_HORIZONTAL; col<COLUMN_COUNT; col++){
            if (szScatterIdx[col].length == 0){
                continue
            }
            this.szRoll[col].playScatterScaleBounce(szScatterIdx[col]);
        }
    }

    // 填充消除的格子
    private async doFillSymbol(){
        // 只要3个scatter才会播放掉落效果，已经满足夺宝的，使用正常掉落
        if (this.gameData.getScatterCount(this.gameData.getResultIdx(), COLUMN_LAST_IDX) == SCATTER_BONUS_NEED - 1){
            // 1.存在的符号先掉落
            // 2.然后播放夺宝效果，
            // 3.横轴先掉落，在从左往右掉落
            Audio.i.resetStopIdx()
            this.fillSymbol(COLUMN_HORIZONTAL, true, 0);
            for (let i=COLUMN_LAST_IDX; i>=COLUMN_HORIZONTAL; i--){
                if (this.fillSymbol(i, true, 0)){
                    Audio.i.playStopRoll(true)
                    await PromiseEx.CallDelayOnly(NORMAL_STOP_SCROLL_INTERVAL)
                }
            }

            this.infoframe.playOneMoreScatter();
            await PromiseEx.CallDelayOnly(0.4);
            this.playRewardGrayShow();

            let szScatterIdx = this.gameData.getScatterIdxDropAfter(this.gameData.getResultIdx());
            this.szRoll.forEach((roll:Roll, k:number)=>{
                if (szScatterIdx[k].length == 0){return};
                let szCell = roll.playScatterWaitOne(szScatterIdx[k], 2.5);
                this.scatterWaitOneLayer.playWaitOne(szCell);
            })

            for (let i=0; i<3; i++){// 播放3声
                Audio.i.playWaitOneScatter()
                await PromiseEx.CallDelayOnly(0.7)
            }
            
            await PromiseEx.CallDelayOnly(0.2); // 等待夺宝特效
            this.playRewardGrayHide();
            await PromiseEx.CallDelayOnly(0.2); // 等待夺宝特效

            Audio.i.resetStopIdx()
            this.fillSymbol(COLUMN_HORIZONTAL, true, 1);
            for (let i=COLUMN_HORIZONTAL+1; i<COLUMN_COUNT; i++){
                if (this.fillSymbol(i, true, 1)){
                    await PromiseEx.CallDelayOnly(0.1) // 等待符号动画掉落
                    this.playScaleBounce();
                    Audio.i.playStopRoll(true)
                    await PromiseEx.CallDelayOnly(0.4)
                }
            }

            this.infoframe.stopOneMoreScatter();
            this.scatterWaitOneLayer.clear();
        }else{// 普通掉落填充
            Audio.i.resetStopIdx()
            this.fillSymbol(COLUMN_HORIZONTAL, false, null);
            for (let i=COLUMN_LAST_IDX; i>COLUMN_HORIZONTAL; i--){
                if (this.fillSymbol(i, false, null)){
                    Audio.i.playStopRoll(true)
                    await PromiseEx.CallDelayOnly(NORMAL_STOP_SCROLL_INTERVAL)
                }
            }
        }

        this.gameData.addResultIdx();
        
        this.multipleLine.playLine(ConfigMethod.getLines(this.gameData.getRollDataList(this.gameData.getResultIdx(), COLUMN_LAST_IDX), COLUMN_COUNT));

        await PromiseEx.CallDelayOnly(0.4)
        // 掉落后，可能有新的scatter，需要提升scatter图层
        let szScatterIdx = this.gameData.getScatterIdx(this.gameData.getResultIdx());
        for (let col=COLUMN_HORIZONTAL; col<COLUMN_COUNT; col++){
            if (szScatterIdx[col].length == 0){
                continue
            }
            this.szRoll[col].rollStopScatterLayer(szScatterIdx[col]);
        }

        await PromiseEx.CallDelayOnly(0.2)

        if (this.gameData.isReward(this.gameData.getResultIdx())){
            this.doRoundReward();
            return 
        }
        
        await this.playBigWin();

        Audio.i.playWinScoreTotal();
        this.infoframe.showScore(this.gameData.getTotalWin(this.gameData.getResultIdx()), 
                                this.gameData.getTotalWin(this.gameData.getResultIdx()) / this.gameData.getBaseBet(), 
                                this.gameData.getCurrentMultiple(),  true);
        
        await PromiseEx.CallDelayOnly(0.5);// 等待最终分数特效
        
        if (this.gameData.isScatterGame()){
            await this.doGetScatter();

            if (this.gameData.isScatterGame()){ // 处于免费次数，又再次获得免费次数
                await this.playAddFree()
            }
        }
        this.delayStartReset = true;
        this.reset();
    }

    // 播放大奖
    private async playBigWin(){
        let totalScore = this.gameData.getTotalWin(this.gameData.getResultIdx());
        let betScore = this.gameData.getBetAllLine()
        let multiple =  totalScore / betScore
        if (multiple < BigwinType.BIG_WIN){
            if (multiple >= 3 && this.gameData.getResultIdx() >= 2){ // 中奖2次以上
                this.infoframe.playTotalWin(totalScore, 1.59);
                Audio.i.playWinScoreRolling();
                await PromiseEx.CallDelayOnly(1.79);
            }
            return
        }

        let destroyCallback:Function = null;
        let callBack = (resolve:Function, reject:Function)=>{
            destroyCallback = resolve
            return null;
        }

        TweenEx.CallNextFrame(this.node, ()=>{
            let bigWin = Bigwin.New(this.bigWin, this.ndTopEffectLayer)
            bigWin.register();
            bigWin.setCheckTouchSpaceKeyboard(()=>{
                return this.gameData.getGameKeyBoared().isOnlyTouch();
            })
            bigWin.runScore(totalScore, betScore, null, destroyCallback);
            if (this.gameData.getGameKeyBoared().isOnlyTouch()){
                bigWin.setQuickDoneFlg();
            }
        })

        await PromiseEx.Call(callBack);
        if (this.currFreeTimes){// 免费游戏页面
            Audio.i.playBonusBgm();
        }else{
            Audio.i.playNormalBgm();
        }
    }

    // 播放免费次数结算页面
    private async playBonesResult(){
        let bonusResult = BonusResult.New(this.bonusResult, this.ndTopEffectLayer)
        bonusResult.register();
        bonusResult.setCloseCallback(()=>{
            this.infoframe.showScore(this.gameData.getTotalWin(this.gameData.getResultIdx()) + this.gameData.getFreeTimesTotalWinBefore(), 
                        this.gameData.getTotalWin(this.gameData.getResultIdx()) / this.gameData.getBaseBet(), 
                        this.gameData.getCurrentMultiple(),  true);

            this.delayStartReset = true; // 如果最后一次没开奖，这个值会导致错误
            this.reset();
            this.gameData.bonusFinish(); // 重置免费游戏总赢
            Audio.i.playNormalBgm();
        })
        bonusResult.setCheckTouchSpaceKeyboard(()=>{
            return this.gameData.getGameKeyBoared().isOnlyTouch();
        })
        bonusResult.Run(this.gameData.getFreeTimesTotalWin(), this.gameData.getBaseBet());

        if (this.gameData.getGameKeyBoared().isOnlyTouch()){
            bonusResult.setQuickDoneFlg();
        }

        await PromiseEx.CallDelayOnly(1)
    }

    // 播放获得免费次数
    private async playAddFree(){
        if (!isValid(this.currFreeTimes)){ // 不在免费次数页面不显示
            return 
        }

        let addFreePlay = AddFreePlay.New(this.addFreePlay, this.ndTopEffectLayer)
        addFreePlay.setFreeTimes(this.gameData.getScatterFreeTimes())
        addFreePlay.setFreeTimeContent(this.currFreeTimes.getContent(), this.currFreeTimes.getFreeTimesWorldPos())
      
        Audio.i.playScatterOneMore();
       
        let delayTime = 0.20;
        await PromiseEx.CallDelayOnly(delayTime)

        addFreePlay.playFreeTimesAni();
        await PromiseEx.CallDelayOnly(delayTime / 2);

        let oldFreeTimes = this.gameData.getFreeTimes() - this.gameData.getCurrentSpinGetFreeTimes();
        for (let i=0, len=this.gameData.getCurrentSpinGetFreeTimes(); i < len; i++){
            addFreePlay.playFreeTimesAni();
            this.currFreeTimes.playFreeTimeBounce(oldFreeTimes + i + 1, delayTime / 2);
            Audio.i.playScatterAddTimes();
            await PromiseEx.CallDelayOnly(delayTime);
        }

        addFreePlay.playDestroy()
        await PromiseEx.CallDelayOnly(0.8);// 加完次数要短暂停下，否则立马开始次数又被扣了
    }

    private async reset(){
        // this.gameData.resetRoundNo();
        if (this.gameData.getFreeTimes() > 0) {
            if (this.currFreeTimes == null){
                this.playBonesEnter();
                return 
            }

            // let count = this.gameData.getResultRoundCount()
            // if (count){// 免费次数总奖励要累加
            //     this.gameData.addFreeGameTotalWin(this.gameData.getTotalRate(count - 1) * this.gameData.getBaseBet())
            // }

            this.resetFree();
        }else{
            if (this.currFreeTimes != null){ // 免费游戏结束
                await this.playBonesResult()

                this.currFreeTimes.destroySelf();
                this.currFreeTimes = null;
                this.btnList.node.active = true;
                this.switchBonus(false)
                this.multipleTitle.reset();
                return 
            }
            
            this.resetNormal();
        }

        this.scatterWaitOneLayer.clear(); // 进入免费游戏在其他地方清理
    }

    // 切换免费游戏
    private switchBonus(bonusGame: boolean){
        this.buyBonusButton.node.active = !bonusGame;
        this.userInfo.node.position = bonusGame ? new Vec3(0, -632, 0) : new Vec3(0, -400, 0);
        this.multipleTitle.setCurrentMultiple(this.gameData.getCurrentMultiple());
        this.multipleTitle.switchMultiple(bonusGame);
        this.gameBackgroundList.setBackground(bonusGame);
        this.multipleLine.setBonus(bonusGame);
    }

    // 正常游戏，和免费游戏一起的重置
    private resetCommon(){
        this.lastStopRoll = -1;
        this.gameData.getGameStatusType().reset();
        this.emitter.emit(EMIT_SCORE_TOTAL, SharedConfig.ScoreFormat(this.gameData.getBalance()));
        this.touchStopEnable(false);
    }

    // 非免费游戏重置
    private resetNormal(){
        this.resetCommon();
        this.btnList.reset();
        this.userInfo.reset();
        this.buyBonusButton.reset();
        this.gameData.setCurrentMultiple(MultipleNormal);
        if (this.gameData.getAutoStartTimes() > 0 || (this.gameData.getGameKeyBoared().isOnlyTouch() && !this.gameData.getGameOpenUiStatus().isOpenUi())){
            // 如果有自动开始次数，和键盘长按，需要取消自动开始
            if (this.gameData.getGameKeyBoared().isOnlyTouch() && this.gameData.getAutoStartTimes() > 0){
                this.onCbCancelAutoStart();
            }

            this.onEmitStar();
        }else{
            SystemEx.cancelScreenOn();
        }
    }

    // 免费游戏重置
    private resetFree() {
        this.resetCommon();
        if (this.gameData.getFreeTimes() > 0){
            this.onEmitStar();
        }
    }

    // 需要在开始的时候才重置的ui
    private doDelayStartReset(){
        if (!this.delayStartReset){
            return 
        }

        this.delayStartReset = false;

        if (this.gameData.getFreeTimes() <= 0){
            this.multipleTitle.reset();
            this.multipleTitle.playResetAni(this.gameData.getCurrentMultiple())
        }
        
        this.infoframe.reset(this.gameData.getFreeTimes() > 0);
    }

    private touchStopEnable(enable:boolean){
        this.btnTouchStop.node.active = enable;
    }

    // 进入免费次数页面
    async playBonesEnter(){
        this.multipleTitle.reset();
        this.multipleTitle.setCurrentMultiple(this.gameData.getCurrentMultiple())

        let bonusEnter = BonusEnter.New(this.bonusEnter, this.ndTopEffectLayer);
        bonusEnter.register();
        bonusEnter.setFreeCount(this.gameData.getFreeTimes());
        bonusEnter.setDestoryCallback(async ()=>{
            this.gameData.setCurrentMultiple(MultipleBonus);
            await this.enterFreeGmae();
            await PromiseEx.CallDelayOnly(1.0);// 进入免费游戏后延迟开始
            this.scatterWaitOneLayer.clear();
            this.resetFree();
        })
        bonusEnter.playEnterAni();

        if (this.gameData.getGameKeyBoared().isOnlyTouch()){
            bonusEnter.setQuickDoneFlg();
        }

        // let adaption = bonusEnter.getComponent(SharedAdaptation)
        // adaption.setEmitter(this.emitter);
        // adaption.register();
        // this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    }

    // 进入免费游戏
    private async enterFreeGmae(){
        this.btnList.node.active = false;

        let freeTimes = FreeTimes.New(this.freeTimes, this.ndBottomContent)
        freeTimes.setEmitter(this.emitter);
        freeTimes.register();
        this.currFreeTimes = freeTimes;
        this.emitter.emit(EMIT_UPDATE_FREE_TIMES, this.gameData.getFreeTimes());
        // this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
        this.switchBonus(true);
    }

    //----------------------- on callback
    // 取消自动旋转
    private onCbCancelAutoStart(){
        this.gameData.setAutoStartTimes(0);
        this.emitter.emit(EMIT_UPDATA_AUTO_START_TIMES, this.gameData.getAutoStartTimes());
    }

    // 键盘
    private onKeyboard(event:EventKeyboard){
        if (event.keyCode != KeyCode.SPACE){
            return 
        }

        if (event.type == Input.EventType.KEY_UP){
            this.gameData.getGameKeyBoared().cancelTouch();
            return 
        }

        if (this.gameData.getGameKeyBoared().isTouch()){
            return 
        }

        this.gameData.getGameKeyBoared().addTouch();
        if (this.gameData.getGameStatusType().isInit() && !this.gameData.getGameOpenUiStatus().isOpenUi()){
            this.onEmitStar();
        }else{
            if (this.gameData.getGameStatusType().isInit()
            || this.gameData.getGameStatusType().isTouchStop()
            || this.gameData.getGameStatusType().isStopRoll()){
                return 
            }

            this.emitter.emit(EMIT_BTN_STOP);
        }
    }

    // 游戏开始后点击旋转区域也要能快速停止
    private onBtnTouchStop(event:EventTouch){
        this.touchStopEnable(false);
 
        if (this.gameData.getGameStatusType().isInit()
        || this.gameData.getGameStatusType().isTouchStop()
        || this.gameData.getGameStatusType().isStopRoll()){
            return 
        }

        this.emitter.emit(EMIT_BTN_STOP);// 游戏开始，点击图标停止

        let nd = instantiate(this.clickEffect);
        nd.parent = this.ndTopEffectLayer;
        let worldPos = event.getUILocation();
        nd.position = NodeEx.getLocalPosition(this.ndTopEffectLayer, new Vec3(worldPos.x, worldPos.y, 1));
    }

    //----------------------- on emit event
    /**
     * 游戏开始滚动
     */
    private onEmitStar(){
        this.closeSymbolInfo();
        if (this.gameData.getGameStatusType().isStart()){
            return 
        }

        let isFreeGame = this.gameData.getFreeTimes() > 0;

        // 检查金币不足
        if (!isFreeGame && this.gameData.getBalance() < this.gameData.getBetAllLine()){
            this.gameData.setAutoStartTimes(0); // 金币不够，取消自动开始
            this.emitter.emit(EMIT_UPDATA_AUTO_START_TIMES, this.gameData.getAutoStartTimes());
            this.btnList.reset()
            this.emitter.emit(EMIT_INSUFFICIENT_BALANCE_TIPS, this.gameData.getBalance() - this.gameData.getBetAllLine())
            return
        }

        this.gameData.getGameTime().saveSpinTimestamp();
        SystemEx.keepScreenOn();
        this.gameData.clearResult()
        this.gameData.getGameStatusType().addStart();
        this.gameData.getGameStatusType().updateSnapeDone();
        this.touchStopEnable(true);

        this.doDelayStartReset();
        this.multipleLine.showPoint();

        if (!isFreeGame || (isFreeGame && this.gameData.getFreeTimesTotalWin() <= 0)){
            this.emitter.emit(EMIT_SCORE_GET, {score:0, action:false} as I_EMIT_SCORE_GET);   // 清空得分
        }
        
        if (isFreeGame){
            let preDeductfreeTimes = this.gameData.getFreeTimes() - 1; // 预先扣除显示，发送数据才扣除真实次数
            this.emitter.emit(EMIT_UPDATE_FREE_TIMES, preDeductfreeTimes);
            Audio.i.playDeductFreeTimes();
        }else{
            if (this.gameData.deductAutoStartTimes()){
                this.emitter.emit(EMIT_UPDATA_AUTO_START_TIMES, this.gameData.getAutoStartTimes());
            }
            if (this.gameData.getBuyBonusGame()){
                Audio.i.playBonusBuy();
            }else{
                Audio.i.playStartGame();
            }
        }

        this.emitter.emit(EMIT_GAME_START);
        
        let delay = 0;
        if (!this.gameData.getGameStatusType().isSnapeDoneSetting()){
            delay = NORMAL_START_SCROLL_INTERVAL;
        }

        // 横轴和1轴同时滚动
        this.szRoll[COLUMN_HORIZONTAL].play(delay*COLUMN_HORIZONTAL, this.gameData.getGameStatusType().isSnapeDoneSetting(), isFreeGame);
        for (let i=1; i<COLUMN_COUNT; i++){
            this.szRoll[i].play(delay*(i-1), this.gameData.getGameStatusType().isSnapeDoneSetting(), isFreeGame);
        }
    }

    private onEmitStop(){
        if (this.gameData.getGameStatusType().isTouchStop() || this.gameData.getGameStatusType().isStopRoll()){
            return 
        }

        this.gameData.getGameStatusType().addTouchStop();
        this.gameData.getGameStatusType().addSnapeDone();

        if (!this.gameData.getGameStatusType().isReceiveData()) {
            return
        }

        //console.log("onEmitStop");

        this.szRoll.forEach((value: Roll, index: number)=>{
            value.rollStopScatterLayerReset(); // 有的scatter已经切换图层了，需要重置，位置才能正确
            value.stopAndFlush(this.gameData.getRollData(this.gameData.getResultIdx(), index), true);
            value.switchScatterEffectParent(false); // 如果在播放scatter动画
        })

        Audio.i.stopScatterEffect();
        if (this.spColScatterEffectLayer.active) { // 关闭scatter动画
            this.colScatterEffect.stop(); 
            this.spColScatterEffectLayer.active = false;
        }
        this.infoframe.stopOneMoreScatter();
        this.scatterWaitOneLayer.clear();
        
        // 重新更改scatter的图层
        let szScatterIdx = this.gameData.getScatterIdx(this.gameData.getResultIdx());
        for (let col=COLUMN_HORIZONTAL; col<COLUMN_COUNT; col++){
            if (szScatterIdx[col].length == 0){
                continue
            }
            this.szRoll[col].rollStopScatterLayer(szScatterIdx[col]);
        }
        

        // 直接显示开奖结果是没有事件的，发送最后一轴事件
        this.lastStopRoll = COLUMN_LAST_IDX - 1;
        this.multipleLine.hidePoint();
        this.szRoll[this.szRoll.length - 1].finishBeforeEmit();
        this.szRoll[this.szRoll.length - 1].finishEmit(); // 最后一轴完成事件
        return 
    }

    /**
     * 第几行图标开始滚动
     * @param col 
     * @returns 
     */
    private async onEmitColumeStart(col: number){
        if (col == COLUMN_HORIZONTAL){
            Audio.i.playRolling();
        }else if (col == COLUMN_LAST_IDX){
            // if (!this.gameData.getGameStatusType().isSnapeDoneSetting()) {// 速度太快，都沒滾動起來
            //     await PromiseEx.CallDelayOnly(0.55); // 启动和停止占用0.8，总时间控制在2.0秒左右
            // }

            if (this.gameData.getFreeTimes() > 0){
                this.gameData.deductFreeTimes();
                this.gameData.reqFree();
                return 
            }
            
            let isBuy = this.gameData.getBuyBonusGame();
            this.gameData.setBuyBonusGame(false)
            this.gameData.reqBet(this.gameData.getBetAllLine(), isBuy ? TProtoGoldenCityBetType.BUYFREE : TProtoGoldenCityBetType.NORMAL)
        }
    }

    // 正常旋转逻辑处理
    private async doNormalSpinColumeDone(col: number) {
        if (this.gameData.getGameStatusType().isTouchStop() || !this.gameData.getGameStatusType().checkClientRound(this.clientRoundId)) {//如果这个时候点击停止，又没开奖，会重置所有数据，这里要校验是否是本局
            if (this.gameData.getGameStatusType().checkClientRound(this.clientRoundId)){
                this.lastStopRoll = col;
            }
            return;
        }
        
        this.lastStopRoll = col;
        let wildIndexList = this.gameData.getWildIndexList(this.gameData.getResultIdx(), col) 
        if (wildIndexList.length > 0){
            Audio.i.playWild();
            this.szRoll[col].playWildStandBy(wildIndexList);
        }
     
        if (this.gameData.getScatterCount(this.gameData.getResultIdx(), col) > 0) {
            let szScatter = this.gameData.getScatterIdx(this.gameData.getResultIdx());
            this.szRoll[col].rollStopScatterLayer(szScatter[col]);// 游戏重置还原
             
            if (this.gameData.getScatterCountOnlyOnceRoll(this.gameData.getResultIdx(), col) > 0){
                Audio.i.playScatter();
                await PromiseEx.CallDelayOnly(0.1);// 播放scatter音效用
            }
         
            if (this.gameData.getGameStatusType().isTouchStop() || !this.gameData.getGameStatusType().checkClientRound(this.clientRoundId)) {//如果这个时候点击停止，又没开奖，会重置所有数据，这里要校验是否是本局
                return 
            }
        }

        if (this.spColScatterEffectLayer.active) {
            Audio.i.stopScatterEffect();
            this.colScatterEffect.stop(); // 第三个scatter效果
            this.szRoll[col].switchScatterEffectParent(false);
            this.spColScatterEffectLayer.active = false;
        }

        if (col == COLUMN_LAST_IDX) {
            this.scatterWaitOneLayer.clear();
            this.infoframe.stopOneMoreScatter();
            return 
        }

        if (!this.gameData.isMaybeScatter(this.gameData.getResultIdx(), col)) { 
            return 
        }

        let nextCol = col + 1;

        if (!this.scatterWaitOneLayer.isPlay()){ // 夺宝身上特效
            let szScatterIdx = this.gameData.getScatterIdx(this.gameData.getResultIdx());
            this.szRoll.forEach((roll:Roll, k:number)=>{
                if (szScatterIdx[k].length == 0 || k >= nextCol){return};
                let szCell = roll.playScatterWaitOne(szScatterIdx[k], 2.5);
                this.scatterWaitOneLayer.playWaitOne(szCell);
            })
        }
        
        // 播放scatter减速
        this.spColScatterEffectLayer.active = true;
        this.colScatterEffect.play(nextCol);
        this.szRoll[nextCol].switchScatterEffectParent(true);
        this.szRoll[nextCol].slowSpeed();
        this.infoframe.playOneMoreScatter();
        Audio.i.playScatterEffect();
        
        await PromiseEx.CallDelayOnly(2.0);
    
        if (this.gameData.getGameStatusType().isTouchStop() || !this.gameData.getGameStatusType().checkClientRound(this.clientRoundId)){//如果这个时候点击停止，又没开奖，会重置所有数据，这里要校验是否是本局
            console.log("doNormalSpinColumeDone", col, nextCol, this.gameData.getGameStatusType().getClientRoundId(), this.clientRoundId)
            return 
        }
        
        this.updateRollResult(nextCol);
    }

    private async waitOtherRoll(col: number, cbLastRoll: ()=>number){
        if (col == cbLastRoll()){
            return 
        }

        for (let i=0; i<60; i++){
            await PromiseEx.CallDelayOnly(0)
            if (col == cbLastRoll()){
                return 
            }
        }
    }


    // 某列停止滚动前
    private async onEmitColumeDoneBefore(col: number){
        await this.waitOtherRoll(col, ()=>{
            return this.lastStopRoll + 1;
        })

        // console.log("onEmitColumeDoneBefore", "col", col, "lastStopRoll", this.lastStopRoll);

        if (col == COLUMN_HORIZONTAL){
            Audio.i.resetStopIdx()
            return 
        }

        Audio.i.playStopRoll();
        // await PromiseEx.CallDelayOnly(0.1);// 播放停止音效用

        if (col == 1){
            this.multipleLine.hidePoint();
        }

        let szResultData = this.gameData.getRollDataList(this.gameData.getResultIdx(), col);
        this.multipleLine.setLine(ConfigMethod.getLines(szResultData, szResultData.length));
    }

    // 某列停止滚动
    private async onEmitColumeDone(col: number){
        await this.waitOtherRoll(col, ()=>{
            return this.lastStopRoll + 1;
        })
        // console.log("onEmitColumeDone", "col", col, "lastStopRoll", this.lastStopRoll);

        if (!this.gameData.getGameStatusType().isSnapeDone()) {
            await this.doNormalSpinColumeDone(col);
        }else {
            this.lastStopRoll = col;
            if (col == COLUMN_LAST_IDX){ // 快速旋转只播放一次
                Audio.i.playStopRoll();

                let playScatterAudio = false;
                let playWildAudio = false;
                let szScatter = this.gameData.getScatterIdx(this.gameData.getResultIdx());
                for (let lastCol=Math.max(this.lastStopRoll + 1, COLUMN_HORIZONTAL); lastCol<COLUMN_COUNT; lastCol++){
                    let wildIndexList = this.gameData.getWildIndexList(this.gameData.getResultIdx(), lastCol) 
                    if (wildIndexList.length > 0){
                        this.szRoll[lastCol].playWildStandBy(wildIndexList);
                        playWildAudio = true;
                    }
                    
                    if (!playScatterAudio && this.gameData.getScatterCountOnlyOnceRoll(this.gameData.getResultIdx(), lastCol) > 0){
                        playScatterAudio = true;
                    }

                    this.szRoll[lastCol].rollStopScatterLayer(szScatter[lastCol]);// 游戏重置还原
                }

                if (playScatterAudio){
                    Audio.i.playScatter();
                }

                if (playWildAudio){
                    Audio.i.playWild();
                }
            }
        }

        if (col != COLUMN_LAST_IDX){ // 最后一列停止
            return 
        }

        if (this.gameData.getGameStatusType().isStopRoll()){ // 如果自然旋转到末轴，又停止，可以立即点击停止，会造成这里多次调用
            return 
        }

        this.gameData.getGameStatusType().addStopRoll();
        Audio.i.stopRolling();

        if (this.gameData.getGameStatusType().isSnapeDone()){
            await PromiseEx.CallDelayOnly(0.1); // 快速滚动要等待，否则图标都没看清
        }

        if (this.gameData.isReward(this.gameData.getResultIdx())){
            this.doRoundReward()
            return 
        }

        if (this.gameData.isScatterGame()){
            await this.doGetScatter();

            if (this.gameData.isScatterGame()){ // 处于免费次数，又再次获得免费次数
                await this.playAddFree()
            }
        }else{
            await this.waitScatterPlay();
        }

        this.reset();
    }

    // 等待scatter待机动画播放完毕
    private async waitScatterPlay(){
        let delay: number = null;
        for (let col=COLUMN_LAST_IDX; col>=0; col--){
            if (this.gameData.getScatterCount(this.gameData.getResultIdx(), col) >= 1){
                if (delay == null){
                    delay = 0.45
                }else{
                    delay =- NORMAL_STOP_SCROLL_INTERVAL;
                }
                break;
            }
        }

        if (!delay || delay <= 0){ // 没开奖，最后一轴又是scatter，等待动画播完
            return;
        }

        await PromiseEx.CallDelayOnly(delay);
    }

    // 接收到服务器
    private async onEmitReceiveData(){
        let delayTime = Math.max(0, 0.2 - this.gameData.getGameTime().getSpinPastTime() / 1000)
        await PromiseEx.CallDelayOnly(delayTime); // 收到数据立马发过来，间隔一帧在处理

        this.clientRoundId = this.gameData.getGameStatusType().getClientRoundId();
        this.emitter.emit(EMIT_SCORE_TOTAL, SharedConfig.ScoreFormat(this.gameData.getBalanceBefore()));
        this.gameData.getGameStatusType().addReceiveData();
        
        if (this.gameData.getGameStatusType().isTouchStop() 
        || this.gameData.getGameStatusType().isSnapeDoneSetting()
        || this.gameData.getGameKeyBoared().isOnlyTouch()){ // 立即显示全部结果
            this.gameData.getGameStatusType().addTouchStop();
            this.gameData.getGameStatusType().addSnapeDone();

            this.szRoll.forEach((value: Roll, index: number)=>{
                value.setResult(this.gameData.getRollData(this.gameData.getResultIdx(), index), true);
            })
    
            return 
        }

        let isMaybeScatter = false;
        for (let col=0; col<COLUMN_COUNT; col++){
            if (this.gameData.isMaybeScatter(this.gameData.getResultIdx(), col)) { // 本圈刚刚好符合scatter，下一轴才有特效
                isMaybeScatter = true;
            }

            if (this.gameData.getGameStatusType().isTouchStop() || !this.gameData.getGameStatusType().checkClientRound(this.clientRoundId)){//如果这个时候点击停止，又没开奖，会重置所有数据，这里要校验是否是本局
                break;
            }

            this.updateRollResult(col);
            if (isMaybeScatter){
                break;
            }

            await PromiseEx.CallDelayOnly(NORMAL_STOP_SCROLL_INTERVAL);
        }
    }
  
    // 设置自动开始
    private onEmitSettingOpenStart(){
        if (this.gameData.getGameStatusType().isInit()){
            this.onEmitStar();
        }
    }

    // 打开符号信息层
    private onEmitOpenSymbolInfo(col:number, cell:Cell, idx: number){
        if (!this.gameData.getGameStatusType().isInit()){// 游戏中不显示 
            return 
        }

        if (!isValid(this.currSymbolInfo)){
            this.currSymbolInfo = SymbolInfo.New(this.symbolInfo, this.ndSymbolInfoLayer);
            this.currSymbolInfo.promoteInfoUiOrder(this.ndSymbolInfoLayer2);
            this.currSymbolInfo.setCloseCallback(()=>{
                this.closeSymbolInfo()
            })
        }

        if (col == COLUMN_HORIZONTAL){ // 横轴，模拟列的数据
            col = idx + 2;
        }

        this.currSymbolInfo.setSymbol(cell.getSymbolId(), col);
        this.currSymbolInfo.setPoint(cell.getSymbolWorldPoint(Vec3.ZERO));
    }

    // 查询游戏记录
    private onEmitReqGameRecord(startTimestamp: number, endTimestamp: number, offsetNum: number) {
        this.gameData.reqGameRecord(startTimestamp, endTimestamp, offsetNum);
    }

    private onEmitReqGameRecordRetry() {
        this.gameData.reqGameRecordRetry();
    }

    // 查询游戏记录具体订单详情
    private onEmitReqRecordDetail(roundNo:string){
        this.gameData.reqRecordDetail(roundNo);
    }

    private onEmitReqRecordDetailRetry(){
        this.gameData.reqRecordDetailRetry();
    }

    // 快速和普通模式切换
    private onEmitSettingQuick(isQuick: boolean){
        this.gameData.getGameStatusType().setSnapeDoneTemp(isQuick);
    }

    // 更新投注分数
    private onEmitScoreBet(emitArgs:I_EMIT_SCORE_BET){
        if (this.gameData.getGameOpenUiStatus().isOpenBtnList()){
            return 
        }

        // 更新购买奖金游戏按钮
        let betIdList = this.gameData.getBetIdList(this.gameData.getBetAllLine())
        if (betIdList == null || betIdList.length == 0){
            this.buyBonusButton.hide()
            return;
        }

        for (let i=0, len=betIdList.length; i<len; i++){
            if (this.gameData.checkBuyFreeBetId(betIdList[i])){
                this.buyBonusButton.show();
                return 
            }
        }

        this.buyBonusButton.hide();
    }

    private onEmitSwitchAudio(enable: boolean){
        if (this.delaySetAudio != null) {
            return 
        }

        Tween.stopAllByTarget(this.delaySetAudio);
        // 1s准限制，避免快速点击
        this.delaySetAudio = TweenEx.DelayCall(this.node, 1.0, ()=>{
            this.delaySetAudio = null;
            if (Audio.i.isOn() == this.lastAudioSwitch){
                return;
            }

            this.lastAudioSwitch = Audio.i.isOn();
            this.gameData.reqAudioMuteReq(this.lastAudioSwitch);
        })
    }

    // 重新刷新适配
    private onEmitViewResizeFlush(){
        this.emitter.emit(EMIT_VIEW_RESIZE, this.offsetY, this.limitOffsetY );
    }

    private onEventHide(){
        this.gameData.getGameKeyBoared().addBlur();
        this.gameData.getGameKeyBoared().cancelTouch();
    }

    private onEventShow(){
        this.gameData.getGameKeyBoared().cancelBlur();
        if (this.gameData.getGameStatusType().isInit() && this.gameData.getGameKeyBoared().isOnlyTouch() && !this.gameData.getGameOpenUiStatus().isOpenUi()){
            this.onEmitStar();
        }
    }

    // 切换按钮菜单， 更新购买按钮显示
    updateBuyBonusButton(show:boolean){
        if (show){
            this.onEmitScoreBet(null);
            return 
        }

        this.buyBonusButton.hide();
    }
}

