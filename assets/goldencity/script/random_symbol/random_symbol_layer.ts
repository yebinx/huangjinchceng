import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { RandomSymbol } from './random_symbol';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
const { ccclass, property } = _decorator;

@ccclass('RandomSymbolLayer')
export class RandomSymbolLayer extends Component {
    @property({type:[Prefab]})
    szRandomSymbol:Prefab[] = []; // 随机符号 2~4格子

     // 创建转换
    createRandomSymbol(itemType: number, space: number, worldPos: Vec3){
        let randomSymbol = RandomSymbol.New(this.szRandomSymbol[space-2], this.node)
        randomSymbol.node.position = NodeEx.getLocalPosition(this.node, worldPos);
        randomSymbol.play(itemType, space)
    }
}


