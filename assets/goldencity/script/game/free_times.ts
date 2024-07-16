import { _decorator, Component, instantiate, Label, math, Node, Sprite, Vec3 } from 'cc';
import { Emitter } from '../../../shared/script/lib/Emitter';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
import { EMIT_UPDATE_FREE_TIMES } from '../config/emit_event';
const { ccclass, property } = _decorator;

// 免费次数展现
@ccclass('FreeTimes')
export class FreeTimes extends Component {
    @property({type:Node})
    ndContent:Node;

    @property({type:Node})
    ndSpace:Node;

    @property({type:Node})
    spFreeLastSpin:Node; // 最后免费旋转

    @property({type:Label})
    lbFreeTimes:Label // 免费次数

    @property({type:Sprite})
    spFreeStartTimes:Sprite; // 剩余免费旋转次数

    @property({type:Node})
    adaptationSpace:Node; // 适配节点

    private emitter:Emitter;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(FreeTimes)
    }


    protected onLoad(): void {
        this.ndSpace.active = false; // 间隙节点隐藏，适配直接调整适配节点
        this.spFreeLastSpin.active = false;
    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
    }

    register() {
        this.emitter.addEventListener(EMIT_UPDATE_FREE_TIMES, this.onEmitUpdateFreeTimes, this);
        // this.emitter.addEventListener(EMIT_VIEW_RESIZE, this.onEmitViewResize, this);
    }

    destroySelf(){
        this.node.destroy();
    }

    getContent(){return this.ndContent;}

    getFreeTimesWorldPos(){
        return NodeEx.getWorldPosition(this.lbFreeTimes.node);
    }

    // 播放数字滚动
    playRollFreeTimes(newTimes: number, duration: number, freeTimes: number){
        TweenEx.Score(this.lbFreeTimes, duration, Number(this.lbFreeTimes.string), newTimes, (lb:Label, currentNum:number)=>{
            lb.string = `${Math.floor(currentNum)}`;
        })
        .start();
    }

    playFreeTimeBounce(newTimes: number, duration: number){
        this.lbFreeTimes.string = `${newTimes}`
        TweenEx.ScaleBounce(this.lbFreeTimes.node, Vec3.ONE.clone(), 0.1, duration / 2, 0).start()
    }

    private onEmitUpdateFreeTimes(times: number){
        if (times <= 0){
            this.spFreeLastSpin.active = true;
            this.lbFreeTimes.node.active = false;
            this.spFreeStartTimes.node.active = false;
            return 
        }

        this.lbFreeTimes.string = `${times}`
        if (this.lbFreeTimes.node.active){
            return 
        }

        // 有可能最后一次又中免费次数
        this.lbFreeTimes.node.active = true;
        this.spFreeLastSpin.active = false;
    }

    private onEmitViewResize(offsetY: number, limitOffsetY:number){
        let height = Math.max(Math.min(offsetY, limitOffsetY), 0);
        height = height + Math.max(0, (NodeEx.getSize(this.ndSpace).height - height) / 2); // 居中显示
        NodeEx.setSize(this.adaptationSpace, null, height);
    }
}


