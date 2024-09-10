import { _decorator, BitmapFont, Component, Label, Sprite, SpriteFrame } from 'cc';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { PromiseEx } from '../../../shared/script/lib/PromiseEx';
const { ccclass, property } = _decorator;

// 多路线组合
@ccclass('MultipleLine')
export class MultipleLine extends Component {
    @property({type:Sprite})
    spLineTitle:Sprite; // 标题

    @property({type:Sprite})
    spThreePoint:Sprite; // 3个点

    @property({type:Label})
    ftNum:Label; // 数字

    @property({type:Sprite})
    spHorizontalBg:Sprite; // 框

    @property({type:[SpriteFrame]})
    szLineTitle:SpriteFrame[] = []; // 中奖组合0 正常，1bonus

    @property({type:[SpriteFrame]})
    szThreePoint:SpriteFrame[] = []; // 3个点 0 正常，1bonus

    @property({type:[SpriteFrame]})
    szHorizontalBg:SpriteFrame[] = []; // 横轴框

    @property({type:[BitmapFont]})
    szFontNum:BitmapFont[] = []; // 数字字体 0 正常，1bonus

    private isBonus = false;

    start() {
        this.hidePoint();
    }

    setBonus(isBonus: boolean){
        if (this.isBonus == isBonus){
            return 
        }

        this.isBonus = isBonus;
        let key = isBonus ? 1 : 0;
        this.spLineTitle.spriteFrame = this.szLineTitle[key];
        this.spThreePoint.spriteFrame = this.szThreePoint[key];
        this.ftNum.font = this.szFontNum[key];
        this.spHorizontalBg.spriteFrame = this.szHorizontalBg[key];
    }

    //
    setLine(line: number){
        this.ftNum.string = `${line}`
    }

    playLine(line: number){
        let from = Number(this.ftNum.string);
        if (from == line){
            return false
        }

        TweenEx.Score(this.ftNum, 0.5, from || 0, line, (lb: Label, currentNum: number)=>{
            lb.string = `${Math.floor(currentNum)}`
        }, null)
        .start()

        return true
    }

    showPoint(){
        this.spThreePoint.node.active = true;
        this.ftNum.node.active = false;
    }

    hidePoint(){
        this.spThreePoint.node.active = false;
        this.ftNum.node.active = true;
    }

    // async test(){
    //     this.showPoint()
    //     await PromiseEx.CallDelayOnly(2);

    //     this.hidePoint()
    //     let totalLine = 1;
    //     for (let i=0; i<6; i++){
    //         totalLine *= (Math.floor(Math.random()*100) % 4 + 2)
    //         this.setLine(totalLine);
    //         await PromiseEx.CallDelayOnly(0.1);
    //     }

    //     await PromiseEx.CallDelayOnly(2);
    //     this.playLine(totalLine + 300)

    //     await PromiseEx.CallDelayOnly(3);

    //     this.setBonus(true)
    //     // this.test()
    // }
}


