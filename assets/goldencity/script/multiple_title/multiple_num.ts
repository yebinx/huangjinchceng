import { _decorator, Component, Label, Layout, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MultipleNum')
export class MultipleNum extends Component {
    @property({type:Layout})
    multipleNum:Layout
    
    @property({type:Label})
    lbX:Label;

    @property({type:Label})
    lbNum:Label;

    setNum(num: number){
        this.lbNum.string = `${num}`
    }

    setNumSpace(space: number){
        this.lbNum.spacingX = space;
    }

    setSpace(space: number){
        this.multipleNum.spacingX = space;
    }
}


