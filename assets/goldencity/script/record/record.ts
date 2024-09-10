import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { Emitter } from '../../../shared/script/lib/Emitter';
import { IRecordDetail, IRocordLineInfo } from '../../../shared/script/shared_record/shared_record_interface';
import { RecordDetailSymbol } from './record_detail_symbol';
import { TResult } from '../../proto/base';
import { TProtoGoldenCityBetType } from '../../proto/v1.goldencity.bet';
const { ccclass, property } = _decorator;

@ccclass('Record')
export class Record extends Component {
    @property({type:[SpriteFrame]}) // 符号正常
    symbolSpriteFrame:SpriteFrame[] = [];

    @property({type:Prefab})
    recordDetailSymbol:Prefab;

    @property({type:Prefab})
    recordBuyBonusGame:Prefab; // 购买奖金游戏标记
    
    private emitter:Emitter;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(Record)
    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);
    }

    setEmitter(emitter:Emitter){this.emitter = emitter;}
    
    register(){
        this.emitter.addEventListener("SharedRecordWinLineDetail", this.onEmitRecordDetailUpdateSymbol, this);
        this.emitter.addEventListener("SharedRecordRoundDetail", this.onEmitRecordDetailResult, this);
    }

    // 更新中奖线路图标
    private onEmitRecordDetailUpdateSymbol(spSymbol:Sprite, data: IRocordLineInfo){
        spSymbol.spriteFrame = this.symbolSpriteFrame[(data.symbolId % 100) - 1];
    }

    // 更新开奖结果
    private onEmitRecordDetailResult(root:Node, data:IRecordDetail, extra:Node,  winLineContent:Node){
        let recordDetailSymbol = root.getComponentInChildren(RecordDetailSymbol);
        if (!recordDetailSymbol){
            recordDetailSymbol = RecordDetailSymbol.New(this.recordDetailSymbol, root);
        }

        let result = data.result as TResult;
        recordDetailSymbol.setResult(result)

        if (data.otherArgs == TProtoGoldenCityBetType.BUYFREE){
            let nd = instantiate(this.recordBuyBonusGame);
            nd.parent = extra;
        }
    }
}


