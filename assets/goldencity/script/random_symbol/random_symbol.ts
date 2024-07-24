import { _decorator, Component, Node, Sprite, SpriteFrame, Animation, Vec3, instantiate } from 'cc';
import { IconDefine } from '../../proto/base';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
const { ccclass, property } = _decorator;

// 选择图标

@ccclass('RandomSymbol')
export class RandomSymbol extends Component {
    @property({type:Animation})
    aniRandomSymbol:Animation;

    @property({type:Sprite})
    paytable_symbols:Sprite;

    @property({type:Sprite})
    sp_edge_glow:Sprite;

    @property({type:Sprite})
    paytable_symbols_glow:Sprite;

    @property({type:Sprite})
    sp_glow:Sprite;

    @property({type:[SpriteFrame]})
    szSymbol:SpriteFrame[] = [];

    @property({type:[SpriteFrame]})
    szSymbolB:SpriteFrame[] = [];

    @property({type:[SpriteFrame]})
    szSymbolEdgeGold:SpriteFrame[] = [];

    @property({type:[SpriteFrame]})
    szSymbolGold:SpriteFrame[] = [];

    private symbol:number = IconDefine.BLANK;
    private space: number = 1;
    private randomSymbolValue: number = IconDefine.BLANK; // 最后一次随机的符号

    static offsetPoint = {
        [IconDefine.GOLDMASK]: new Vec3(0, -9, 1),
        [IconDefine.REDMASK]: new Vec3(0, 7, 1),
        [IconDefine.TOTEM1]: new Vec3(0, 3, 1),
        [IconDefine.TOTEM2]: new Vec3(0, 8, 1),
        [IconDefine.TOTEM3]: new Vec3(0, 10, 1),
        [IconDefine.TOTEM4]: new Vec3(0, 7, 1),
    }

    // static normalSymbolOffsetPoint = {
    //     [IconDefine.GOLDMASK]: new Vec3(0, -9, 1),
    //     // [IconDefine.TOTEM1]: new Vec3(0, 3, 1),
    //     // [IconDefine.TOTEM2]: new Vec3(0, 8, 1),
    //     // [IconDefine.TOTEM3]: new Vec3(0, 6, 1),
    //     // [IconDefine.TOTEM4]: new Vec3(0, 7, 1),
    // }

    static randomList:number[] = [
        IconDefine.GOLDMASK, IconDefine.REDMASK, IconDefine.TOTEM1, IconDefine.TOTEM2,
        IconDefine.TOTEM3, IconDefine.TOTEM4, IconDefine.ACE, IconDefine.KING,
        IconDefine.QUEEN, IconDefine.JACK, IconDefine.TEN,
    ]

    static New(prefab:any, parent:Node){
        if(!prefab){
            console.log("New");
        }
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(RandomSymbol)
    }

    protected start(): void {
        // this.test()
    }

    play(symbol:number, space: number) {
        TweenEx.ScaleBounce(this.node, this.node.scale.clone(), 0.12, 0.1, 0).start();
        TweenEx.FadeInOpacity(this.node, 0.2, null, 0).start();

        this.symbol = symbol;
        this.space = space;

        this.aniRandomSymbol.play(this.aniRandomSymbol.clips[0].name)
        this.schedule(()=>{
            this.randomSymbol()
        }, 0.08)

        this.scheduleOnce(()=>{
            this.successSymbol()
        }, 1.21)
    }

    // 随机切换图标
    private randomSymbol() {
        let key = Math.floor(Math.random() * 100) % RandomSymbol.randomList.length;
        if (this.randomSymbolValue == RandomSymbol.randomList[key]) {
            key = (key = key + 1) % RandomSymbol.randomList.length;
        }

        this.randomSymbolValue = RandomSymbol.randomList[key];

        this.setSymbol(this.randomSymbolValue, false);
    }

    // 更新图标
    private setSymbol(symbol:number, successSymbol: boolean) {
        let key = symbol - 1;
        this.paytable_symbols.spriteFrame = this.szSymbol[key];
        this.paytable_symbols_glow.spriteFrame = this.szSymbol[key];
        this.sp_edge_glow.spriteFrame = this.szSymbolEdgeGold[key];
        this.sp_glow.spriteFrame = this.szSymbolGold[key];

        let offset:Vec3;
        if (symbol == IconDefine.REDMASK){
            offset = this.space > 1 ? RandomSymbol.offsetPoint[symbol] || Vec3.ZERO : Vec3.ZERO; 
        }else{
            offset = RandomSymbol.offsetPoint[symbol] || Vec3.ZERO;
        }

        this.sp_edge_glow.node.position = offset.clone();
        this.sp_glow.node.position = offset.clone();

        if (this.space <= 1){
            return 
        }
    
        if (symbol == IconDefine.GOLDMASK || symbol == IconDefine.REDMASK){ // 符号3的要特殊处理
            this.paytable_symbols.spriteFrame = this.szSymbolB[key];
            this.paytable_symbols_glow.spriteFrame = this.szSymbolB[key];
        }
    }

    // 播放确认图标动画
    private successSymbol() {
        this.unscheduleAllCallbacks();
        this.aniRandomSymbol.play(this.aniRandomSymbol.clips[1].name)
        this.setSymbol(this.symbol, true);
        this.scheduleOnce(()=>{
            this.node.destroy()
        }, 0.53)
    }

    // async test(){
    //     this.play(IconDefine.TOTEM4)
    // }
}


