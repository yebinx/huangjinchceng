import { _decorator, Button, Component, EventMouse, NodeEventType,sp, Sprite, Tween, tween, Vec3 } from 'cc';
import { Emitter } from '../../../shared/script/lib/Emitter';
import { EMIT_BTN_STAR, EMIT_BTN_STOP, EMIT_COLUME_DONE } from '../config/shared_emit_event';
import { IBottonStartAnimation, IStartButtonAniName } from '../interface';
const { ccclass, property } = _decorator;

enum ButtonStatus {
    NORMAL,
    PLAYING,
    DISABLE
}

// 开始按钮
@ccclass('SharedButtonStart')
export class SharedButtonStart extends Component {
    @property({type:Button})
    sharedButtonStart:Button; // 开始按钮

    @property({type:Sprite})
    buttonStart:Sprite; // 背景图
  
    @property({type:Sprite})
    spStartRotate:Sprite; // 按钮里面的旋转节点

    private status:ButtonStatus = ButtonStatus.NORMAL;
    private emitter:Emitter = null;
    private isButtonHover = false;
    private totalColumnCount = 0; // 总轴数
    private buttonStartAnimation:IBottonStartAnimation = null;

    protected onLoad(): void {
        this.playNormalRotate();
    }

    start() {
        this.buttonStartAnimation.stopAnimation(false);
        this.buttonStartAnimation.registerAnimationEvent();
    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);
    }

    setEmitter(emitter: Emitter){this.emitter = emitter;}
    setTotalColumnCount(columnCount: number){this.totalColumnCount = columnCount;}
    setButtonStartAnimation(buttonStartAnimation: IBottonStartAnimation){this.buttonStartAnimation = buttonStartAnimation;}
    getStartButton(){ return this.sharedButtonStart; }
    // 获取按钮底部背景
    getButtonStartBackground() {return this.buttonStart;}
    // 获取旋转图标
    getRotateIcon() { return this.spStartRotate; }

    register(){
        this.emitter.addEventListener(EMIT_COLUME_DONE, this.onEmitColumeDone, this);
        this.emitter.addEventListener(EMIT_BTN_STOP, this.onEmitStop, this);
        this.node.on(NodeEventType.MOUSE_ENTER, this.onEventMouseEnter, this);
        this.node.on(NodeEventType.MOUSE_LEAVE, this.onEventMouseLevel, this);
    }

    playGameStart(){
        this.status = ButtonStatus.PLAYING;
        if (this.node.active){
            this.playStart()
        }
    }

    reset(){
        this.setEnable(true);
        this.playNormalRotate();
        this.checkButtonHover();
    }

    private onClick(){
        if (this.status == ButtonStatus.NORMAL){
            this.emitter.emit(EMIT_BTN_STAR);
        }else if (this.status == ButtonStatus.PLAYING){
            this.emitter.emit(EMIT_BTN_STOP);
        }
    }
   
    // 最后一轴停止
    private onEmitColumeDone(col: number){
        if (col != this.totalColumnCount-1){
            return;
        }

        this.setEnable(false);
        this.stopRotate();
        this.buttonStartAnimation.stopAnimation(true);
    }

    private onEmitStop(){
        this.setEnable(false)
        this.buttonStartAnimation.stopAnimation(false);
    }

    private setEnable(enble:boolean){
        if (enble){
            this.status = ButtonStatus.NORMAL;
            this.sharedButtonStart.interactable = true;
            this.spStartRotate.grayscale = false;
            return 
        }

        this.status = ButtonStatus.DISABLE;
        this.sharedButtonStart.interactable = false;
        this.spStartRotate.grayscale = true;
    }

    // 播放开始动画
    private playStart(){
        this.playQuickRotate()
        this.buttonStartAnimation.playStartAnimation();
    }

    private playNormalRotate(){
        this.stopRotate();

        tween(this.spStartRotate.node)
        .repeatForever(
            tween(this.spStartRotate.node)
            .by(3.5, {angle: -360})
            .by(0, {angle: 0})
        )
        .start()
    }

    private playQuickRotate(){
        this.stopRotate();

        tween(this.spStartRotate.node)
        .repeatForever(
            tween(this.spStartRotate.node)
            .by(0.4, {angle: -360})
            .by(0, {angle: 0})
        )
        .start()
    }

    private stopRotate(){
        Tween.stopAllByTarget(this.spStartRotate.node);
    }

    // 重置后，鼠标可能会在按钮上
    checkButtonHover(){
        if (!this.isButtonHover){
            return 
        }

        this.buttonStartAnimation.playHoverAnimation();
    }

    private onEventMouseEnter(event:EventMouse){
        this.isButtonHover = true;
        if (this.status == ButtonStatus.DISABLE){
            return
        }
        this.buttonStartAnimation.playHoverAnimation();
    }

    private onEventMouseLevel(event:EventMouse){
        this.isButtonHover = false;
        if (this.status == ButtonStatus.DISABLE){
            return
        }
        this.buttonStartAnimation.stopAnimation(false);
    }
}

