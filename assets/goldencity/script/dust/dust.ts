import { _decorator, Component, Node, Sprite, Animation, instantiate } from 'cc';
const { ccclass, property } = _decorator;

// 掉落 底部灰尘效果
@ccclass('Dust')
export class Dust extends Component {
    @property({type:Sprite})
    spDust:Sprite;

    @property({type:Animation})
    aniDust:Animation;

    
    private playFinishCallback:(dust:Dust)=>void = null;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(Dust)
    }

    protected onLoad(): void {
        this.aniDust["playFinish"] = this.playFinish.bind(this)
    }

    start() {
        this.node.active = false;
    }

    setPlayFinishCallback(cb: (dust:Dust)=>void){
        this.playFinishCallback = cb;
    }

    play(){
        this.node.active = true;
        this.aniDust.play()
    }

    private playFinish(){
        this.node.active = false;
        this.playFinishCallback(this);
    }
}


