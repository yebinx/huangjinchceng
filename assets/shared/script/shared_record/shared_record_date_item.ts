import { _decorator, Button, Component, Label } from 'cc';
import { ButtonEx } from '../lib/button/ButtonEx';
const { ccclass, property } = _decorator;

// 日期
@ccclass('SharedRecordDateItem')
export class SharedRecordDateItem extends Component {
    @property({type:Label})
    lbDate:Label

    @property({type:Button})
    self:Button

    private callback:Function

    onLoad() {
    }

    setCallback(cb:Function){
        this.callback = cb;
    }

    setString(date: string){
        this.lbDate.string = date;
    }

    onClick(){
        this.callback();
    }
}


