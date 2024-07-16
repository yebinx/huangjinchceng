import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

// 背景，

@ccclass('GameBackgroundList')
export class GameBackgroundList extends Component {
    @property({type:[SpriteFrame]})
    szNormalBg:SpriteFrame[] = [];// 正常游戏背景

    @property({type:[SpriteFrame]})
    szBonusBg:SpriteFrame[] = []; // 免费游戏背景

    @property({type:[Sprite]})
    szBg:Sprite[] = []; // 背景图

    setBackground(bonus: boolean) {
        if (bonus){
            this.szBg.forEach((value: Sprite, index: number)=>{
                value.spriteFrame = this.szBonusBg[index];
            })
        }else{
            this.szBg.forEach((value: Sprite, index: number)=>{
                value.spriteFrame = this.szNormalBg[index];
            })
        }
    }
}


