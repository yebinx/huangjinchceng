import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

// 单条信息显示 免费次数和消除次数

@ccclass('SharedRecordFreeRemoveTimes')
export class SharedRecordFreeRemoveTimes extends Component {
    @property({type:Node})
    spFreeFlg:Node // 免费旋转标志

    @property({type:Node})
    ndInfoBg:Node;

    @property({type:Label})
    lbInfo:Label;

    setData(free:number, normalRound:number, freeRound: number){
        this.spFreeFlg.active = free > 0

        if (free > 0){
            this.lbInfo.string = `${normalRound}+${freeRound}`;
        }else{
            this.lbInfo.string = `${normalRound}`;
        }
    }
}


