import { _decorator,  Component, Label, Node, sp, Sprite, SpriteFrame, Tween, Animation, UIOpacity, ParticleSystem2D, input, Input, EventKeyboard, KeyCode, isValid, instantiate } from 'cc';
import { Audio } from '../sound/audio';
import { MoneyUtil } from '../../../shared/script/lib/MoneyUtils';
import { PromiseEx } from '../../../shared/script/lib/PromiseEx';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { SCORE_MULTIPLE } from '../config/game_config';
import { SharedConfig } from '../../../shared/script/config/shared_config';
import { QuickDone } from '../quick_done';
const { ccclass, property } = _decorator;

//----- 大奖
export enum BigwinType {
    BIG_WIN = 20,// 大奖20~35之间
    MEGA_WIN = 40,// 巨奖 35~50之间
    SUPER_WIN = 60,// 超级巨奖 50以上
}

@ccclass('Bigwin')
export class Bigwin extends Component {
    @property({type:Animation})
    bigWin:Animation; // 最终结算动画

    @property({type:sp.Skeleton})
    skBigWin:sp.Skeleton // 大奖动画

    @property({type: Label})
    lbSocre:Label;// 分数

    @property({type:Sprite})
    spTitle:Sprite; // 标题

    @property({type:Node})
    bigWinBurst:Node;

    @property({type:ParticleSystem2D})
    parResult:ParticleSystem2D; // 炸开

    @property({type:[SpriteFrame]})
    szTitle:SpriteFrame[] = []; // 大奖 巨奖 超级巨奖

    private isSnapeDone:boolean = false;

    private bigwinTween:Tween<{value: number;}>

    private currentAniKey:number; // 当前播放的动画
    private score:number; // 最终得分
    private baseScore:number; // 压分
    private destroyCallback:Function; // 关闭回调
    private playFinishCallback:Function; // 播放完毕回调
    private quickDone: QuickDone = new QuickDone();
    private checkTouchSpaceKeyboard: ()=>boolean;
    private isDestroy: boolean = false;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(Bigwin)
    }

    protected onLoad(): void {
    }

    protected start(): void {
        Audio.i.playBigWinBgm();
        // this.test();
    }
    
    protected onDestroy(): void {
        if (this.destroyCallback != null){
            this.destroyCallback()
        }
    }

    protected update(dt: number): void {
        if (this.quickDone.isInit()){
            return 
        }

        if (!this.quickDone.isQuickDone() || !this.quickDone.isAnimationEnter()){
            return
        }

        this.autoClick();
    }

    register(){
        input.on(Input.EventType.KEY_DOWN, this.onKeyboard, this);
    }

    setQuickDoneFlg(){ this.quickDone.addQuickDoneFlg(); }
    setCheckTouchSpaceKeyboard(cb) {this.checkTouchSpaceKeyboard = cb;}

    async runScore(score: number, baseScore: number, playFinishCallback:Function, destroyCallback: Function){
        this.bigWin.play("big_win_start");
        this.parResult.resetSystem();
        this.bigWinBurst.setSiblingIndex(1)

        this.scheduleOnce(()=>{this.quickDone.addAnimationEnter()}, 1.0)

        this.score = score;
        this.baseScore = baseScore;
        this.destroyCallback = destroyCallback;
        this.playFinishCallback = playFinishCallback;

        let multiple = this.getMultiple();
        let duration = 0;
        let minusMultiple = 0
        if (multiple >= BigwinType.BIG_WIN){
            duration += 4.1;
            minusMultiple = BigwinType.BIG_WIN; 
        }

        if (multiple >= BigwinType.MEGA_WIN){
            duration += 3.7;
            minusMultiple += BigwinType.MEGA_WIN
        } 

        duration = Math.min(duration + ((multiple - minusMultiple) * 0.1), 15.25);

        this.bigwinTween = MoneyUtil.RunScoreAction(this.lbSocre, duration, 0 / SCORE_MULTIPLE, score / SCORE_MULTIPLE, null, this.playFinish.bind(this)).start();
        // 0-30
        this.playBigWin(0, true);
        let delayTime = 4.1; // 大奖结束节点6秒
        if (multiple <= BigwinType.MEGA_WIN){
            return
        }
        await PromiseEx.CallDelayOnly(delayTime)
        if (this.isSnapeDone){
            return 
        }

        // 30-35
        this.playBigWin(1, true)

        delayTime = 3.7; // 巨奖结束节点12秒
        if (multiple <= BigwinType.SUPER_WIN){
            return 
        }
        
        await PromiseEx.CallDelayOnly(delayTime)
        if (this.isSnapeDone){
            return 
        }

        delayTime = 7.45; // 结算时间2秒
        this.playBigWin(2, true)
    }

    destroySelf(){
        if (this.isDestroy) {
            return
        }

        this.isDestroy = true;

        TweenEx.FadeOutOpacity(this.node, 0.5, null, ()=>{
            this.node.destroy();
        })
        .start()
    }

    private getMultiple() {
        return this.score / this.baseScore;
    }

    private playBigWin(idx: number, switchAni:boolean){
        if (this.currentAniKey == idx){
            return 
        }

        this.currentAniKey = idx;
        this.spTitle.spriteFrame = this.szTitle[idx];
        if (idx == 1){
            this.payAni("jujiang_chuxian", "jujiang_xunhuan")
        }else if (idx == 2){
            this.payAni("chaojijujiang_chuxian", "chaojijujiang_xunhuan")
        }else{
            this.payAni("dajiang_chuxian", "dajiang_xunhuan")
        }

        if (switchAni){
            this.bigWin.play("big_win_switch");
        }
    }

    private autoClick() {
        // if (this.isSnapeDone){
        //     return 
        // }

        this.onClick()
    }

    private onClick(){
        if (this.isSnapeDone){
            if (isValid(this.node) && this.quickDone.isAnimationEnter()){
                this.destroySelf();
            }
            return 
        }

        let multiple = this.getMultiple();
        if (multiple >= BigwinType.SUPER_WIN){
            this.playBigWin(2, false);
        }else if (multiple >= BigwinType.MEGA_WIN){
            this.playBigWin(1, false);
        }
        else{
            this.playBigWin(0, false);
        }

        if (this.bigwinTween != null){
            this.bigwinTween.stop();
        }

        Tween.stopAllByTarget(this.node)
        TweenEx.CallNextFrame(this.lbSocre.node, ()=>{
            this.lbSocre.string = SharedConfig.ScoreFormat(this.score)
        })

        this.playFinish()
    }

    private playFinish(){
        if (this.isSnapeDone){
            Audio.i.playBigWinFinishBgm();
            return 
        }
        
        this.processQuickDoneStatus();

        this.isSnapeDone = true;
        this.bigWin.play("big_win_result");
        this.parResult.resetSystem();

        Audio.i.playBigWinFinishBgm()

        TweenEx.DelayCall(this.node, 5, ()=>{
            this.destroySelf();
        })

        if (this.playFinishCallback){
            this.playFinishCallback();
        }
    }

    private processQuickDoneStatus(){
        this.quickDone.reset();
        this.scheduleOnce(()=>{
            this.quickDone.addAnimationEnter()
            if (this.checkTouchSpaceKeyboard && this.checkTouchSpaceKeyboard()){
                this.setQuickDoneFlg()
            }
        }, 2.0)
    }

    private payAni(startAni:string, standy: string){
        this.skBigWin.loop = false;
        this.skBigWin.animation = startAni;
        
        this.skBigWin.setCompleteListener((trackEntry: sp.spine.TrackEntry)=>{
            if (!standy){
                return;
            }
       
            this.skBigWin.loop = true;
            this.skBigWin.animation = standy;
        })

        this.skBigWin.setInterruptListener((trackEntry: sp.spine.TrackEntry)=>{
            if (trackEntry.animation.name != startAni){
                return 
            }
            standy = null;
        })
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

    // private async test(){
    //     this.node.active = false
    //     await PromiseEx.CallDelayOnly(1)
    //     this.node.active = true
    //     this.runScore(1000000, 3000, ()=>{

    //     }, 
    //     ()=>{
            
    //     })
    // }
}

