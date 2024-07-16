import { _decorator, Component, Label, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { TweenEx } from '../lib/TweenEx';
import { NodeEx } from '../lib/NodeEx';
const { ccclass, property } = _decorator;

// 极速模式开关提示

@ccclass('SharedNormalQuickTips')
export class SharedNormalQuickTips extends Component {
    @property({type:Sprite})
    spBg:Sprite;

    @property({type:Sprite})
    spFlg:Sprite;

    @property({type:Label})
    lbTips:Label;

    @property({type:[SpriteFrame]})
    szFlg:SpriteFrame[] = []; // 0 关闭 1开启

    setInfo(isQuick: boolean){
        if (isQuick){
            this.spFlg.spriteFrame = this.szFlg[1];
            this.lbTips.string = l10n.t("shared_quick_on_tips")
        }else{
            this.spFlg.spriteFrame = this.szFlg[0];
            this.lbTips.string = l10n.t("shared_quick_off_tips")
        }

        let actionNode = this.spBg.node;
        Tween.stopAllByTarget(actionNode);
        NodeEx.setOpacity(actionNode, 255);
        
        this.spFlg.node.active = false;
        tween(actionNode)
        .to(0.12, {scale: new Vec3(1.2, 1.2, 1.2)})
        .call(()=>{
            this.spFlg.node.active = true;
        })
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


