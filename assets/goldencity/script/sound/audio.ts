import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { PromiseEx } from '../../../shared/script/lib/PromiseEx';
const { ccclass, property } = _decorator;

@ccclass('Audio')
export class Audio extends Component {
    @property({type:AudioSource})
    asBgm:AudioSource;

    @property({type:AudioSource})
    asScatterAddTimes:AudioSource;

    @property({type:AudioSource})
    asRolling:AudioSource;

    @property({type:AudioSource})
    asRandomSymbol:AudioSource;

    @property({type:AudioSource})
    asCoinScoreRun:AudioSource;

    @property({type:[AudioSource]})
    szAsEffect:AudioSource[] = [];

    //-----------------------------
   
    @property({type:AudioClip})
    normalBgm:AudioClip; // 普通游戏音乐

    @property({type:AudioClip})
    rolling:AudioClip; // 转轴滚动-循环至最后一轴停止

    @property({type:AudioClip})
    bigWinBgm:AudioClip; // 大奖巨奖超级奖-音乐

    @property({type:AudioClip})
    bigWinFinish:AudioClip; // 大奖巨奖超级奖-音乐结束乐句

    @property({type:AudioClip})
    bonusBgm:AudioClip; // 免费游戏音乐

    @property({type:AudioClip})
    bonusResultBgm:AudioClip; // 免费游戏结算界面音乐 

    @property({type:[AudioClip]})
    bonusScoreFinish:AudioClip; // 免费结算界面音乐结束乐句

    // 下面是音效-------------------
    @property({type:AudioClip})
    startGame:AudioClip; // 启动旋转

    @property({type:[AudioClip]})
    szRollStop:AudioClip[] = []; // 单轴停止

    @property({type:AudioClip})
    wild:AudioClip; // 出现百搭

    @property({type:AudioClip})
    scatter:AudioClip; // 出现夺宝图标

    @property({type:AudioClip})
    scatterEffect:AudioClip; // 特殊旋转

    @property({type:AudioClip})
    scatterBonus:AudioClip; // 夺宝图标集齐启动

    @property({type:AudioClip})
    scatterGame:AudioClip; // 赢得免费旋转界面
    
    @property({type:AudioClip})
    scatterOneMore:AudioClip; // 免费中增加免费次数

    @property({type:AudioClip})
    scatterAddTimes:AudioClip; // 免费次数增加滚动,循环到次数停止 

    @property({type:AudioClip})
    symbolBoom:AudioClip; // 中奖图标浮起爆炸

    @property({type:[AudioClip]})
    szMultiple:AudioClip[] = []; // 第1~3次加倍

    @property({type:[AudioClip]})
    addMultiple:AudioClip; // X倍数翻动增加

    @property({type:[AudioClip]})
    waitOneScatter:AudioClip; // 有空格准备掉落夺宝还差一个

    @property({type:[AudioClip]})
    randomSymbol:AudioClip; // 图标随机快速变化-循环至结束

    @property({type:[AudioClip]})
    buyBonusGameStart:AudioClip; // 购买奖金游戏框点击开始

    @property({type:[AudioClip]})
    bonusBuyFrameOpen:AudioClip; // 打开购买奖金游戏框

    @property({type:[AudioClip]})
    bonusBuy:AudioClip; // 购买奖金游戏提示

    @property({type:AudioClip})
    winScoreTotal:AudioClip; // 无翻倍的共赢得与翻红的共赢得

    @property({type:AudioClip})
    winScoreRolling:AudioClip; //  赢得框内的数字滚动

    @property({type:AudioClip})
    bonusGameStart:AudioClip; // 免费游戏开始与领奖按钮

    @property({type:AudioClip})
    openMenu:AudioClip; // 按键打开菜单通用音效

    @property({type:AudioClip})
    closeMenu:AudioClip; // 关闭菜单通用音效

    @property({type:AudioClip})
    deductFreeTimes:AudioClip; // 剩余免费旋转次数-1

    private effectIdx: number = 0;
    private audioOff: boolean = true;
    private currentScatterEffect:AudioSource = null; // 特殊旋转
    private stopIndex: number = 0;
 
    static i:Audio; // 全局实例
    protected onLoad(): void {
        Audio.i = this;
    }

    protected start(): void {
        // this.test()
    }

    setAudio(isOn: boolean){
        this.audioOff = !isOn;
    }

    on(){
        this.audioOff = false;
        this.playNormalBgm();
    }

    off(){
        this.audioOff = true;
        this.stopBgm();
    }

    isOn(){ return (!this.audioOff); }

    private getAsEffect(){
        this.effectIdx += 1;
        if (this.effectIdx >= this.szAsEffect.length){
            this.effectIdx = 0;
        }
        return this.szAsEffect[this.effectIdx];
    }

    private playEffect(effectAudioClip: AudioClip){
        if (this.audioOff || !effectAudioClip){
            return null;
        }

        let audio = this.getAsEffect()
        audio.clip = effectAudioClip;
        audio.play();
        return audio;
    }

    private playBgm(bgm: AudioClip, loop: boolean){
        if (this.audioOff){
            return 
        }

        this.stopBgm();
      
        this.asBgm.clip = bgm;
        this.asBgm.loop = loop;
        this.asBgm.play();
    }

    private stopBgm(){
        if (this.asBgm.playing){
            this.asBgm.stop();
        }
    }

    resetStopIdx(){this.stopIndex = 0;}

    playNormalBgm(){
        this.playBgm(this.normalBgm, true);
    }

    playBonusBgm(){
        this.playBgm(this.bonusBgm, true);
    }

    playBonusResultBgm(){
        this.playBgm(this.bonusResultBgm, false);
    }

    playBonusScoreFinish(){
        this.playBgm(this.bonusScoreFinish, false);
    }

    playBigWinBgm(){
        this.playBgm(this.bigWinBgm, false);
    }

    playBigWinFinishBgm(){
        this.playBgm(this.bigWinFinish, false);
    }
    
    playStartGame(){
        this.playEffect(this.startGame);
    }

    playStopRoll(reset:boolean=false){
        if (reset){
            this.stopIndex = 0;
        }
        // console.log("stopIndex", this.stopIndex)
        // 声音循环播放
        let key = this.stopIndex % this.szRollStop.length;
        this.stopIndex += 1;
        
        let rollStop = this.szRollStop[key];
        this.playEffect(rollStop);
    }

    playWild(){
        this.playEffect(this.wild);
    }

    playScatter(){
        this.playEffect(this.scatter);
    }

    playScatterEffect(){
        this.currentScatterEffect = this.playEffect(this.scatterEffect);
        if (!this.currentScatterEffect){
            return 
        }

        this.currentScatterEffect.node.once(AudioSource.EventType.ENDED, ()=>{
            this.currentScatterEffect = null;
        })
    }

    stopScatterEffect(){
        if (this.currentScatterEffect != null){
            this.currentScatterEffect.stop();
            this.currentScatterEffect = null;
        }
    }

    playScatterBonus(){
        this.playEffect(this.scatterBonus);
    }

    playScatterGame(){
        this.playEffect(this.scatterGame);
    }

    playScatterOneMore(){
        this.playEffect(this.scatterOneMore);
    }

    playScatterAddTimes(){
        if (this.audioOff){
            return null;
        }

        this.playEffect(this.scatterAddTimes);
    }

    stopScatterAddTimes(){
        this.asScatterAddTimes.stop();
    }

    playSymbolBoom(){
        this.playEffect(this.symbolBoom);
    }

    playMultiple(multiple: number){
        let idx: number
        if (multiple == 1){
            idx = 0;
        }else if (multiple >= 50){
            idx = 2
        }else{
            idx = 1;
        }
        
        this.playEffect(this.szMultiple[idx]);
    }

    playAddMultiple(){
        this.playEffect(this.addMultiple);
    }

    playWaitOneScatter(){
        this.playEffect(this.waitOneScatter);
    }

    playRandomSymbol(){
        if (this.audioOff){
            return 
        }

        this.asRandomSymbol.clip = this.randomSymbol;
        this.asRandomSymbol.loop = true;
        this.asRandomSymbol.play();
    }

    stopRandomSymbol(){
        this.asRandomSymbol.stop();
    }

    playBuyBonusGameStart(){
        this.playEffect(this.buyBonusGameStart);
    }

    playBonusBuyFrameOpen(){
        this.playEffect(this.bonusBuyFrameOpen);
    }

    playBonusBuy(){
        this.playEffect(this.bonusBuy);
    }

    playWinScoreTotal(){
        this.playEffect(this.winScoreTotal);
    }

    playWinScoreRolling(){
        this.playEffect(this.winScoreRolling);
    }
    
    playBonusGameStart(){
        this.playEffect(this.bonusGameStart);
    }
    
    playBonusReward(){
        this.playEffect(this.bonusGameStart);
    }
 
    playOpenMenu(){
        this.playEffect(this.openMenu);
    }

    playCloseMenu(){
        this.playEffect(this.closeMenu);
    }

    playDeductFreeTimes(){
        this.playEffect(this.deductFreeTimes);
    }

    playRolling(){
        if (this.audioOff){
            return 
        }

        this.asRolling.clip = this.rolling;
        this.asRolling.loop = true;
        this.asRolling.play();
    }

    stopRolling(){
        this.asRolling.stop();
    }


    // private async test(){
    //     for (let i=0; i<100000; i++){
    //         this.playStopRoll()
    //         await PromiseEx.CallDelayOnly(1);
    //     }
    // }
}


