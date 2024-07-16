import { _decorator, Component, Node, Size, Widget } from 'cc';
import { Emitter } from '../lib/Emitter';
import { NodeEx } from '../lib/NodeEx';
import { EMIT_VIEW_RESIZE } from '../config/shared_emit_event';
const { ccclass, property } = _decorator;

// 适配，顶部一个节点变宽往下顶，缩小下方显示的容器的高度

@ccclass('SharedMenuAdaptation')
export class SharedMenuAdaptation extends Component {
    @property({type:Node})
    ndAdaptationSpace:Node; // 适配节点

    @property({type:Node})
    ndContent:Node;

    private emitter:Emitter;
    private contentSize:Size;
    
    protected onLoad(): void {
        if(this.ndContent){
            this.contentSize = NodeEx.getSize(this.ndContent);    
        }
    }

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
        
        if (this.ndContent){
            NodeEx.setSize(this.ndContent, null, this.contentSize.height - height*2);
            let widget = this.ndContent.getComponent(Widget);
            if (widget){
                widget.updateAlignment();
            }
        }
    }
}


