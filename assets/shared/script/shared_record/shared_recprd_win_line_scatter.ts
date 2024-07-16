import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { Emitter } from '../lib/Emitter';
import { IRocordLineInfo } from './shared_record_interface';
const { ccclass, property } = _decorator;

// 记录中奖线路 夺宝
@ccclass('SharedRecordWinLineScatter')
export class SharedRecordWinLineScatter extends Component {
    @property({type:Sprite})
    spSymbol:Sprite;  // 符号图标
    
    @property({type:Label})
    lbWinLine:Label;

    @property({type:Label})
    lbFreeBonus:Label;

    private emitter:Emitter;
    setEmitter(emitter:Emitter){this.emitter = emitter;}

    setData(data: IRocordLineInfo){
        this.lbWinLine.string = `x${data.rewardLine}`;
        this.lbFreeBonus.string = l10n.t("shared_record_free_bonus_n").replace("{1}", String(data.rate));
        this.emitter.emit("SharedRecordWinLineDetail", this.spSymbol, data)
    }
}


