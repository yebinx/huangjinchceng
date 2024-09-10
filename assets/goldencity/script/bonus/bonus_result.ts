import { _decorator, Button, Component, EventMouse, isValid, Label, Tween, tween, Vec3, Node, Animation, NodeEventType, EventKeyboard, KeyCode, input, Input, instantiate} from 'cc';
import { Audio } from '../sound/audio';
import { MoneyUtil } from '../../../shared/script/lib/MoneyUtils';
import { PromiseEx } from '../../../shared/script/lib/PromiseEx';
import { SCORE_MULTIPLE } from '../config/game_config';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { SharedConfig } from '../../../shared/script/config/shared_config';
import { AnimationEx } from '../../../shared/script/lib/animation/AnimationEx';
import { QuickDone } from '../quick_done';
const { ccclass, property } = _decorator;

// 免费旋转结算

@ccclass('BonusResult')
export class BonusResult extends Component {
    @property({type:Label})
    lbScore:Label // 总获得金币

    @property({type:Button})
    btnReward:Button // 领奖

    @property({type:Animation})
    bonusAnniuAni:Animation; // 按钮动画

    @property({type:Button})
    btnQuickPlayScore:Button; // 快速播放完毕

    @property({type:Animation})
    bonusResultAni:Animation;

    private playFinishCallback:Function;
    private closeCallback:Function;

    private isDestroy = false; // 准备删除
    private score:number = 0;
    private actionTween:Tween<{value: number;}> = null;
    private quickDone: QuickDone = new QuickDone();
    private checkTouchSpaceKeyboard: ()=>boolean;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(BonusResult)
    }

    protected onLoad(): void {
        this.btnReward.node.active = false;
        this.stopAnniuAnimation();
    }

    protected start(): void {
        Audio.i.playBonusResultBgm();
        // this.test();
    }

    protected onDestroy(): void {
        if (this.closeCallback){
            this.closeCallback()
        }
    }

    protected update(dt: number): void {
        if (this.quickDone.isInit()){
            return 
        }

        if (!this.quickDone.isQuickDone() || !this.quickDone.isAnimationEnter()){
            return
        }

        if (this.btnQuickPlayScore.node.active){
            this.onBtnQuickPlayScore();
            return
        }

        if (!this.btnReward.interactable){ // 手动点击领奖
            this.delayDestroy();
        }else{
            this.autoClick();
        }
    }

    register(){
        input.on(Input.EventType.KEY_DOWN, this.onKeyboard, this);
        this.btnReward.node.on(NodeEventType.MOUSE_ENTER, this.onEventMouseEnter, this, true);
        this.btnReward.node.on(NodeEventType.MOUSE_LEAVE, this.onEventMouseLevel, this, true);
    }

    setPlayFinishCallback(callback:Function){this.playFinishCallback = callback;}
    setCloseCallback(callback:Function){this.closeCallback = callback;}
    setQuickDoneFlg(){ this.quickDone.addQuickDoneFlg(); }
    setCheckTouchSpaceKeyboard(cb) {this.checkTouchSpaceKeyboard = cb;}

    async Run(score: number, totalBet: number){
        AnimationEx.playSequence(this.bonusResultAni, "chuxian", "xunhuan");

        this.scheduleOnce(()=>{this.quickDone.addAnimationEnter();}, 0.7)

        this.score = score;
        this.lbScore.node.active = true;

        let duration = 4; // 背景音乐4秒
        this.actionTween = MoneyUtil.RunScoreAction(this.lbScore, duration, 0, score / SCORE_MULTIPLE, null);
        this.actionTween.start();

        await PromiseEx.CallDelayOnly(duration)
        if (!isValid(this.node)){
            return 
        }

        this.playFinish();
    }

    delayDestroy(){
        if (this.isDestroy){
            return;
        }

        this.quickDone.reset();
        
        this.isDestroy = true;
        TweenEx.DelayCall(this.node, 1.0, ()=>{
            this.node.destroy();
        })
    }

    private playFinish(){
        if (!this.btnQuickPlayScore.node.active){
            return
        }

        this.bonusResultAni.play("queren")
    
        Audio.i.playBonusScoreFinish();
        this.processQuickDoneStatus()

        this.btnQuickPlayScore.node.active = false;

        tween(this.lbScore.node)
        .to(0.1, {scale:new  Vec3(1.1, 1.1, 0)})
        .to(0.1, {scale:new  Vec3(1.0, 1.0, 0)})
        .call(()=>{
            if (this.playFinishCallback){
                this.playFinishCallback();
            }
        })
        .start()

        this.btnReward.node.active = true

        TweenEx.DelayCall(this.node, 6.0, ()=>{// 界面最多停留时间
            if (this.isDestroy){
                return;
            }

            this.autoClick();
        });
    }

    private autoClick() {
        if (this.isDestroy){
            return 
        }

        if (this.btnReward.interactable){
            this.btnReward.interactable = false;
            TweenEx.ScaleBounce(this.btnReward.node, Vec3.ONE, -0.1, 0.05, 0)
            .start()
            Audio.i.playBonusReward();
            this.stopAnniuAnimation();
        }

        this.delayDestroy();
    }
    
    private onBtnAward() {
        Audio.i.playBonusReward();
        this.btnReward.interactable = false;
        this.stopAnniuAnimation();
        this.setQuickDoneFlg();
    }

    // 快速显示分数
    private onBtnQuickPlayScore(){
        if (!this.quickDone.isAnimationEnter()){
            return 
        }

        this.actionTween.stop();
        Tween.stopAllByTarget(this.lbScore.node)
        this.lbScore.string = SharedConfig.ScoreFormat(this.score);

        this.playFinish();
    }

    private processQuickDoneStatus(){
        this.quickDone.reset();
        this.scheduleOnce(()=>{
            this.quickDone.addAnimationEnter()
            if (this.checkTouchSpaceKeyboard && this.checkTouchSpaceKeyboard()){
                this.setQuickDoneFlg()
            }
        }, 1.0)
    }

    private onEventMouseEnter(event:EventMouse){
        if (!this.btnReward.interactable){
            return 
        }

        this.playAnniuAnimation();
    }

    private onEventMouseLevel(event:EventMouse){
        if (!this.btnReward.interactable){
            return 
        }
        this.stopAnniuAnimation();
    }

    private stopAnniuAnimation(){
        this.bonusAnniuAni.node.active = false;
        this.bonusAnniuAni.stop()
    }

    private playAnniuAnimation(){
        this.bonusAnniuAni.node.active = true;
        this.bonusAnniuAni.play();
    }

    private onKeyboard(event:EventKeyboard){
        if (event.keyCode != KeyCode.SPACE){
            return 
        }

        if (event.type == Input.EventType.KEY_UP){
            return 
        }
        
        this.setQuickDoneFlg();
    }


    // private test(){
    //     // this.btnReward.node.active = true;
    //     this.register();
    //     this.Run(1000000,  10)
    //     // this.setFreeTimes(10)
    // }
}

