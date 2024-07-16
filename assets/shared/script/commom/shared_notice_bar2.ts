import { _decorator, Component, Label, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { TweenEx } from '../lib/TweenEx';
import { NodeEx } from '../lib/NodeEx';
const { ccclass, property } = _decorator;

// 提示条

@ccclass('SharedNoticeBar2')
export class SharedNoticeBar2 extends Component {
    @property({type:Sprite})
    spBg:Sprite;

    @property({type:Label})
    lbTips:Label;

    setInfo(info:string){
        this.lbTips.string = info;
        let actionNode = this.spBg.node;
        Tween.stopAllByTarget(actionNode);
        NodeEx.setOpacity(actionNode, 255);
        
        tween(actionNode)
        .to(0.12, {scale: new Vec3(1.2, 1.2, 1.2)})
        .to(0.12, {scale: Vec3.ONE})
        .delay(2.5)
        .call(()=>{
            TweenEx.FadeOut(this.spBg, 0.5, null, ()=>{
                this.node.destroy();
            })
            .start()
        })
        .start();
    }

    destroySelf(){
        this.node.destroy();
    }
}


