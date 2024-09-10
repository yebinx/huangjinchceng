import { _decorator, Color, Component, Label } from 'cc';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { SharedConfig } from '../config/shared_config';
const { ccclass, property } = _decorator;

// 详情 选择回合标题

@ccclass('SharedRecordRoundTitle')
export class SharedRecordRoundTitle extends Component {
    @property({type:Label})
    lbRoundName:Label; // 回合名

    @property({type:Label})
    lbWin:Label; 

    setDate(roundName:string, win: number, isSelect:boolean){
        this.lbRoundName.string = roundName;
        this.lbWin.string = `${SharedConfig.ScoreFormat(win)}`;

        if (!isSelect){
            return 
        }

        this.lbRoundName.color = SharedConfig.THEME_COLOR.clone();
        this.lbWin.color = SharedConfig.THEME_COLOR.clone();;
    }
}


