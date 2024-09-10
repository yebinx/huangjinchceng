import { _decorator, Component, Label, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameRateSymbol')
export class GameRateSymbol extends Component {
    @property({type:Sprite})
    spSymbol:Sprite;

    @property({type:Label})
    szlbSymbolNum:Label[] = [];

    @property({type:Label})
    szlbSymbolRate:Label[] = [];

    @property({type:[SpriteFrame]}) // 符号正常
    symbolSpriteFrame:SpriteFrame[] = [];

    setData(itemType: number, szNum:number[], szRate: number[]) {
        this.spSymbol.spriteFrame = this.symbolSpriteFrame[itemType - 1];

        let len = szNum.length;
        for (let i=0; i<len; i++){
            this.szlbSymbolNum[i].string = `${szNum[i]}`
            this.szlbSymbolRate[i].string = `${szRate[i]}`
        }
    }
}


