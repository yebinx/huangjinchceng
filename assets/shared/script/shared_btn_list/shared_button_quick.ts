import { _decorator, Component, Node, Sprite, Animation } from 'cc';
import { EMIT_SETTING_QUICK } from '../config/shared_emit_event';
import { Emitter } from '../lib/Emitter';
import { SharedLightning } from './shared_lightning';
const { ccclass, property } = _decorator;

@ccclass('SharedButtonQuick')
export class SharedButtonQuick extends Component {
    @property({type:SharedLightning}) 
    sharedLightning:SharedLightning; // 闪电
    
    @property({type:Node})
    ndOn:Node

    @property({type:Node})
    ndOff:Node
    
    private emitter:Emitter = null;
    private firstTouch = true;
    
    protected onLoad(): void {
        this.setQuick(true);
    }

    setEmitter(emitter:Emitter) {
        this.emitter = emitter;
    }

    setQuick(enable: boolean){
        this.ndOn.active = enable;
        this.ndOff.active = !enable;

        if (enable){
            this.sharedLightning.show();
        }else{
            this.sharedLightning.hide();
        }
    }

    // 投注设置
    private onBtnSettingQuick(){
        if (this.firstTouch){
            this.firstTouch = false;
            this.sharedLightning.firstShow();
            this.emitter.emit(EMIT_SETTING_QUICK, true);
            return 
        }

        let enable = (!this.ndOn.active);
        this.setQuick(enable)
        this.emitter.emit(EMIT_SETTING_QUICK, enable);
    }
}


