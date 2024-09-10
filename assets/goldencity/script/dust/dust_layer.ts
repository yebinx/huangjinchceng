import { _decorator, Component, instantiate, Node, Pool, Prefab, Vec3 } from 'cc';
import { Dust } from './dust';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
const { ccclass, property } = _decorator;

// 灰尘效果层
@ccclass('DustLayer')
export class DustLayer extends Component {
    @property({type:Prefab})
    dust:Prefab;

    private szDust:Dust[] = [];
    private count:number = 0;

    protected onLoad(): void {
        for (let i=0; i<30; i++){
            let dust = Dust.New(this.dust, this.node)
            dust.setPlayFinishCallback(this.put.bind(this));
            this.szDust.push(dust);
        }

        this.count = this.szDust.length;
    }

    playDust(worldPos:Vec3){
        let localPos = NodeEx.getLocalPosition(this.node, worldPos);
        let dust = this.get();
        dust.node.position = localPos;
        dust.play()
    }
    
    private get(){
        this.count--;
        // console.log("get count", this.count)
        return this.szDust[this.count];
    }

    private put(dust: Dust) {
        this.szDust[this.count] = dust;
        this.count++;
        // console.log("put count", this.count)
    }
}


