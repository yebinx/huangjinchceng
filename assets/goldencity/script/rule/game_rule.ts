import { _decorator, Component, instantiate, Node } from 'cc';
import { GameRuleTitle } from './game_rule_title_game';
const { ccclass, property } = _decorator;

@ccclass('GameRule')
export class GameRule extends Component {
    @property({type:Node})
    gameRuleTitle:Node; // GameRuleTitle组件挂载不了，只能挂载节点

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(GameRule)
    }

    setRule(betCount: number, multipleMin: number, multipleMax: number, betSizeMin: number, betSizeMax: number){
        this.gameRuleTitle.getComponent(GameRuleTitle).setRule(betCount, multipleMin, multipleMax,  betSizeMin, betSizeMax)
    }
}


