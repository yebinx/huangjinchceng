import { _decorator, Button, Component, EventMouse, Label, Node, NodeEventType, Animation } from 'cc';
import { Emitter } from '../lib/Emitter';
import { EMIT_UPDATA_AUTO_START_TIMES } from '../config/shared_emit_event';
const { ccclass, property } = _decorator;

@ccclass('SharedAutoStart')
export class SharedAutoStart extends Component {
    @property({type:Button}) // 取消自动开始
    btnCancelAutoStart:Button
    
    @property({type:Label}) // 自动开始次数
    lbAutoStartTimes:Label

    @property({type:Animation})
    hoverAnimation:Animation; // hover动画，在合适的位置挂载

    @property({type:Node})
    hoverNode:Node; // hover节点，在合适的位置挂载

    private emitter:Emitter = null;
    private cancelAutoStartCallback: ()=>void // 取消自动开始按钮回调

    protected onLoad(): void {
        this.onEventMouseLevel(null);
    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);
    }
    
    setEmitter(emitter:Emitter) {this.emitter = emitter;}

    register(){
        this.node.on(NodeEventType.MOUSE_ENTER, this.onEventMouseEnter, this);
        this.node.on(NodeEventType.MOUSE_LEAVE, this.onEventMouseLevel, this);
        this.emitter.addEventListener(EMIT_UPDATA_AUTO_START_TIMES, this.onEmitUpdateAutoStartTimes, this);
    }

    setHoverNode(hoverNode:Node){this.hoverNode = hoverNode;}
    setHoverAnimation(hoverAnimation:Animation){this.hoverAnimation = hoverAnimation;}
    setCancelAutoStart(cb:()=>void){this.cancelAutoStartCallback = cb;}

    hide(){
        this.node.active = false;
        this.onEventMouseLevel(null);
    }

    show(){
        this.node.active = true;
    }

    // 取消自动旋转
    private onBtnCancelAutoStart(){
        if (this.cancelAutoStartCallback){
            this.cancelAutoStartCallback()
        }
    }

    //  更新自动开始次数
    private onEmitUpdateAutoStartTimes(times: number) {
        this.lbAutoStartTimes.string = `${times}`
    }

    private onEventMouseEnter(event: EventMouse){
        if (!this.hoverNode){
            return 
        }

        this.hoverNode.active = true;
        this.hoverAnimation.play();
    }

    private onEventMouseLevel(event: EventMouse){
        if (!this.hoverNode){
            return 
        }

        this.hoverNode.active = false;
        this.hoverAnimation.stop();
    }
}


