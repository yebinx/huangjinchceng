import { _decorator, Component, instantiate, Label, Node, Prefab, sp, Sprite, Vec3 } from 'cc';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { AddFreeTimesBg } from './add_free_times_bg';
const { ccclass, property } = _decorator;

// 增加免费次数效果

@ccclass('AddFreePlay')
export class AddFreePlay extends Component {
    @property({type:sp.Skeleton})
    zhongjiang:sp.Skeleton;

    @property({type:sp.Skeleton})
    zhongjiangLight:sp.Skeleton;

    @property({type:Sprite})
    spFreeTitle:Sprite;

    @property({type:Label})
    lbFreeTimes:Label; // 获得免费次数

    @property({type:Node})
    ndAddFreeTimesLayer:Node;

    @property({type:Prefab})
    addFreeTimesBg:Prefab;

    private destroyCallback: Function
    private freeTimesContent:Node; // 播放效果需要把免费次数的次数置顶
    private freeTimesLocalPos:Vec3;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(AddFreePlay)
    }

    protected onLoad(): void {
        this.zhongjiang.setCompleteListener(this.onEventComplete.bind(this))
    }
    
    start() {
        this.zhongjiang.animation = "mianfei_chuxian"
    }

    protected onDestroy(): void {
        if (this.destroyCallback != null){
            this.destroyCallback();
        }
    }

    // 显示免费次数
    setFreeTimes(freeTimes:number){
        this.lbFreeTimes.string = `${freeTimes}`;
    }

    // 更换freetimes的图层显示
    setFreeTimeContent(node:Node, freeTimesWorldPos: Vec3){
        node["old_parent"] = node.parent;
        node["world_position"] = NodeEx.getWorldPosition(node);
        node["sibling_index"] = node.getSiblingIndex();
        node.parent = this.node;
        node.position = NodeEx.getLocalPosition(this.node, node["world_position"]);
        this.freeTimesContent = node;

        this.freeTimesLocalPos = NodeEx.getLocalPosition(this.node, freeTimesWorldPos);

        this.getAddFreeTimesBg().playChuxian()
    }

    setDestroyCallback(callback:Function){
        this.destroyCallback = callback;
    }

    private destroySelf(){
        if (this.freeTimesContent){
            let parent = this.freeTimesContent["old_parent"];
            this.freeTimesContent.parent = parent;
            this.freeTimesContent.setSiblingIndex(this.freeTimesContent["sibling_index"]);
            this.freeTimesContent.position = NodeEx.getLocalPosition(parent, this.freeTimesContent["world_position"]);
        }
        
        this.node.destroy();
    }

    private playFadeOut(){
        TweenEx.FadeOutOpacity(this.spFreeTitle.node, 0.33, null)
        TweenEx.FadeOutOpacity(this.lbFreeTimes.node, 0.33, null)
    }

    playFreeTimesAni(){
        this.getAddFreeTimesBg().playChuxian();
    }

    playDestroy(){
        this.zhongjiang.animation = "mianfei_jiesu";
        this.playFadeOut();
        TweenEx.FadeOutOpacity(this.zhongjiangLight.node, 0.33, null, ()=>{
            this.destroySelf();
        })
        .start()
    }

    private getAddFreeTimesBg(){
        let addFreeTimesBg = AddFreeTimesBg.New(this.addFreeTimesBg, this.ndAddFreeTimesLayer)
        addFreeTimesBg.node.position = this.freeTimesLocalPos.clone();
        return addFreeTimesBg
    }

    private onEventComplete(x: sp.spine.TrackEntry){
        if (x.animation.name == "mianfei_chuxian"){
            this.zhongjiang.animation = "mianfei_xunhuan"
            this.zhongjiang.loop = true

            this.zhongjiangLight.node.active = true;
            this.zhongjiangLight.loop = true;
            this.zhongjiangLight.animation = "mianfei_xuanzhuanguang"
        }
    }
}


