import { _decorator, Component, Node, Animation, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AddFreeTimesBg')
export class AddFreeTimesBg extends Component {
    @property({type:[Animation]})
    ani:Animation;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(AddFreeTimesBg)
    }

    protected onLoad(): void {
        this.ani.on(Animation.EventType.FINISHED, this.onEventFinished, this)
    }

    playChuxian(){
        this.ani.play("add_free_times_bg_chuxian")
    }

    playXunhuan(){
        this.ani.play("add_free_times_bg_xunhuan")
    }

    private onEventFinished(){
        this.node.destroy();
    }
}


