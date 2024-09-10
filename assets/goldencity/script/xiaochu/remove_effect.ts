import { _decorator, Component, Sprite, SpriteFrame, Animation, Vec3, instantiate, Node } from 'cc';
import { IconDefine } from '../../proto/base';
const { ccclass, property } = _decorator;

// 消除特效

@ccclass('RemoveEffect')
export class RemoveEffect extends Component {
    @property({type:Animation})
    removeEffect:Animation;

    @property({type:Sprite})
    faguangfuhao:Sprite;

    @property({type:SpriteFrame})
    szSymbol:SpriteFrame[] = [];// 1~13

    private callbackRemoveOrRandom: ()=>void; // 消除或删除
    private callbackFinish: (removeEffect:RemoveEffect)=>void;
    private space: number = 0;
    private static szOffset = {
        [IconDefine.GOLDMASK]: new Vec3(0, -8, 1),
        [IconDefine.TOTEM2]: new Vec3(0, 4, 1),
        [IconDefine.TOTEM3]: new Vec3(0, 3, 1),
        [IconDefine.TOTEM4]: new Vec3(0, 8, 1),
    };

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(RemoveEffect)
    }

    protected onLoad(): void {
        this.removeEffect.on(Animation.EventType.FINISHED, this.playFinish, this)
        // this.removeEffect["removeOrRandom"] = this._removeOrRandom.bind(this)
    }

    setSymbol(symbol: number, space: number){
        this.faguangfuhao.spriteFrame = this.szSymbol[symbol-1];
        if (symbol == IconDefine.GOLDMASK){
            this.faguangfuhao.node.position = space > 1 ? RemoveEffect.szOffset[symbol] : Vec3.ZERO;
            return 
        }
        this.faguangfuhao.node.position = RemoveEffect.szOffset[symbol] || Vec3.ZERO;
    }

    setRemoveOrRandomCallback(cb:()=>void){this.callbackRemoveOrRandom = cb;}
    setFinishCallback(cb:(removeEffect:RemoveEffect)=>void){this.callbackFinish = cb;}

    setSpace(space: number) {this.space = space;}
    getSpace() {return this.space;}

    play(){
        this.removeEffect.play();
        this.scheduleOnce(()=>{
            this.node.active = true;
        }, 0)
    }

    // 动画回调
    private removeOrRandom(){
        this.callbackRemoveOrRandom()
    }
    
    private playFinish(){
        this.callbackFinish(this);
        this.node.active = false;
    }
}


