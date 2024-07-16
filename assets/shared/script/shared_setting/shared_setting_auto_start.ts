import { _decorator, Button, color, Color, Component, EventTouch, Label, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Emitter } from '../lib/Emitter';
import { ButtonEx } from '../lib/button/ButtonEx';
import { Action } from '../action';
import { NodeEx } from '../lib/NodeEx';
import { EMIT_VIEW_RESIZE } from '../config/shared_emit_event';
import { SharedSettingUserInfo } from './shared_setting_user_info';
import { IAudio } from '../interface';
import { SharedConfig } from '../config/shared_config';

const { ccclass, property } = _decorator;

// 设置 自动旋转

@ccclass('SharedSettingAutoStart')
export class SharedSettingAutoStart extends Component {
    @property({type:Sprite})
    spGrayBg:Sprite;

    @property({type:Node})
    spBg:Node = null; // 背景，最先出现

    @property({type:Node})
    root:Node = null; 

    @property({type:Button})
    btnAutoStart:Button = null;

    @property({type:[Node]})
    ndAdaptationSpace:Node[] = []; // 适配节点

    @property({type:SharedSettingUserInfo})
    settingUserInfo:SharedSettingUserInfo

    private ndOldSelectCount:Node = null; // 选择次数节点记录
    private selectTimes: number = 0;
    private emitter:Emitter;
    private audio:IAudio = null;
    private autoStartCallback:(selectTimes: number)=>void;
    private destroyCallback:()=>void;

    protected onLoad(): void {
        ButtonEx.InteractableOpacity(this.btnAutoStart, false, 0.25);
    }

    protected start(): void {
        // this.test()

        this.spBg.active = false;
       
        this.playEnterAction()
    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);

        if (this.ndOldSelectCount != null){
            this.autoStartCallback(this.selectTimes);
        }

        if (this.destroyCallback){
            this.destroyCallback();
        }
    }
    
    setEmitter(emitter:Emitter){
        this.emitter = emitter;
        this.settingUserInfo.setEmitter(emitter);
    }

    setAudio(audio:IAudio){this.audio = audio;}

    setAutoStartCallback(callBack: (selectTimes: number)=>void){
        this.autoStartCallback = callBack;
    }

    setDestroyCallback(destroyCallback: ()=>void){
        this.destroyCallback = destroyCallback;
    }

    register(){
        this.emitter.addEventListener(EMIT_VIEW_RESIZE, this.onEmitViewResize, this);
        this.settingUserInfo.register()
    }

    private playExitAction(){
        if (this.audio){
            this.audio.playCloseMenu();
        }

        tween(this.spBg)
        .call(()=>{
            this.root.active = false;
        })
        .by(0.15, {position: new Vec3(0, -1000, 0)})
        .call(()=>{
            Action.grayLayerFadeOut(this.spGrayBg, 0.3, ()=>{
                this.node.destroy();
            });
        })
        .start()
    }

    private playEnterAction(){
        if (this.audio){
            this.audio.playOpenMenu();
        }
        
        this.spBg.position = this.spBg.position.add(new Vec3(0, -2000, 0));
        this.spBg.active = true;
        this.root.active = false;
        Action.grayLayerFadeIn(this.spGrayBg, 0.3);

        tween(this.spBg)
        .to(0.3, {position: new Vec3(0, 0, 0)})
        .call(()=>{
            this.root.active = true;
            Action.grayLayerFadeIn(this.root.getComponent(Sprite), 0.4)
        })
        .start()
    }

    private onBtnClose(){
        this.ndOldSelectCount = null;
        this.playExitAction();
    }

    // 开始自动旋转
    private onBtnStartAuto(){
        this.playExitAction();
    }

    // 选择旋转次数
    private onBtnSelectStartTimes(event:EventTouch, value: string){
        if (!this.btnAutoStart.interactable){
            ButtonEx.InteractableOpacity(this.btnAutoStart, true);
        }

        this.updataSelectTimes(event.target, Number(value));
    }

    // 更新选中次数
    private updataSelectTimes(target:Node, selectTimes:number) {
        if (this.ndOldSelectCount == target){
            return 
        }

        if (this.ndOldSelectCount != null){
            let title = this.ndOldSelectCount.getComponentInChildren(Label);
            title.color = new Color(144, 144, 144, 255);
        }

        let targetTitle = target.getComponentInChildren(Label);
        targetTitle.color = SharedConfig.THEME_COLOR;

        this.ndOldSelectCount = target;
        this.selectTimes = selectTimes;
    }

    private onEmitViewResize(offsetY: number, limitOffsetY:number){
        let height = Math.max(Math.min(offsetY, limitOffsetY), 0)
        NodeEx.setSize(this.ndAdaptationSpace[0], null, height);
        NodeEx.setSize(this.ndAdaptationSpace[1], null, height);
    }

    // //-----------------------------
    // test(){
    //     this.setSelectSpeedBtn(true)
    // }
}


