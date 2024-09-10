import { _decorator, Button, Component, Label, Node, NodeEventType, Animation, EventMouse, UIOpacity, instantiate } from 'cc';
import { SharedConfig } from '../../../shared/script/config/shared_config';
import { Action } from '../../../shared/script/action';
import {Audio} from "../sound/audio"
const { ccclass, property } = _decorator;

// 购买奖金游戏

@ccclass('BuyBonus')
export class BuyBonus extends Component {
    @property({type:UIOpacity})
    spGrayBg:UIOpacity;

    @property({type:UIOpacity})
    ndRoot:UIOpacity;

    @property({type:Label})
    lbPrice:Label;

    @property({type:Button})
    btnLeft:Button;

    @property({type:Button})
    btnRight:Button;

    @property({type:[Animation]})
    szBuyBonusButtonAnimation:Animation[] = []; // 0左 1右

    private buyCallback: ()=>void;
    private closeCallback: ()=>void;
    private isClose = false;
    private isBuy = false;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(BuyBonus)
    }

    protected onLoad(): void {
        this.spGrayBg.opacity = 0;
        this.ndRoot.opacity = 0;
        this.ndRoot.node.active = false;
        this.szBuyBonusButtonAnimation[0].node.active = false;
        this.szBuyBonusButtonAnimation[1].node.active = false;
    }

    protected start(): void {
        Action.grayLayerFadeInOpacity(this.spGrayBg.node, 0.1, ()=>{
            this.ndRoot.node.active = true;
            Action.showScale(this.ndRoot.node)
            Action.grayLayerFadeInOpacity(this.ndRoot.node)
        })

        Audio.i.playBonusBuyFrameOpen()
    }

    register(){
        this.btnLeft.node.on(NodeEventType.MOUSE_ENTER, this.onEventMouseEnter.bind(this, this.szBuyBonusButtonAnimation[0]), this);
        this.btnLeft.node.on(NodeEventType.MOUSE_LEAVE, this.onEventMouseLevel.bind(this, this.szBuyBonusButtonAnimation[0]), this);
        this.btnRight.node.on(NodeEventType.MOUSE_ENTER, this.onEventMouseEnter.bind(this, this.szBuyBonusButtonAnimation[1]), this);
        this.btnRight.node.on(NodeEventType.MOUSE_LEAVE, this.onEventMouseLevel.bind(this, this.szBuyBonusButtonAnimation[1]), this);
    }

    setBuyCallback(cb:()=>void){
        this.buyCallback = cb;
    }

    setCloseCallback(cb:()=>void){
        this.closeCallback = cb;
    }

    setPrice(price:number){
        this.lbPrice.string = SharedConfig.ScoreFormat(price);
    }

    private onBtnCancel(){
        this.close();
    }

    private onBtnStart(){
        this.isBuy = true;
        Audio.i.playBuyBonusGameStart();
        this.close();
    }

    private close(){
        if (this.isClose){
            return;
        }

        this.isClose = true;
        this.ndRoot.node.active = false;

        Action.grayLayerFadeOutOpacity(this.spGrayBg.node, 0.1, ()=>{
            if (this.closeCallback){
                this.closeCallback();
            }

            this.node.destroy()

            if (this.isBuy){
                if (this.buyCallback) {
                    this.buyCallback();
                }
            }
        })
    }

    private onEventMouseEnter(animation:Animation, event:EventMouse){
        this.playLightAnimation(animation);
    }

    private onEventMouseLevel(animation:Animation, event:EventMouse){
        this.stopLightAnimation(animation);
    }

    private stopLightAnimation(animation:Animation){
        animation.node.active = false;
        animation.stop()
    }

    private playLightAnimation(animation:Animation){
        animation.node.active = true;
        animation.play();
    }
}


