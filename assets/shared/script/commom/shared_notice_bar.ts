import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

// 提示条
@ccclass('SharedNoticeBar')
export class SharedNoticeBar extends Component {
    @property({type:Label})
    lbMsg:Label;

    setData(msg: string){
        this.lbMsg.string = msg;
    }
}


