import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import Cell from '../roll/cell';
import { ScatterWaitOne } from './scatter_wait_one';
const { ccclass, property } = _decorator;

// 夺宝3等1

@ccclass('ScatterWaitOneLayer')
export class ScatterWaitOneLayer extends Component {
    @property({type:Prefab})
    scatterWaitOne:Prefab;

    private szScatterWaitOne:ScatterWaitOne[] = [];

    playWaitOne(szCell: Cell[]){
        szCell.forEach(cell => {
            let scatterWaitOne = ScatterWaitOne.New(this.scatterWaitOne, this.node)
            scatterWaitOne.setScatterNode(cell);
            scatterWaitOne.playStart();
            this.szScatterWaitOne.push(scatterWaitOne);
        });
    }

    clear(){
        if (this.szScatterWaitOne.length == 0){
            return
        }
        
        this.szScatterWaitOne.forEach((scatterWaitOne)=>{
            scatterWaitOne.scatterReduction()
            scatterWaitOne.node.destroy();
        })

        this.szScatterWaitOne = [];
    }

    isPlay(){
        return this.szScatterWaitOne.length > 0;
    }
}


