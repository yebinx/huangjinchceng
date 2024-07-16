import { _decorator, Component, Label, Node, Sprite, tween, Vec3 } from 'cc';
import { Action } from '../action';
import { IAudio } from '../interface';
import { Emitter } from '../lib/Emitter';
import { EMIT_SCORE_TOTAL } from '../config/shared_emit_event';
import { SharedLoadingTips } from '../shared_loading/shared_loading_tips';
const { ccclass, property } = _decorator;

@ccclass('SharedSettingBalance')
export class SharedSettingBalance extends Component {
    @property({type:Sprite})
    spGrayBg:Sprite;

    @property({type:Node})
    spBg:Node = null;

    @property({type:Node})
    root:Node = null;

    @property({type:Node})
    ndCashMoenyBag:Node;

    @property({type:Label})
    lbBalance:Label; // 余额

    @property({type:SharedLoadingTips})
    sharedLoadingTips:SharedLoadingTips = null;

    private audio:IAudio = null;
    private emitter:Emitter;
    private destroyCallback:()=>void;

    protected onLoad(): void {
        this.ndCashMoenyBag.active = false;
    }
    
    protected start(): void {
        this.spBg.active = false;
        this.playEnterAction();
    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this)

        if (this.destroyCallback){
            this.destroyCallback()
        }
    }

    setAudio(audio:IAudio){this.audio = audio;}
    setEmitter(emitter:Emitter){this.emitter = emitter;}

    register(){
        this.emitter.addEventListener(EMIT_SCORE_TOTAL, this.setMoneyBag, this);
    }

    setDestroyCallback(destroyCallback: ()=>void){
        this.destroyCallback = destroyCallback;
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
        .delay(1.0)
        .call(()=>{
            this.sharedLoadingTips.node.destroy(); // 不需要加载，这里只是模拟
            this.ndCashMoenyBag.active = true;
        })
        .start()
    }

    // 关闭
    private onBtnClose(){
        this.playExitAction();
    }
    
    setMoneyBag(v:string){
        this.lbBalance.string = v;
    }
}


