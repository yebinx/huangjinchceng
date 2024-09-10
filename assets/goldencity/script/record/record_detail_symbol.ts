import { _decorator, Component, instantiate, Node } from 'cc';
import { Roll } from '../roll/roll';
import { TResult } from '../../proto/base';
import { COLUMN_HORIZONTAL } from '../config/game_config';
const { ccclass, property } = _decorator;

@ccclass('RecordDetailSymbol')
export class RecordDetailSymbol extends Component {
    @property({type:Roll})
    szRoll:Roll[] = []

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(RecordDetailSymbol)
    }

    protected onLoad(): void {
        this.szRoll.forEach((symbolList, key) => {
            symbolList.setHorizontal(key == COLUMN_HORIZONTAL);
        })
    }

    setResult(result:TResult){
        this.szRoll.forEach((symbolList, key) => {
            this.szRoll[key].recordSymbol(result.card_list[key].list)
        });
    }
}


