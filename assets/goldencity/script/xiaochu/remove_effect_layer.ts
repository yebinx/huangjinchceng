import { _decorator, Component, Prefab, Vec3, instantiate, Sprite, SpriteFrame, Size, Node } from 'cc';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
import { RemoveEffect } from './remove_effect';
import { RemoveNeighborLight } from './remove_neighbor_light';
const { ccclass, property } = _decorator;

// 消除特效

interface RemoveEffectPool {
    count: number;
    data: RemoveEffect[];
}

// 消除效果层

@ccclass('RemoveEffectLayer')
export class RemoveEffectLayer extends Component {
    @property({type:Node})
    ndNeighbor:Node;

    @property({type:[Prefab]})
    szRemoveEffect:Prefab[] = []; // 1~4格消除

    @property({type:Prefab})
    removeNeighborLight:Prefab; // 周围光效

    private szPool:RemoveEffectPool[] = [];

    protected onLoad() {
        for(let i=0; i<4; i++){
            let count = 5;
            let pool:RemoveEffectPool = {count: count, data:[]}
            for (let j=0; j<count; j++){
                let removeEffect = RemoveEffect.New(this.szRemoveEffect[i], this.node)
                removeEffect.node.active = false;
                pool.data.push(removeEffect);
                removeEffect.setSpace(i + 1);
            }
            this.szPool.push(pool);
        }
    }
    
    play(space: number, symbol: number, worldPos: Vec3, changeSymbol:()=>void){
        let removeEffect = this.get(space);
        removeEffect.node.position = NodeEx.getLocalPosition(this.node, worldPos);
        removeEffect.setFinishCallback((removeEffect:RemoveEffect)=>{
            this.put(removeEffect)
        })
        removeEffect.setRemoveOrRandomCallback(changeSymbol)
        removeEffect.setSymbol(symbol, space);
        removeEffect.play();
    }

    playNeighborLightTop(size:Size, worldPos: Vec3){
        let removeNeighborLight = this.getRemoveNeighborLight()
        removeNeighborLight.showTop(size);
        removeNeighborLight.node.position = NodeEx.getLocalPosition(this.node, worldPos)
    }

    playNeighborLightBottom(size:Size, worldPos: Vec3){
        let removeNeighborLight = this.getRemoveNeighborLight()
        removeNeighborLight.showBottom(size);
        removeNeighborLight.node.position = NodeEx.getLocalPosition(this.node, worldPos)
    }

    playNeighborLight(size:Size, worldPos: Vec3, isRight: boolean, isContinuity: boolean){
        let removeNeighborLight = this.getRemoveNeighborLight()
        if (isRight){
            if (isContinuity){
                removeNeighborLight.showRight(size)
            }else{
                removeNeighborLight.showRightLine(size)
            }
        }else{
            if (isContinuity){
                removeNeighborLight.showLeft(size)
            }else{
                removeNeighborLight.showLeftLine(size)
            }
        }
        removeNeighborLight.node.position = NodeEx.getLocalPosition(this.node, worldPos)
    }

    clearNeighborLight(){
        this.ndNeighbor.removeAllChildren();
    }

    private getRemoveNeighborLight(){
        return RemoveNeighborLight.New(this.removeNeighborLight, this.ndNeighbor)
    }

    private get(space: number){
        let pool = this.szPool[space - 1]
        if (pool.count == 0){
            let removeEffect = RemoveEffect.New(this.szRemoveEffect[space-1], this.node)
            removeEffect.node.active = false;
            removeEffect.setSpace(space);
            pool.data.push(removeEffect);
            return removeEffect
        }

        pool.count--;

        return pool.data[pool.count]
    }

    private put(removeEffect: RemoveEffect){
        let pool = this.szPool[removeEffect.getSpace() - 1]
        pool.data[pool.count] = removeEffect
        pool.count++;
    }
}


