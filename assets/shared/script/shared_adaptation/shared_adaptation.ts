import { _decorator, Component, Node, Size } from 'cc';
import { Emitter } from '../lib/Emitter';
import { NodeEx } from '../lib/NodeEx';
import { EMIT_VIEW_RESIZE } from '../config/shared_emit_event';

const { ccclass, property } = _decorator;

@ccclass('SharedAdaptation')
export class SharedAdaptation extends Component {
    @property({type:Node})
    ndAdaptationSpace:Node; // 适配节点
   
    private emitter:Emitter;

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this)
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
    }

    register(){
        this.emitter.addEventListener(EMIT_VIEW_RESIZE, this.onEmitViewResize, this);
    }
    
    private onEmitViewResize(offsetY: number, limitOffsetY:number){
        let height = Math.max(Math.min(offsetY, limitOffsetY), 0);
        NodeEx.setSize(this.ndAdaptationSpace, null, height);
    }
}


