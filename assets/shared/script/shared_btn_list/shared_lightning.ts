import { _decorator, Component, Node, sp, Sprite } from 'cc';
import { RandomEx } from '../lib/RandomEx';
const { ccclass, property } = _decorator;

@ccclass('SharedLightning')
export class SharedLightning extends Component {
    @property({type:Sprite})
    spLightning:Sprite;

    @property({type:sp.Skeleton})
    skLightning:sp.Skeleton; // 闪电

    @property({type:sp.Skeleton})
    skElectricity:sp.Skeleton; // 电

    private szStandbyAnimationName = ["daiji", "daiji2", "daiji3", "daiji4", "daiji5"];

    protected onLoad(): void {
        this.skLightning.node.active = false;
        this.skElectricity.node.active = false;
        this.skElectricity.setCompleteListener(this.playFinish.bind(this))
    }

    firstShow(){
        this.spLightning.node.active = false;
        this.skLightning.node.active = true;
        this.show();
    }

    show(){
        this.skLightning.node.active = true;
        this.skLightning.animation = "shanshuo";

        this.randomElectricity()
    }

    hide(){
        this.skLightning.animation = null;
        this.skLightning.node.active = false;
        this.skElectricity.animation = null;
        this.skElectricity.node.active = false;
    }

    private randomElectricity(){
        let key = RandomEx.getRandomValue(0, this.szStandbyAnimationName.length, 100);
        this.skElectricity.animation = this.szStandbyAnimationName[key];
        this.skElectricity.node.active = true;
    }

    private playLightning(){
        this.skLightning.node.active = true;
        this.skLightning.animation = "shandian"
    }

    private playFinish(trackEntry: sp.spine.TrackEntry){
        if (!trackEntry.isComplete()){
           return 
        }

        this.randomElectricity();
        this.playLightning()
    }
}


