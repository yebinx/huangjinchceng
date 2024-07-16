import { _decorator, Color, Component, instantiate, Node, Prefab, Size, size, Skeleton, sp, Sprite, SpriteFrame, Tween, tween, UITransform, Vec2, Vec3, Widget } from 'cc';
import { TItemtype } from '../../proto/itemtype';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { IconDefine, IconFrame, IconGrid } from '../../proto/base';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
import { ConfigMethod } from '../config/config_method';
import { RemoveEffectLayer } from '../xiaochu/remove_effect_layer';
import { RandomSymbolLayer } from '../random_symbol/random_symbol_layer';
const { ccclass, property } = _decorator;

type SymbolInfo = {
    symbolId: number
    symbolUi: number
    isGold: boolean
}

// 背景尺寸
const SizeList = [new Size(125, 106), new Size(125, 212), new Size(125, 318), new Size(125, 424)];
const BGColor = {
    [IconDefine.TEN]:new Color(205, 224, 177, 255),
    [IconDefine.JACK]:new Color(177, 198, 224, 255),
    [IconDefine.QUEEN]:new Color(236, 167, 243, 255),
}

const VerticalPosition = [Vec3.ZERO, new Vec3(0, 53, 0), new Vec3(0, 106, 0), new Vec3(0, 159, 0)]
const HorizontalPosition = [Vec3.ZERO]

const SymbolOffsetPos = {
    [IconDefine.TOTEM2]: new Vec3(0, -7, 0),
    [IconDefine.TOTEM3]: new Vec3(0, -4, 0),
    [IconDefine.TOTEM4]: new Vec3(0, -6, 0),
}

@ccclass('Cell')
export default class Cell extends Component {
    @property({type:Node})
    ndAction:Node 

    @property({type:Node})
    spBg:Node;

    @property({type:Sprite})
    spSymbolBg:Sprite;

    @property({type:Sprite})
    spSymbol:Sprite; 

    @property({type:Sprite})
    spFrame:Sprite;

    @property({type:sp.Skeleton})
    skAni:sp.Skeleton

    @property({type:Node})
    ndClick:Node; // 点击节点，symbol有可能占用多格

    @property({type:[SpriteFrame]}) // 符号正常
    symbolSpriteFrame:SpriteFrame[] = [];
    @property({type:[SpriteFrame]}) // 多的符号
    symbolSpriteFrameB:SpriteFrame[] = [];
    @property({type:[SpriteFrame]}) // 符号模糊
    symbolBlurSpriteFrame:SpriteFrame[] = [];
    @property({type:[SpriteFrame]}) // 符号模糊
    symbolBlurSpriteFrameB:SpriteFrame[] = [];

    @property({type:[SpriteFrame]}) // 百搭符号
    wildSpriteFrame:SpriteFrame[] = [];
    @property({type:[SpriteFrame]}) // 百搭符号
    wildBlurSpriteFrame:SpriteFrame[] = [];

    @property({type:[SpriteFrame]}) // 夺宝符号
    scatterSpriteFrame:SpriteFrame[] = [];
    @property({type:[SpriteFrame]}) // 夺宝符号
    scatterBlurSpriteFrame:SpriteFrame[] = [];


    //------ id 3 - 10 的背景
    @property({type:[SpriteFrame]})
    szSymbolBg:SpriteFrame[] = [];
    @property({type:[SpriteFrame]})
    szSymbolBgBlur:SpriteFrame[] = [];

    @property({type:[SpriteFrame]}) // 金银框
    frameSpriteFrame:SpriteFrame[] = [];
    @property({type:[SpriteFrame]}) // 金银框
    frameBlurSpriteFrame:SpriteFrame[] = [];

    @property({type:[sp.SkeletonData]})
    szScatter:sp.SkeletonData[] = []; // 夺宝动画1~2格

    @property({type:[sp.SkeletonData]})
    szWild:sp.SkeletonData[] = []; // 百搭动画 1~4格

    private removeEffectLayer:RemoveEffectLayer; // 消除特效
    private randomSymbolLayer:RandomSymbolLayer; // 转换特效
    private itemType:number = 0; // 符号id
    private isPlayScatter:boolean = false;
    private rollIdx:number = -1; // 在滚动列表第几个

    private szOffsetPoint:Vec3[] = null; // 横轴和竖轴
    private offsetPoint:Vec3 = Vec3.ZERO;
    
    protected onLoad(): void {
    
    }

    getBgOffsetPoint(){ return this.offsetPoint; }
    getSymbolId(){return this.itemType;}
    getRollIdx(){return this.rollIdx;}
    getClickNode(){ return this.ndClick; }

    getSymbolWorldPoint(offsetPoint: Vec3) {
        let uiTransform = this.spBg.getComponent(UITransform);
        return uiTransform.convertToWorldSpaceAR(offsetPoint)
    }

    setEmptySymbol(){this.itemType = IconDefine.BLANK;}
    setSymbolData(symbol:number){this.itemType = symbol;}

    setChangeSymbolData(symbol:number){
        this.itemType = (this.itemType << 16) + symbol; // 旧的数据存放到前16位
    }

    // 只显示图标
    setSymbolIcon(itemType:number){
        this.spSymbol.node.active = true;
        this.spSymbol.spriteFrame = this.symbolSpriteFrame[itemType-1];
    }

    setRemoveEffectLayer(removeEffectLayer: RemoveEffectLayer){this.removeEffectLayer = removeEffectLayer;}
    setRandomSymbolLayer(randomSymbolLayer: RandomSymbolLayer){this.randomSymbolLayer = randomSymbolLayer;}
    
    setRollIdx(idx: number){this.rollIdx = idx;}

    setOffsetPoint(isHorizontal: boolean){
        if (isHorizontal){
            this.szOffsetPoint = HorizontalPosition;
        }else{
            this.szOffsetPoint = VerticalPosition;
        }
    }

     // 重置偏移量
     resetPoint(){
        this.spBg.position = Vec3.ZERO;
        this.skAni.node.position = Vec3.ZERO;
    }

    /**
     * 设置符号
     * @param itemType 符号
     * @param blur 是否模糊
     */
    setSymbol(_itemType: number, frameType, space, itemType, blur:boolean){
        this.isPlayScatter = false;
        // this.stopLizi();
        this.itemType = _itemType;

        this.ndAction.active = true;

        let dataIdx = space - 1;
        this.offsetPoint = this.szOffsetPoint[dataIdx];
        let size = SizeList[dataIdx];
        if (!blur){
            NodeEx.setSize(this.ndClick, size.width, size.height)
            this.ndClick.position = this.offsetPoint;
        }

        this.spBg.position = this.offsetPoint;
        if (!blur && (itemType == IconDefine.WILD || itemType == IconDefine.SCATTER)) { //scatter和wild只有动画
            this.spBg.active = false;
            this.skAni.node.active = true;
            this.skAni.skeletonData = itemType == IconDefine.SCATTER ? this.szScatter[dataIdx] : this.szWild[dataIdx];
            this.skAni.loop = true
            this.skAni.animation = 'idle';
            this.skAni.node.position = this.offsetPoint;
            return 
        }

        this.spBg.active = true;
        if (frameType > 0){
            this.spFrame.node.active = true;
            if (blur){
                this.spFrame.spriteFrame = this.frameBlurSpriteFrame[frameType - 1];
                NodeEx.setSize(this.spFrame.node, size.width + 4, size.height + 14);
            }else{
                this.spFrame.spriteFrame = this.frameSpriteFrame[frameType - 1];
                NodeEx.setSize(this.spFrame.node, size.width, size.height);
            }
        }else{
            this.spFrame.node.active = false;
        }

        this.skAni.node.active = false;

        this.spSymbol.spriteFrame = this.getSymbolFrame(itemType, space, blur);
        let {spriteFrame, color} = this.getSymbolBg(itemType, space, blur);
        this.spSymbolBg.spriteFrame = spriteFrame;
        this.spSymbolBg.color = color; // 10 J Q 是用灰色底板变色的

        let scale = blur && itemType > IconDefine.SCATTER ? new Vec3(1.4, 1.4, 1) : Vec3.ONE;
        this.spSymbol.node.scale = scale;
        if (blur){
            NodeEx.setSize(this.spSymbolBg.node, size.width+2, size.height + 13);
        }else{
            NodeEx.setSize(this.spSymbolBg.node, size.width, size.height);
        }
    
        if (space == 1 && SymbolOffsetPos[itemType]){
            this.spSymbol.node.position = SymbolOffsetPos[itemType];
        }else{
            this.spSymbol.node.position = Vec3.ZERO.clone();
        }
        // this.spSymbolBg.node.scale = scale;
    }

    // 获取符号
    private getSymbolFrame(itemType: number, space: number, blur: boolean){
        switch (itemType){
            case IconDefine.WILD:{
                return this.wildSpriteFrame[space-1]
            }
            case IconDefine.SCATTER:{
                return this.scatterSpriteFrame[space-1]
            }
            default:{
                if (blur){
                    if (space > 1){
                        if (this.symbolBlurSpriteFrameB[itemType-1]){
                            return this.symbolBlurSpriteFrameB[itemType-1];
                        }
                    }
                    return this.symbolBlurSpriteFrame[itemType-1];
                }else{
                    if (space > 1){
                        if (this.symbolSpriteFrameB[itemType-1]){
                            return this.symbolSpriteFrameB[itemType-1];
                        }
                    }
        
                    return this.symbolSpriteFrame[itemType-1];
                }
            }
        }
    }

    // 获取底框
    private getSymbolBg(itemType: number, space: number, blur: boolean){
        if (itemType >= IconDefine.QUEEN){ // 后面3个没有
            let idx = 31+space;
            if (blur){
                return {spriteFrame: this.szSymbolBgBlur[idx], color:BGColor[itemType]};
            }else{
                return {spriteFrame: this.szSymbolBg[idx], color:BGColor[itemType]};
            }
        }else if (itemType <= IconDefine.SCATTER){
            return  {spriteFrame: null, color: Color.WHITE};;
        }

        let idx = (itemType - 3) * 4 + space - 1;
        if (blur){
            return {spriteFrame: this.szSymbolBgBlur[idx], color: Color.WHITE};
        }else{
            return {spriteFrame: this.szSymbolBg[idx], color: Color.WHITE};
        }
    }

    /**
     * 随机符号
     * @param blur 是否
     * @param isWildCol 本列是否滚动百搭
     * @param isMoreSpace 是否多格符号
     */
    setRandSymbol(blur:boolean, isWildCol:boolean, isMoreSpace: boolean){
        let randValue = Math.ceil(Math.random()*10000);
        let _itemType = 0;
        if (randValue > 9700){ // scatter 或 wild
            _itemType = Math.floor(Math.random() * 100) % IconDefine.SCATTER + 1 ;
            if (isMoreSpace && randValue > 9950){
                if (_itemType == IconDefine.SCATTER){ // 随机，百搭只有单个
                    _itemType = _itemType + IconGrid.SPACE2; 
                }
            }
        }else{
            _itemType = randValue%11+IconDefine.GOLDMASK; // 3~11 
            if (isMoreSpace && randValue > 8500){
                _itemType = _itemType + (Math.floor(Math.random() * 100) % 3 + 2) * IconGrid.SPACEBASE; // 随机格子数2~4
            }
            
            if (isMoreSpace && isWildCol && randValue > 9000) { // 概率出银框
                _itemType = _itemType + IconFrame.SILVERFRAME;
            }
        }
        
        let {frameType, space, itemType} = ConfigMethod.decodeItemType(_itemType);
        this.setSymbol(itemType, frameType, space, itemType, blur);
        return space
    }

    // 播放夺宝待机
    playScatter(){
        if (this.itemType != TItemtype.ITEM_TYPE_SCATTER){
            return 
        }

        if (this.isPlayScatter){
            return 
        }

        this.isPlayScatter = true;

        this.playScatterStandby()
    }

    playScatterStandby(){
        this.skAni.paused = false;
        this.skAni.animation = "spawn";
        tween(this.skAni)
        .delay(0.433)
        .call(()=>{
            this.skAni.animation = "idle";
        })
        .start()
    }

    playWildStandby(){
        this.skAni.paused = false;
        this.skAni.animation = "spawn";
        tween(this.skAni)
        .delay(0.6667)
        .call(()=>{
            this.skAni.animation = "idle";
        })
        .start()
    }

    // 3个scatter后，掉落效果
    playScatterWaitOneDrop(duration: number){
        this.skAni.animation = "fastspin";
        tween(this.skAni)
        .delay(duration)
        .call(()=>{
            this.skAni.animation = "idle";
        })
        .start()
    }

    // 播放消除动画
    playRemoveSpine(){
        if(this.itemType == TItemtype.ITEM_TYPE_SCATTER){
            return false;
        }

        let oldItemType = this.itemType >> 16;
        if (oldItemType > IconDefine.BLANK){
            this.itemType = (this.itemType & 0xffff); // 转换的前16位存放数据
        }

        let {frameType, space, itemType} = ConfigMethod.decodeItemType(oldItemType || this.itemType);
        this.removeEffectLayer.play(space, itemType, this.getSymbolWorldPoint(Vec3.ZERO), this.removeOrSwitch.bind(this))
        if (frameType == IconFrame.SILVER) {
            return true
        }

        return false
    }

    // 播放光效，顶部
    playNeighborLightTop(){
        let {space} = ConfigMethod.decodeItemType(this.itemType);
        let offsetY = 0;
        if (space >= 2){
            offsetY = VerticalPosition[space-1].y
        }
        
        this.removeEffectLayer.playNeighborLightTop(new Size(154, 127), this.getSymbolWorldPoint(new Vec3(0, offsetY, 1)));
    }

    // 播放光效，底部
    playNeighborLightBottom(){
        let offset = this.getBgOffsetPoint().clone()
        offset.y *= -1;
        this.removeEffectLayer.playNeighborLightBottom(new Size(154, 127), this.getSymbolWorldPoint(offset));
    }

    // 播放左右光效
    playNeighborLight(symbolSpace: number, offsetSpace: number, isRight: boolean, isContinuity: boolean){
        let size = new Size(154, 127);
        size.height *= symbolSpace;
        let offset:Vec3 = Vec3.ZERO.clone();;
        if (!isContinuity){
            let {space} = ConfigMethod.decodeItemType(this.itemType);
            offset = VerticalPosition[offsetSpace].clone();
            let more = space - offsetSpace;
            if (more != symbolSpace){ // 还有多余的空间
                more = more - symbolSpace;
                let moreOffset = VerticalPosition[more].clone();
                moreOffset.y *= -1

                offset = offset.add(moreOffset)
            }
        }
       
        this.removeEffectLayer.playNeighborLight(size, this.getSymbolWorldPoint(offset), isRight, isContinuity)
    }

    // 银转金或百搭
    private playConvertGoldOrWild(){
        let {frameType, space, itemType} = ConfigMethod.decodeItemType(this.itemType);
        if (frameType == IconFrame.GOLD){ // 银转金
            this.spFrame.spriteFrame = this.frameSpriteFrame[1];
            this.spSymbol.spriteFrame = this.getSymbolFrame(itemType, space, false);
            let {spriteFrame, color} = this.getSymbolBg(itemType, space, false);
            this.spSymbolBg.spriteFrame = spriteFrame;
            this.spSymbolBg.color = color; // 10 J Q 是用灰色底板变色的
            this.createRandomSymbol(itemType, space)
            return 
        }
       
        this.itemType -= IconFrame.WILDFRAME; // 在数据处理的时候多加的
        // 金转wild
        this.spBg.active = false;
        this.skAni.node.active = true;
        this.skAni.loop = true
        this.skAni.skeletonData = this.szWild[space - 1];
        this.skAni.animation = 'idle';
        this.skAni.node.position = this.offsetPoint;
    }

    // 创建转换
    private createRandomSymbol(itemType: number, space: number){
        this.randomSymbolLayer.createRandomSymbol(itemType, space, this.getSymbolWorldPoint(Vec3.ZERO))
    }

    /**
     * 开奖特效提升图层
     * @param parent 
     * @param duration 持续几秒
     */
    playSwapParent(parent: Node, duration:number){
        let oldPos = this.getPosition()
        let worldPos = this.getWorldPosition()
        let oldParent = this.node.parent

        let newPos = parent.getComponent(UITransform).convertToNodeSpaceAR(worldPos)
        this.node.parent = parent
        this.node.setPosition(newPos)

        TweenEx.DelayCall(this.node, duration, ()=>{
            this.node.setParent(oldParent);
            this.node.setPosition(oldPos);
        })
    }

    // 切换图层
    swapParent(parent: Node){
        if (this.node.parent == parent){
            return 
        }
        let worldPos = this.getWorldPosition()
        let newPos = parent.getComponent(UITransform).convertToNodeSpaceAR(worldPos)
        this.node.parent = parent
        this.node.setPosition(newPos)
    }

    playScaleBounce(){
        TweenEx.ScaleBounce(this.node, Vec3.ONE.clone(), 0.1, 0.1, 0).start()
    }

    getSize(){
        return NodeEx.getSize(this.spBg)
    }

    getOneCelltSize(){
        return SizeList[0]
    }

    getPosition(){
        return new Vec3(this.node.position)
    }

    getWorldPosition(){
        return this.node.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO)
    }

    // 滚动超出显示范围
    getRollOutWorldPosition(isHorizontal: boolean){
        let size = NodeEx.getSize(this.spSymbolBg.node);
        if (isHorizontal){
            return this.spSymbolBg.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(size.width/2, 0, 0))    
        }

        return this.spSymbolBg.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, size.height/2, 0))
    }

    /**
     * 掉落弹起
     * @param position 
     * @param isPlayScatter 
     */
    playBounce(position:Vec3, delayTime: number, isHorizontal:boolean, bustCallback:Function){
        let action = tween(this.node)
        if (delayTime > 0){
            action.delay(delayTime)
        }
        action.parallel(
            tween().to(0.2, {position:position}),
            tween().delay(0.15).call(bustCallback)
        )

        if (isHorizontal){
            action.by(0.05,{position:new Vec3(10, 0, 0)})
            .by(0.05,{position:new Vec3(-10, 0, 0)})
        }else{
            action.by(0.05,{position:new Vec3(0, 10, 0)})
            .by(0.05,{position:new Vec3(0, -10, 0)})
        }
        
        action.start()
    }

    /**
     * 播放摇晃动画
     */
    playSymbolShake() {
        if (this.itemType == IconDefine.BLANK){
            return 
        }

        let t = .001 * (Math.floor(100 * Math.random()) + 30);
        tween(this.ndAction)
        .repeatForever(
            tween()
            .by(t, {position:new Vec3(-2.5, 0, 0)})
            .by(t, {position:new Vec3(5, 1.5, 0)})
            .by(t, {position:new Vec3(-1, -4, 0)})
            .by(t, {position:new Vec3(-3, 4.5, 0)})
            .by(t, {position:new Vec3(4, -2, 0)})
            .by(t, {position:new Vec3(-4, -1.5, 0)})
            .by(t, {position:new Vec3(-1, -2.5, 0)})
            .by(t, {position:new Vec3(2.5, -1, 0)})
            .to(0, {position:new Vec3(0, 0, 0)})
        )
        .start()
    }

    /**
     * 停止摇晃动画
     */
    stopSymbolShake(){
        if (this.itemType == IconDefine.BLANK){
            return 
        }
        
        Tween.stopAllByTarget(this.ndAction)
        this.ndAction.setPosition(new Vec3(0, 0, 0));
    }

    private removeOrSwitch(){
        let {frameType, space, itemType} = ConfigMethod.decodeItemType(this.itemType);
        if (frameType == IconFrame.ICON_NULL) {
            this.itemType = IconDefine.BLANK;
            this.spBg.active = false;
            this.skAni.loop = false;
            this.skAni.animation = null;
            this.skAni.node.active = false;
        }else{
            this.playConvertGoldOrWild()
        }
    }
}


