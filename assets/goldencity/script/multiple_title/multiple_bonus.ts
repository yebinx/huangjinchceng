import { _decorator, Animation, Component, instantiate, Node, Prefab } from 'cc';
import { MultipleNum } from './multiple_num';
const { ccclass, property } = _decorator;

@ccclass('MultipleBonus')
export class MultipleBonus extends Component {
    @property({type:Animation})
    ndAni:Animation;

    @property({type:[MultipleNum]})
    szMultipleNum:MultipleNum[] = []

    @property({type:Node})
    ndLizi:Node;

    @property({type:Prefab})
    beishulizi:Prefab;

    private currentMultiple: number = 0;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(MultipleBonus)
    }

    protected onLoad(): void {
        this.ndAni["changeMultiple"] = this.changeMultiple.bind(this);
        this.ndAni["playParticel"] = this.playParticel.bind(this);
    }

    setMultiple(multiple: number){
        this.currentMultiple = multiple;
        this.setMultipleByIndex(0, this.currentMultiple)
    }

    playMultiple(multiple: number){
        this.currentMultiple = multiple;
        this.setMultipleByIndex(1, this.currentMultiple)
        this.setMultipleByIndex(2, this.currentMultiple)
        this.ndAni.play();
    }

    private setMultipleByIndex(index: number, multiple: number){
        this.szMultipleNum[index].setNum(multiple);
        this.szMultipleNum[index].setNumSpace(multiple >= 10 ? -10 : 0)
        this.szMultipleNum[index].setSpace(multiple >= 10 ? -13 : 0)
    }

    // 切换倍数
    private changeMultiple(){
        this.setMultipleByIndex(0, this.currentMultiple)
    }

    // 播放粒子
    private playParticel(){
        let nd = instantiate(this.beishulizi)
        nd.parent = this.ndLizi;
    }
}


