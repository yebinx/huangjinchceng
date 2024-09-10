import { _decorator, Component, Label, Node } from 'cc';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { SharedConfig } from '../../../shared/script/config/shared_config';
const { ccclass, property } = _decorator;

@ccclass('GameRuleTitle')
export class GameRuleTitle extends Component {
    @property({type:Label})
    lbRule2:Label; //game_rule_title_1_2     游戏共有2,025 - 32,400个中奖路并规定了{1}条基础投注，{2}到{3}的投注倍数和{4}到{5}的投注大小。 

    setRule(betCount: number, multipleMin: number, multipleMax: number, betSizeMin: number, betSizeMax: number){
        let msg = l10n.t("game_rule_title_1_2")
        .replace("{1}", `${betCount}`)
        .replace("{2}", `${multipleMin}`)
        .replace("{3}", `${multipleMax}`)
        .replace("{4}", `${SharedConfig.ScoreFormat(betSizeMin)}`)
        .replace("{5}", `${SharedConfig.ScoreFormat(betSizeMax)}`)
        this.lbRule2.string = msg;
    }
}


