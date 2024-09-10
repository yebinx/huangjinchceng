import { _decorator, Component, instantiate, Node, Prefab, tween, Vec3, Animation, SpriteFrame, Tween } from 'cc';
import { Emitter } from '../../../shared/script/lib/Emitter';
import { SharedBtnList } from '../../../shared/script/shared_btn_list/shared_btn_list';
import { Audio } from '../sound/audio';
import { SharedButtonStart } from '../../../shared/script/shared_btn_list/shared_button_start';
import { EventAfter } from '../../../shared/script/lib/event_after_callback';
import { COLUMN_COUNT } from '../config/game_config';
import { IGame } from '../../../shared/script/interface';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
const { ccclass, property } = _decorator;

@ccclass('BtnList')
export class BtnList extends Component {
    @property({type:SharedBtnList})
    sharedBtnList:SharedBtnList;

    @property({type:SharedButtonStart}) // 开始按钮 
    buttonStart:SharedButtonStart;

    @property({type:Node})
    ndLize:Node; // 粒子图层

    @property({type:Node})
    light:Node; // 发光节点
    
    @property({type:Animation})
    spLightAni:Animation; // 发光动画 

    @property({type:Prefab})
    btnListLizi:Prefab; // 粒子预制体，播放完毕就删除

    @property({type:Animation})
    qidongBackground:Animation; // 启动背景

    @property({type:Animation})
    qidongArrow:Animation; // 启动箭头

    @property({type:SpriteFrame})
    normalRotateIcon:SpriteFrame;

    @property({type:SpriteFrame})
    blurRotateIcon:SpriteFrame;

    private emitter:Emitter = null;
    private playLightAnimation: boolean = false;
    private checkTouchSpaceKeyboard: ()=>boolean;

    protected onLoad(): void {
        this.node.on(EventAfter.START_AFTER, this.onStartAfter, this);
        this.buttonStart.setButtonStartAnimation(this);
        this.buttonStart.setTotalColumnCount(COLUMN_COUNT)
    }

    onStartAfter(){
        this.sharedBtnList.setAudio(Audio.i);
        this.sharedBtnList.setAudioEnable(Audio.i.isOn());
    }

    protected start(): void {
    }

    setGame(game:IGame){
        this.sharedBtnList.setGame(game);
    }

    setEmitter(emitter:Emitter) {
        this.emitter = emitter;
        this.sharedBtnList.setEmitter(emitter);
    }
    
    register() {
        this.sharedBtnList.register();
    }

    setCheckTouchSpaceKeyboard(cb) {this.checkTouchSpaceKeyboard = cb;}

    setCancelAutoStartCb(cb: ()=>void){
        this.sharedBtnList.setCancelAutoStartCb(cb);
    }

    reset(){
        this.sharedBtnList.reset();
    }

    private showLight(){
        this.light.active = this.playLightAnimation;
    }

    // override IBottonStartAnimation
    registerAnimationEvent(){
        // 没有动画事件
    }

    // override IBottonStartAnimation
    playStartAnimation(){
        this.qidongBackground.play();
        this.qidongArrow.play();

        let nd = instantiate(this.btnListLizi)
        nd.parent = this.ndLize;

        this.stopAnimation(false);

        Tween.stopAllByTarget(this.buttonStart.getStartButton().node);

        tween(this.buttonStart.getStartButton().node)
        .to(0.125, {scale: new Vec3(0.87, 0.87, 1)})
        .delay(0.082)
        .to(0.38, {scale: Vec3.ONE.clone()})
        .start();

        // 键盘长按
        if (this.checkTouchSpaceKeyboard()){
            this.buttonStart.getRotateIcon().spriteFrame = this.blurRotateIcon;
        }else{
            TweenEx.DelayCall(this.node, 0.45, ()=>{
                this.buttonStart.getRotateIcon().spriteFrame = this.blurRotateIcon;
                this.buttonStart.checkButtonHover(); // 可能会离开位置
            })
        }
    }

    // override IBottonStartAnimation
    playHoverAnimation(){
        this.playLightAnimation = true;
        // console.log("playHoverAnimation")
        this.spLightAni.play();

        this.unscheduleAllCallbacks();
        // 先播放动画，下帧在显示，否则会跳帧
        this.scheduleOnce(this.showLight.bind(this), 0);
    }

    // override IBottonStartAnimation
    stopAnimation(lastColumeDone: boolean){
        // console.log("stopAnimation")
        this.playLightAnimation = false;
        this.light.active = false;
        this.spLightAni.stop();
        if (lastColumeDone){
            Tween.stopAllByTarget(this.node);
            this.buttonStart.getRotateIcon().spriteFrame = this.normalRotateIcon;
        }
    }
}


