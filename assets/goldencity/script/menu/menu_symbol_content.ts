import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { TItemtype } from '../../proto/itemtype';
const { ccclass, property } = _decorator;

@ccclass('MenuSymbolContent')
export class MenuSymbolContent extends Component {
    @property({type:[Sprite]})
    roll1:Sprite[] = [];

    @property({type:[Sprite]})
    roll2:Sprite[] = [];

    @property({type:[Sprite]})
    roll3:Sprite[] = [];

    @property({type:[Sprite]})
    roll4:Sprite[] = [];

    @property({type:[Sprite]})
    roll5:Sprite[] = [];

    @property({type:[SpriteFrame]}) // 符号正常
    symbolSpriteFrame:SpriteFrame[] = [];
    @property({type:[SpriteFrame]}) // 符号正常金色
    symbolSpriteFrameGold:SpriteFrame[] = [];

    private szRoll:Sprite[][] = null; // 0~n

    protected onLoad(): void {
        this.szRoll = [
            this.roll1,
            this.roll2,
            this.roll3,
            this.roll4,
            this.roll5,
        ]
    }

    setSymbolIcon(rollIdx:number, szItemType:number[]){
        let roll = this.szRoll[rollIdx];
        for (let i=0, len=roll.length; i<len; i++){
            if (i >= szItemType.length){
                roll[i].node.active = false;    
                continue
            }

            let itemType = szItemType[i];
            if (itemType < TItemtype.GOLD_MOD){
                roll[i].spriteFrame = this.symbolSpriteFrame[itemType - 1];
                continue
            }

            itemType = itemType % TItemtype.GOLD_MOD;
            roll[i].spriteFrame = this.symbolSpriteFrameGold[itemType - 1];
        }

    }
}


