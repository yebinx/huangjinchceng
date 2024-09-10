import { _decorator, Button, Component, Label, Node, Sprite, Tween, tween, Vec3 } from 'cc';
import { Emitter } from '../../../shared/script/lib/Emitter';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
import { IAudio, IGame } from '../interface';
import { EMIT_BALANCE_OPEN, EMIT_EXIT_GAME_OPEN, EMIT_GAME_HISTORY_OPEN, EMIT_GAME_RULE_OPEN, EMIT_GAME_START, EMIT_RATE_RULE_OPEN, EMIT_SCORE_BET, EMIT_SETTING_ADD_BET, EMIT_SETTING_BET_OPEN, EMIT_SETTING_MINUS_BET, EMIT_SETTING_QUICK, EMIT_SETTING_START_OPEN, EMIT_SWITCH_AUDIO, EMIT_UPDATA_AUTO_START_TIMES } from '../config/shared_emit_event';
import { SharedButtonStart } from './shared_button_start';
import { SharedButtonQuick } from './shared_button_quick';
import { I_EMIT_SCORE_BET } from '../config/shared_emit_interface';
import { SharedAutoStart } from './shared_auto_start';
import { SharedLightning } from './shared_lightning';
const { ccclass, property } = _decorator;

@ccclass('SharedBtnList')
export class SharedBtnList extends Component {
    @property({type:SharedButtonStart}) // 开始按钮
    buttonStart:SharedButtonStart

    @property({type:SharedAutoStart}) // 自动开始按钮
    buttonAutoStart:SharedAutoStart

    @property({type:Node})
    ndFix:Node

    @property({type:Sprite}) // 挂载空的Sprite，只是为了使用透明度 
    ndBtnListNormal:Sprite; 

    @property({type:Sprite}) // 菜单列表
    ndBtnListMenu:Sprite;
   
    @property({type:Button})
    btnSettingStart:Button // 旋转设置

    @property({type:Button}) // 增加筹码
    btnSettingAdd:Button

    @property({type:Button}) // 减少筹码
    btnSettingMinus:Button

    @property({type:Button}) // 菜单
    btnMenu:Button

    @property({type:Node})
    spAudioCloseFlg:Node;// 声音关闭标志

    @property({type:[Node]}) // 声音 0开 1关
    szSound:Node[] = []

    @property({type:Node})
    ndAdaptationSpace:Node;

    @property({type:Node})
    ndFreeSpace:Node; // 可用的空间范围

    @property({type:SharedButtonQuick})
    sharedButtonQuick:SharedButtonQuick;
    
    private audio:IAudio = null;
    private emitter:Emitter = null;
    private game:IGame = null;

    setAudio(audio: IAudio){this.audio = audio;}

    setEmitter(emitter:Emitter) {
        this.emitter = emitter;
        this.buttonStart.setEmitter(emitter);
        this.sharedButtonQuick.setEmitter(emitter);
        this.buttonAutoStart.setEmitter(emitter);
    }

    setGame(game:IGame){this.game = game;}

    protected onLoad(): void {
        this.updateSound(true)
        this.ndFreeSpace.active = false;
    }

    protected start(): void {
        // TODO 不要在这里开启音效，应该在具体项目里面控制，否则可能会有些初始化的音效逻辑无法控制
        // this.setAudioEnable(true);

        this.onEmitUpdateAutoStartTimes(0)
        this.fadeIn(this.ndBtnListNormal, 0)
        this.fadeOut(this.ndBtnListMenu, 0)
    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);
    }

    setCancelAutoStartCb(func:()=>void){
        this.buttonAutoStart.setCancelAutoStart(func);
    }

    register() {
        this.emitter.addEventListener(EMIT_UPDATA_AUTO_START_TIMES, this.onEmitUpdateAutoStartTimes, this);
        this.emitter.addEventListener(EMIT_GAME_START, this.onEmitGameStart, this);
        this.emitter.addEventListener(EMIT_SCORE_BET, this.onEmitScoreBet, this);
        // this.emitter.addEventListener(EMIT_VIEW_RESIZE, this.onEmitViewResize, this);
        this.buttonStart.register();
        this.buttonAutoStart.register();
    }

    reset(){
        this.buttonStart.reset();
        this.btnSettingStart.interactable = true;
        NodeEx.setColor(this.btnSettingStart.target, this.btnSettingStart.normalColor);
        this.btnSettingAdd.interactable = true;
        this.btnSettingMinus.interactable = true;
        this.btnMenu.interactable = true;
    }

    private playMenuOpen(){
        this.game.addBtnList();
        this.ndFix.active = false;

        let duration = 0.15;
        this.fadeOut(this.ndBtnListNormal, duration);
        this.fadeIn(this.ndBtnListMenu, duration);
    }

    // 菜单关闭
    private playMenuClose(){
        this.game.cancelBtnList();
        this.ndFix.active = true;

        let duration = 0.15;
        this.fadeIn(this.ndBtnListNormal, duration);
        this.fadeOut(this.ndBtnListMenu, duration);
    }

    // 淡出动画
    private fadeIn(sp: Sprite, duration: number){
        Tween.stopAllByTarget(sp.node)
        sp.node.active = true;

        TweenEx.FadeIn(sp, duration, null).start();

        tween(sp.node)
        .to(duration, {position: Vec3.ZERO})
        .start()
    }

    private fadeOut(sp: Sprite, duration: number){
        Tween.stopAllByTarget(sp.node)

        TweenEx.FadeOut(this.ndBtnListMenu, duration, null,
        ()=>{
            sp.node.active = false;
        }).start()

        tween(sp.node)
        .to(duration, {position: new Vec3(0, -150, 0)})
        .start()
    }

    // 旋转设置
    private onBtnSettingStart(){
        this.emitter.emit(EMIT_SETTING_START_OPEN);
    }

    // 增加投注
    private onBtnAddBet(){
        this.emitter.emit(EMIT_SETTING_ADD_BET);
    }

    // 减少投注
    private onBtnMinusBet(){
        this.emitter.emit(EMIT_SETTING_MINUS_BET);
    }

    private setColorLikePressed(btn:Button, enable: boolean){
        if (enable){
            let pressedColor = btn.pressedColor.clone();
            btn.normalColor = pressedColor.clone();
            btn.hoverColor = pressedColor.clone();
        }else{
            let normalColor = btn.pressedColor.clone()
            normalColor.a = 255;
            btn.normalColor = normalColor;
            btn.hoverColor = normalColor.clone();
        }
    }

    // 查看钱包
    private onBtnCash(){
        this.emitter.emit(EMIT_BALANCE_OPEN);
    }

    private onBtnMenu(){
        this.playMenuOpen()
        this.audio.playOpenMenu();
    }

    private onBtnCloseMenu(){
        this.playMenuClose();
        this.audio.playCloseMenu();
    }

    // 退出提示
    private onBtnExit(){
        this.emitter.emit(EMIT_EXIT_GAME_OPEN);
    }

    // 查看赔率
    private onBtnRate(){
        this.emitter.emit(EMIT_RATE_RULE_OPEN);
    }

    // 查看规则
    private onBtnRule(){
        this.emitter.emit(EMIT_GAME_RULE_OPEN);
    }

    private onBtnSound(){
        let enanble = (!this.szSound[0].active);
        this.setAudioEnable(enanble)
    }

    // 更新音效开关
    setAudioEnable(enable: boolean){
        this.updateSound(enable)
        this.spAudioCloseFlg.active = (!enable);

        if (enable){
            this.audio.on();
        }else{
            this.audio.off();
        }

        this.emitter.emit(EMIT_SWITCH_AUDIO, enable);
    }

    // 查看记录
    private onBtnHistory(){
        this.emitter.emit(EMIT_GAME_HISTORY_OPEN);
    }

    private updateSound(on: boolean){
        this.szSound[0].active = on;
        this.szSound[1].active = !on;
    }

    // 游戏开始
    private onEmitGameStart(){
        this.buttonStart.playGameStart();
        this.btnSettingStart.interactable = false;
        NodeEx.setColor(this.btnSettingStart.target, this.btnSettingStart.disabledColor);
        this.btnSettingAdd.interactable = false;
        this.btnSettingMinus.interactable = false;
        this.btnMenu.interactable = false;
    }

    private onEmitScoreBet(emitArgs:I_EMIT_SCORE_BET){
        if (!emitArgs.isChange){
            return 
        }
        this.setColorLikePressed(this.btnSettingMinus, this.game.isMinBetLevel());
        this.setColorLikePressed(this.btnSettingAdd, this.game.isMaxBetLevel());
    }

    //  更新自动开始次数
    private onEmitUpdateAutoStartTimes(times: number) {
        if (times > 0){
            if (!this.buttonStart.node.active){
                return 
            }

            this.buttonAutoStart.show();
            this.buttonStart.node.active = false;
        }else{
            if (!this.buttonStart.node.active){
                this.buttonAutoStart.hide();
                this.buttonStart.node.active = true;
            }
        }
    }

    //
    private onEmitViewResize(offsetY: number, limitOffsetY:number){
        let height = Math.min(offsetY, limitOffsetY);
        height = height + Math.max(0, (NodeEx.getSize(this.ndFreeSpace).height - height) / 2);
        NodeEx.setSize(this.ndAdaptationSpace, null, height);
    }
}


