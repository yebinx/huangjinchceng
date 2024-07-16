import { _decorator, Component, Node } from 'cc';
import { GameRateSymbol } from './game_rate_symbol';
import { TItemtype } from '../../../proto/itemtype';
import { ConfigMethod } from '../../config/config_method';
import { IconDefine } from '../../../proto/base';
const { ccclass, property } = _decorator;

@ccclass('GameRateSymbolInfo')
export class GameRateSymbolInfo extends Component {
    @property({type:[GameRateSymbol]})
    szGameRateSymbol:GameRateSymbol[] = []; // TItemtype.ITEM_TYPE_INGOTS ~ TItemtype.ITEM_TYPE_10

   start(): void {
        for (let i=IconDefine.GOLDMASK; i<=IconDefine.TEN; i++){
            let symbolConfig = ConfigMethod.getSymbolConfig(i);
            this.szGameRateSymbol[i-IconDefine.GOLDMASK].setData(i, symbolConfig.num, symbolConfig.rate)
        }
   }
}


