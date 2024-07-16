import { _decorator,  Button,  Component, Label, Sprite, Node, assetManager, Prefab, AssetManager, Animation, NodeEventType, EventMouse, Vec3, EventKeyboard, KeyCode, Input, input, instantiate } from 'cc';
import { Audio } from '../sound/audio';
import { ButtonEx } from '../../../shared/script/lib/button/ButtonEx';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { PromiseEx } from '../../../shared/script/lib/PromiseEx';
import { QuickDone } from '../quick_done';
const { ccclass, property } = _decorator;


// 免费旋转页面进入
@ccclass('BonusEnter')
export class BonusEnter extends Component {
    @property({type:Label})
    lbFreeCont:Label // 免费次数

    @property({type:Button})
    btnFreeStart:Button // 开始

    @property({type:Node})
    bonusAnniu:Node; // 按钮节点

    @property({type:Animation})
    ndAni:Animation; // 进入动画

    @property({type:Animation})
    bonusAnniuAni:Animation; // 按钮动画

    private isDestroy = false; // 准备删除
    private destroyCallback: Function
    private quickDone: QuickDone = new QuickDone();

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(BonusEnter)
    }

    protected onLoad(): void {
        this.bonusAnniu.active = false;
        this.btnFreeStart.node.active = false;
    }

    protected start(): void {
        Audio.i.playBonusBgm();
        this.startMaxWait();
        // this.test();
    }

    protected update(dt: number): void {
        if (this.quickDone.isInit() || this.isDestroy){
            return 
        }

        if (!this.quickDone.isQuickDone() || !this.quickDone.isAnimationEnter()){
            return
        }

        this.autoClick();
    }

    register(){
        input.on(Input.EventType.KEY_DOWN, this.onKeyboard, this);
        this.btnFreeStart.node.on(NodeEventType.MOUSE_ENTER, this.onEventMouseEnter, this);
        this.btnFreeStart.node.on(NodeEventType.MOUSE_LEAVE, this.onEventMouseLevel, this);
        this.ndAni.on(Animation.EventType.FINISHED, this.onEventEnterFinish, this)
    }

    playEnterAni(){
        this.ndAni.play()
    }

    setFreeCount(count: number){
        this.lbFreeCont.string = `${count}`;
    }

    setDestoryCallback(callback:Function){this.destroyCallback = callback}
    setQuickDoneFlg(){ this.quickDone.addQuickDoneFlg(); }

    startMaxWait(){
        this.scheduleOnce(()=>{
            this.autoClick()
        }, 6);// 界面最多停留时间
    }

    private delayDestroy(){
        if (this.isDestroy){
            return;
        }
        
        // Audio.i.stopCoin();
        this.isDestroy = true;
        this.btnFreeStart.interactable = false;
        TweenEx.DelayCall(this.node, 1.0, ()=>{
            this.node.destroy();
        })
    }

    protected onDestroy(): void {
        if (this.destroyCallback){
            this.destroyCallback();
        }
    }

    private autoClick() {
        if (this.isDestroy){
            return 
        }

        if (this.btnFreeStart.interactable){
            Audio.i.playBonusGameStart();
            TweenEx.ScaleBounce(this.btnFreeStart.node, Vec3.ONE, -0.1, 0.05, 0)
            .start()
            this.stopAnniuAnimation()
        }

        this.delayDestroy()
    }

    private onBtnStart(){
        Audio.i.playBonusGameStart();
        this.btnFreeStart.interactable = false;
        this.setQuickDoneFlg()
        this.stopAnniuAnimation()
    }

    private onEventMouseEnter(event:EventMouse){
        // this.isButtonHover = true;
        if (!this.btnFreeStart.interactable){
            return 
        }

        this.playAnniuAnimation();
    }

    private onEventMouseLevel(event:EventMouse){
        // this.isButtonHover = false;
        if (!this.btnFreeStart.interactable){
            return 
        }
        this.stopAnniuAnimation();
    }

    private stopAnniuAnimation(){
        this.bonusAnniu.active = false;
        this.bonusAnniuAni.stop()
    }

    private playAnniuAnimation(){
        this.bonusAnniu.active = true;
        this.bonusAnniuAni.play();
    }

    // 动画播放完毕
    private onEventEnterFinish(){
        this.btnFreeStart.node.scale = Vec3.ZERO.clone()
        this.btnFreeStart.node.active = true;
        TweenEx.ScaleBounce(this.btnFreeStart.node, Vec3.ONE.clone(), 0.2, 0.25, 0)
        .start()

        this.scheduleOnce(()=>{
            this.quickDone.addAnimationEnter();
        }, 0.5)
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
    
    // async test(){
    //     await PromiseEx.CallDelayOnly(2)

    //     this.btnFreeStart.node.active = true;
    //     this.register();
    //     this.playEnterAni()
    //     // this.bonusEnter.play();
    //     // this.setFreeCount(10)
    //     // await this.loadPrefab("goldencity", "prefab/big_win/big_win")
    // }
}

