import { _decorator, Button, Component, Node, NodeEventType, Sprite, Tween, tween, Animation, EventMouse, UIOpacity, UIRenderer, TransformBit } from 'cc';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { Emitter } from '../../../shared/script/lib/Emitter';
import { EMIT_OPEN_BUY_BONUS } from '../config/emit_event';
import { EMIT_GAME_START, EMIT_SCORE_BET } from '../../../shared/script/config/shared_emit_event';
const { ccclass, property } = _decorator;

// 购买奖金按钮

// 不能购买的情况下，隐藏
// 开奖的时候，字体置灰
// 打开弹窗后，按钮置灰
// 点击购买后，立即旋转
// 购买失败后，停止还原原先的结果
// 切换菜单后，按钮会隐藏

// 鼠标放在购买和取消按钮都有呼吸状态

@ccclass('BuyBonusButton')
export class BuyBonusButton extends Component {
    @property({type:UIOpacity})
    buyBonusButton:UIOpacity;

    @property({type:Button})
    btnBuyBonus:Button;

    @property({type:Sprite})
    spTitle:Sprite; // 标题

    @property({type:Node})
    buyBonusButtonAnimation:Node; // 发光节点

    @property({type:Animation})
    aniLight:Animation; // 发光动画

    private isButtonHover = false;
    private emitter:Emitter;
    private isShow: boolean = true;

    protected onLoad(): void {
        this.stopLightAnimation();
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
    }

    register(){
        this.emitter.addEventListener(EMIT_GAME_START, this.onEmitGameStart, this);
        this.btnBuyBonus.node.on(NodeEventType.MOUSE_ENTER, this.onEventMouseEnter, this);
        this.btnBuyBonus.node.on(NodeEventType.MOUSE_LEAVE, this.onEventMouseLevel, this);
    }

    reset(){
        this.setTouchEnable(true)
    }

    setTouchEnable(enable: boolean){
        this.spTitle.grayscale = (!enable);

        this.btnBuyBonus.interactable = (enable && this.isShow);

        if (enable){
            this.checkButtonHover();
        }else{
            this.stopLightAnimation()
        }
    }

    show(){
        this.isShow = true;
        this.btnBuyBonus.interactable = true;
        Tween.stopAllByTarget(this.buyBonusButton);
        this.node.active = true;
        TweenEx.FadeInOpacity(this.buyBonusButton.node, 0.25, null, null)
        .start();
    }

    hide(){
        this.isShow = false;
        this.btnBuyBonus.interactable = false;
        Tween.stopAllByTarget(this.buyBonusButton);
       
        TweenEx.FadeOutOpacity(this.buyBonusButton.node, 0.25, null, ()=>{
            this.node.active = false; // TODO 必须要隐藏，否则在透明度的情况下，进行页面缩放，会导致节点位置错乱
        })
        .start();
    }

    private onEmitGameStart(){
        this.setTouchEnable(false);
    }

    private onBtnBuyBonus(){
        this.emitter.emit(EMIT_OPEN_BUY_BONUS);
        this.setTouchEnable(false);
    }

    checkButtonHover(){
        if (!this.isButtonHover){
            return 
        }

        this.playLightAnimation();
    }

    private onEventMouseEnter(event:EventMouse){
        this.isButtonHover = true;
        if (!this.btnBuyBonus.interactable){
            return 
        }

        this.playLightAnimation();
    }

    private onEventMouseLevel(event:EventMouse){
        this.isButtonHover = false;
        if (!this.btnBuyBonus.interactable){
            return 
        }
        this.stopLightAnimation();
    }

    private stopLightAnimation(){
        this.buyBonusButtonAnimation.active = false;
        this.aniLight.stop()
    }

    private playLightAnimation(){
        this.buyBonusButtonAnimation.active = true;
        this.aniLight.play();
    }

    // async test(){
    //     await PromiseEx.CallDelayOnly(2)
    //     this.hide();
    //     await PromiseEx.CallDelayOnly(2)
    //     this.show();

    //     await PromiseEx.CallDelayOnly(2)
    //     this.setTouchEnable(false)
    //     await PromiseEx.CallDelayOnly(2)
    //     this.setTouchEnable(true)
    // }
}


