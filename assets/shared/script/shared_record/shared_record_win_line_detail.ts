import { _decorator, Component, EventTouch, Label, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { SharedConfig } from '../config/shared_config';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { TouchEventEx } from '../lib/TouchEventEx';
import { IRocordLineInfo } from './shared_record_interface';
import { Emitter } from '../lib/Emitter';
const { ccclass, property } = _decorator;

// 几星连珠
@ccclass('SharedRecordWinLineDetail')
export class SharedRecordWinLineDetail extends Component {
    @property({type:Sprite})
    spSymbol:Sprite;  // 符号图标

    @property({type:Label})
    lbName:Label;

    @property({type:Label})
    lbWinLine:Label;

    @property({type:Label})
    lbTotalWin:Label;

    @property({type:Label})
    lbBaseWin:Label;

    private emitter:Emitter;
    private clickCallback: (recordWinLineDetail:SharedRecordWinLineDetail, recordLineInfo:IRocordLineInfo, isTouchMove: boolean)=>void;
    private recordLineInfo:IRocordLineInfo;

    setEmitter(emitter:Emitter){this.emitter = emitter;}
    setClickCallback(cb: (recordWinLineDetail:SharedRecordWinLineDetail, recordLineInfo:IRocordLineInfo, isTouchMove: boolean)=>void){this.clickCallback = cb;}

    setData(data: IRocordLineInfo){
        this.recordLineInfo = data;
        if (data.isScatter){ //夺宝符号特殊显示
            this.lbName.node.active = false;
            this.lbBaseWin.node.active = false;

            this.lbWinLine.string = `x${data.rewardLine}`;
            this.lbWinLine.node.position = Vec3.ZERO;

            this.lbTotalWin.string = l10n.t("shared_record_free_bonus_n").replace("{1}", `${data.rate}`)
            this.lbTotalWin.node.position = Vec3.ZERO;
        }else{
            this.lbName.string = `${l10n.t(`shared_record_win_line_${data.winLine}`)}` // 几星连珠
            this.lbWinLine.string =  l10n.t("shared_record_win_line_n").replace("{1}", `${data.rewardLine}`);
            this.lbTotalWin.string = l10n.t("shared_money_symbol") + SharedConfig.ScoreFormat(data.winTotal)
            this.lbBaseWin.string = `${l10n.t("shared_money_symbol")}${SharedConfig.ScoreFormat(data.win)} x ${data.rewardMultiple}`
        }

        this.emitter.emit("SharedRecordWinLineDetail", this.spSymbol, data) // 发送事件替换符号
    }

    private onClick(event: EventTouch){
        if (this.clickCallback){
            this.clickCallback(this, this.recordLineInfo, TouchEventEx.isTouchMove(event));
        }
    }
}


