import { _decorator, Component, Node, Animation, ParticleSystem2D, Tween, Vec3, Vec2, instantiate } from 'cc';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import Cell from '../roll/cell';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
import { PromiseEx } from '../../../shared/script/lib/PromiseEx';
import { ConfigMethod } from '../config/config_method';
const { ccclass, property } = _decorator;

// 夺宝等待一个效果

@ccclass('ScatterWaitOne')
export class ScatterWaitOne extends Component {
    @property({type:Animation})
    spAniStart:Animation; // 动画炸开

    @property({type:Animation})
    spBackLight:Animation; // 背后的光

    @property({type:Animation})
    spFrontLight:Animation; // 前面的光

    @property({type:Node})
    ndScatter:Node; // 夺宝节点

    @property({type:ParticleSystem2D})
    particle:ParticleSystem2D; // 粒子

    private scatterNode:Cell;
    private worldPos:Vec3;
    private scatterOldParent:Node;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(ScatterWaitOne)
    }

    protected onLoad(): void {
        this.setParticeCustom()
    }
    // -130   -79
    protected start(): void {
        // this.test();
    }

    setScatterNode(scatterNode:Cell){
        this.scatterNode = scatterNode;
        this.worldPos = scatterNode.getWorldPosition();
        this.scatterOldParent = scatterNode.node.parent;

        scatterNode.node.parent = this.ndScatter;
        this.node.position = NodeEx.getLocalPosition(this.node.parent, this.worldPos);
        scatterNode.node.position = Vec3.ZERO;
    }

    scatterReduction(){
        if (!this.scatterNode){
            return
        }

        this.scatterNode.node.parent = this.scatterOldParent;
        this.scatterNode.node.position = NodeEx.getLocalPosition(this.scatterNode.node.parent, this.worldPos);
        this.scatterNode = null;
    }

    playStart(){
        Tween.stopAllByTarget(this.node);

        this.spBackLight.node.active = false;
        this.spFrontLight.node.active = false;
        this.particle.node.active = false;

        this.spAniStart.node.active = true;

        let {space} = ConfigMethod.decodeItemType(this.scatterNode.getSymbolId());
        if (space == 1){
            this.particle.node.position = new Vec3(0, -79, 1);
            this.spAniStart.node.position = Vec3.ZERO;
            this.spBackLight.node.position = Vec3.ZERO;
            this.spFrontLight.node.position = Vec3.ZERO;
        }else{
            this.particle.node.position = new Vec3(0, 0, 1);
            let offsetPos = this.scatterNode.getBgOffsetPoint().clone()
            this.spAniStart.node.position = offsetPos;
            this.spBackLight.node.position = offsetPos;
            this.spFrontLight.node.position = offsetPos;
        }

        this.spAniStart.play();

        TweenEx.DelayCall(this.node, 0.5, this.playLoop.bind(this))
    }

    private playLoop(){
        this.spBackLight.node.active = true;
        this.spFrontLight.node.active = true;
        this.particle.node.active = true;

        this.spBackLight.play();
        this.spFrontLight.play();
        this.particle.resetSystem();
        TweenEx.DelayCall(this.node, 0.3, ()=>{
            this.spAniStart.node.active = false;
        })
    }

    private setParticeCustom(){
        this.particle.posVar = new Vec2(65, 0);
        this.particle.speedVar = 10;
        this.particle.lifeVar = 0.18;
    }

    // async test(){
    //     await PromiseEx.CallDelayOnly(2);
    //     this.playStart();
    // }
}


