import { _decorator, CCBoolean, Component, Layout, math, Node, Pool, ScrollView, Size, Tween, tween, UITransform, Vec3 } from 'cc';
import Cell from './cell';
import { Emitter } from '../../../shared/script/lib/Emitter';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
import { COLUMN_HORIZONTAL, COLUMN_LAST_IDX, TURBO_MODE_SPEED_FACTOR } from '../config/game_config';
import { EMIT_COLUME_START, EMIT_SYMBOL_INFO_OPEN } from '../config/emit_event';
import { EMIT_COLUME_DONE, EMIT_COLUME_DONE_BEFORE } from '../../../shared/script/config/shared_emit_event';
import { IconDefine, IconGrid } from '../../proto/base';
import { ConfigMethod } from '../config/config_method';
import { DustLayer } from '../dust/dust_layer';
import { RemoveEffectLayer } from '../xiaochu/remove_effect_layer';
import { RandomSymbolLayer } from '../random_symbol/random_symbol_layer';
import { GmaeNeighbor } from '../game_date/game_neighbor';
const { ccclass, property } = _decorator;

enum RollStatus{
    STOP, // 滚动停止
    PLAYING,
    RESULT,
}
const DEFAULT_SPEED = 4500; // 滚动速度
const QUICK_SPEED = 18000;

@ccclass('Roll')
export class Roll extends Component {
    @property({type:[Cell], tooltip:"从0开始，从左往右,从上往下"})
    szCell:Cell[] = []; // 从下往上

    firstCell:Cell = null;

    private itemSize: Size = null; // 符号大小
    private firstItemPosition:Vec3 = null; // 第一个cell的初始位置，最底部坐标点
    private rollOriginPoint: Vec3; // 初始位置，做停止位置重置用
    private lastCellCount; // 节点不断下移动，这个值用于计算挪到最后的节点的新位置

    private snapedone: boolean = false;
    private szSymbol:number[] = []; // 数据
    private szSymbolIdx:number = 0; // 结果数据idx记录

    private emitter:Emitter;
    private ndGrayLayer:Node;// 开奖灰色图层
    private ndScatterLayer:Node; // 播放scatter图层
    private dustLayer:DustLayer; 

    speed: number = DEFAULT_SPEED; // 滚动速度

    private scatterColumn:boolean = false; // 本列是否出现wild符号
    private horizontal: boolean = false; // 是否横向滚动
    private space: number = 0; // 2个cell上下间隔
    private rollStatus: RollStatus = RollStatus.STOP; // 滚动状态
    private columnValue:number = 0; //第几列，从左往右，从0开始
    private realCellIdx: number = 0; // 数据的idx0，对应cell的第几个idx值，做停止判断用
    private showColNum:number = 0; // 本列视图显示的符号数量
    private originalParent:Node; // 播放scatter效果需要切换图层
    private originalIndex:number = 0;// 原始父节点排列位置

    private virtualOutNode:Node; // 虚拟节点，cell超出会被放到顶部

    private scatterStopLayer:Node = null; // 夺宝符号停止后，需要提升图层
    private szRollStopScatter:Cell[] = [];
    
    onLoad(): void {
        this.originalParent = this.node.parent;
        this.originalIndex = this.node.getSiblingIndex()

        this.szCell.forEach((v:Cell)=>{
            v.setOffsetPoint(this.horizontal);
        })

        this.firstItemPosition = this.szCell[0].getPosition();
        this.itemSize = this.szCell[0].getOneCelltSize();
    }

    start() {   
        let laout = this.node.getComponent(Layout);
        this.space = laout.spacingX || laout.spacingY;
        laout.destroy();

        this.rollOriginPoint = new Vec3(this.node.position);
        
        this.createVirtualNode();
    }

    // 创建虚拟节点
    private createVirtualNode(){
        this.virtualOutNode = new Node("check_out_item" + this.columnValue);
        this.virtualOutNode.addComponent(UITransform);
        this.virtualOutNode.parent = this.node.parent;

        let worldPos = NodeEx.getWorldPosition(this.node, Vec3.ZERO); // 消失位置要增加半个item的大小
        let localPos = NodeEx.getLocalPosition(this.node.parent, worldPos);
        this.virtualOutNode.position = localPos;
    }

    // 给符号图标增加点击事件
    addCellClick(){
        this.szCell.forEach((v:Cell)=>{
            NodeEx.addClick(v.getClickNode(), this.onClickCell.bind(this, v));
        })
    }
    
    setEmitter(emitter:Emitter){this.emitter = emitter;}
    setGrayLayer(grayLayer:Node){this.ndGrayLayer = grayLayer;}
    setDustLayer(dustLayer:DustLayer){this.dustLayer = dustLayer;}
    setScatterLayer(grayLayer:Node){this.ndScatterLayer = grayLayer;}
    setScatterStopLayer(scatterStopLayer:Node){this.scatterStopLayer = scatterStopLayer;}
    setColumnValue(col:number){this.columnValue = col;}
    setRealCellIdx(cellIdx: number){this.realCellIdx = cellIdx;}
    setShowColNum(num:number){this.showColNum = num;}
    setHorizontal(horizontal:boolean) {this.horizontal = horizontal;}
    setScatterColumn(scatterColumn: boolean) {this.scatterColumn = scatterColumn;}

    // 重置滚动速度
    resetSpeed(){this.speed = DEFAULT_SPEED;}

    // 删除效果层
    setRemoveEffectLayer(removeEffectLayer: RemoveEffectLayer){
        this.szCell.forEach((v:Cell)=>{
            v.setRemoveEffectLayer(removeEffectLayer)
        })
    }

    // 随机符号层
    setRandomSymbolLayer(randomSymbolLayer: RandomSymbolLayer){
        this.szCell.forEach((v:Cell)=>{
            v.setRandomSymbolLayer(randomSymbolLayer)
        })
    }
    
    switchScatterEffectParent(isScatter:boolean) {
        if (isScatter){
            this.node.parent = this.ndScatterLayer;
            this.node.setSiblingIndex(0);
            return 
        }

        if (this.node.parent == this.originalParent){
            return 
        }
        
        this.node.parent = this.originalParent;
        this.node.setSiblingIndex(this.originalIndex);
    }

    isScatterEffect() { return this.node.parent == this.ndScatterLayer; }

    /**
     * 滚动减速
     */
    slowSpeed(){
        let action = {speed:DEFAULT_SPEED}
        tween(action)
        .to(1.3, {speed:770},{
            progress:(start, end, current, ratio) =>{
                this.speed = start - Math.ceil((start-end)*(ratio))
                return this.speed
            },
            easing: "quadOut",
        })
        .start();
        //条件必须满足才能卡住位置（音效时间-降速时间后）* 800 > this.size.height
    }

    /**
     * 初始化本列默认符号
     * @param szSymbol 符号列表 szSymbol[0]最新
     */
    defaultSymbol(szSymbol:number[], scatterAni:boolean = true){
        this.szSymbol = szSymbol;
        this.lastCellCount = 0;
        let cellLen = this.szCell.length - 1;
        for (let i=0, len=szSymbol.length; i < len; i++){
            let cellIdx = this.realCellIdx + i;
            if (cellIdx > cellLen){
                break;
            }

            this.setCellPosition(this.szCell[cellIdx], this.lastCellCount)
            let {frameType, space, itemType} = ConfigMethod.decodeItemType(szSymbol[i]);
            this.lastCellCount += space;
            if (scatterAni){
                this.szCell[cellIdx].setSymbol(szSymbol[i], frameType, space, itemType, false);
            }else{
                this.szCell[cellIdx].setSymbol(szSymbol[i], frameType, space, itemType, itemType < IconDefine.GOLDMASK);
            }
            
            if (itemType == IconDefine.SCATTER){
                this.szCell[cellIdx].node.setSiblingIndex(this.szCell.length);
            }
        }
    }

    // 历史记录图标
    recordSymbol(szSymbol:number[]){
        this.szSymbol = szSymbol;
        this.lastCellCount = 0;
        let cellLen = this.szCell.length - 1;
        for (let i=0, len=szSymbol.length; i < len; i++){
            let cellIdx = this.realCellIdx + i;
            if (cellIdx > cellLen){
                break;
            }

            this.setCellPosition(this.szCell[cellIdx], this.lastCellCount)
            let {frameType, space, itemType} = ConfigMethod.decodeItemType(szSymbol[i]);
            this.lastCellCount += space;
            
            this.szCell[cellIdx].setSymbol(szSymbol[i], frameType, space, itemType, itemType < IconDefine.GOLDMASK);
        }

        this.lastCellCount += 10
        // 有可能一列符号都不是单个的，多余的符号要往上移动
        for (let i=this.szSymbol.length, len = this.showColNum; i<len; i++) {
            this.setCellPosition(this.szCell[i], this.lastCellCount);
        }
    }

    /**
     * 设置开奖结果
     * @param szSymbol 开奖符号
     * @param snapeDone 是否快速完成
     */
    setResult(szSymbol:number[], snapeDone: boolean){
        this.rollStatus = RollStatus.RESULT;
        this.snapedone = snapeDone
        this.szSymbol = szSymbol;
        this.szSymbolIdx = 0;
    }

    stopAndFlush(szSymbol:number[], snapeDone: boolean){
        this.rollStatus = RollStatus.STOP;
        this.snapedone = snapeDone
        this.szSymbol = szSymbol;
        this.szSymbolIdx = 0;
        Tween.stopAllByTarget(this.node);
        this.flushResultItem();
    }

    setCellChangeSymbolData(index: number, symbol:number) {
        this.szCell[index + this.realCellIdx].setChangeSymbolData(symbol)
    }

    getWorldPosition(){
        return this.node.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO)
    }

    /**
     * 开始滚动
     * @param delay 开始滚动，往上移动效果时间
     */
    play(delay: number, isSnapeDone: boolean, freeGame: boolean){
        this.resetSpeed();

        // todo 有时候scatter效果会造成roll消失，不知道原因
        this.switchScatterEffectParent(false);

        tween(this.node)
        .delay(delay)
        .call(()=>{
            this.rollStopScatterLayerReset();
            this.lastCellCount = 0;
            // 当前图标变灰色
            for (let i=0, symbol=0; i<this.szSymbol.length; i++){
                symbol = this.szCell[i].getSymbolId();
                let {frameType, space, itemType} = ConfigMethod.decodeItemType(symbol);
                if (itemType <= IconDefine.SCATTER){ // 夺宝和百搭停止动画
                    this.szCell[i].setSymbol(symbol, frameType, space, itemType, true);
                    this.setCellPosition(this.szCell[i], this.lastCellCount);
                }
                this.lastCellCount += space;
            }

            for (let i=this.szSymbol.length, len = this.szCell.length, symbol=0; i<len; i++){
                this.setCellPosition(this.szCell[i], this.lastCellCount);
                this.lastCellCount += this.szCell[i].setRandSymbol(true, false, this.columnValue > 1 && this.columnValue < COLUMN_LAST_IDX)
            }

            this.node.setPosition(this.rollOriginPoint);
            
            let action = {speed:2000}
            let totalSpeed = DEFAULT_SPEED;
            if (isSnapeDone){
                totalSpeed = QUICK_SPEED;
            }else{
                if (freeGame){
                    totalSpeed *= TURBO_MODE_SPEED_FACTOR;
                }
            }

            tween(action)
            .to(0.3, {speed:totalSpeed},{
                progress:(start, end, current, ratio) =>{
                    this.speed = start - Math.ceil((start-end)*(ratio))
                    return this.speed
                }
            })
            .start();

            this.rollStatus = RollStatus.PLAYING;
            this.emitter.emit(EMIT_COLUME_START, this.columnValue)
        })
        .start()
    }

    /**
     * 播放奖励时间
     * @param szIdx 
     */
    playReward(szIdx:number[]){
        let waitRandomSymbol = 0; // 等待转换效果
        szIdx.forEach((v, k)=>{
            let cell = this.szCell[v + this.realCellIdx];
            waitRandomSymbol = waitRandomSymbol | cell.playRemoveSpine() as any;
            cell.playSwapParent(this.ndGrayLayer, 1.5);
        })

        return waitRandomSymbol;
    }

    playNeighbor(gameNeighbor: GmaeNeighbor[]){
        let lastSpace = 0;
        this.szSymbol.forEach((symbol, cellIdx)=>{
            let {space} = ConfigMethod.decodeItemType(symbol);
            let leftSpace = 0;
            let rightSpace = 0;
            let leftOffsetSpace = 0;
            let rightSpaceOffsetSpace = 0;
            for (let moveSpace=0; moveSpace<space; moveSpace++){
                let key = lastSpace + moveSpace;

                if (gameNeighbor[key].isTop()){
                    this.szCell[cellIdx].playNeighborLightTop();
                }

                if (gameNeighbor[key].isBottom()){
                    this.szCell[cellIdx].playNeighborLightBottom();
                }

                if (gameNeighbor[key].isLeft()){
                    leftSpace++;
                }else{
                    if (leftSpace > 0){
                        this.szCell[cellIdx].playNeighborLight(leftSpace, leftOffsetSpace, false, false);
                        leftSpace = 0
                    }
                    leftOffsetSpace = moveSpace + 1;
                }

                if (gameNeighbor[key].isRight()){
                    rightSpace++;
                }else{
                    if (rightSpace > 0){
                        this.szCell[cellIdx].playNeighborLight(rightSpace, rightSpaceOffsetSpace, true, false);
                        rightSpace = 0
                    }
                    rightSpaceOffsetSpace = moveSpace + 1;
                }
            }

            if (leftSpace > 0){
                this.szCell[cellIdx].playNeighborLight(leftSpace, leftOffsetSpace, false, leftSpace == space);
            }

            if (rightSpace > 0){
                this.szCell[cellIdx].playNeighborLight(rightSpace, rightSpaceOffsetSpace, true, rightSpace == space);
            }

            lastSpace = lastSpace + space;
        })
    }

    // 把scatter图层变高
    rollStopScatterLayer(szIdx:number[]){
        szIdx.forEach((v, k)=>{
            let cell = this.szCell[v + this.realCellIdx]
            cell.swapParent(this.scatterStopLayer);
            this.szRollStopScatter.push(cell)
        })
    }

    // scatter图层还原
    rollStopScatterLayerReset(){
        if (this.szRollStopScatter.length == 0){
            return 
        }
        this.szRollStopScatter.forEach((cell)=>{
            cell.swapParent(this.node);
        })
        this.szRollStopScatter = [];
    }

    // 
    playScatterStandby(szIdx:number[], duration:number){
        szIdx.forEach((v, k)=>{
            let cell = this.szCell[v + this.realCellIdx]
            cell.playScatterStandby();
            cell.playSwapParent(this.ndGrayLayer, duration);
        })
    }

    // scatter 3等1 等待掉落
    playScatterWaitOne(szIdx:number[], duration:number){
        let szCell = []
        szIdx.forEach((v, k)=>{
            let cell = this.szCell[v + this.realCellIdx]
            cell.playScatterWaitOneDrop(duration);
            szCell.push(cell)
            // cell.playSwapParent(this.ndGrayLayer, duration);
        })
        return szCell;
    }

    // scatter 弹一下效果
    playScatterScaleBounce(szIdx:number[]){
        szIdx.forEach((v, k)=>{
            let cell = this.szCell[v + this.realCellIdx]
            cell.playScaleBounce();
        })
    }


    // 播放wild 待机
    playWildStandBy(szIdx:number[]){
        szIdx.forEach((v, k)=>{
            let cell = this.szCell[v + this.realCellIdx]
            cell.playWildStandby();
        })
    }

    /**
     * 播放晃动
     * @param szFilterIdx 不需要晃动的位置
     */
    playSymbolShake(szFilterIdx: number[]){
        let map = new Map()
        if (szFilterIdx.length > 0){
            szFilterIdx.forEach((v, k) => {
                map[v + this.realCellIdx] = true
            });
        }
      
        this.szCell.forEach((v, k)=>{
            if (map[k]){
                return 
            }

            v.playSymbolShake()
        })
    }

    /**
     * 填充空缺的位置
     * @param szRewardIdx // 
     * @param szSymbol // 新的数据
     */
    playFillSymbol(szRewardIdx: number[], newSymbolCount: number, szSymbol:number[]){
        let szUiRewardIdx = szRewardIdx.concat([]);
        let map = new Map();
        szUiRewardIdx.forEach((v: number, k)=>{
            map[v + this.realCellIdx] = true;
            szUiRewardIdx[k] += this.realCellIdx
        })

        let currentShow = this.szSymbol.length;
        let idx = 0;
        for(let len=newSymbolCount, symbol=0; idx < len; idx++) { // 消除几个就需要补充几个
            // console.log( "i = " + i)
            let cell = this.szCell[currentShow + this.realCellIdx + idx];
            symbol = szSymbol[szSymbol.length - len + idx];
            this.setCellPosition(cell, this.lastCellCount);// 夺宝效果多了一些空间，往上移动，这里也是掉落，不影响
            let {frameType, space, itemType} = ConfigMethod.decodeItemType(symbol);
            cell.setSymbol(symbol, frameType, space, itemType, false);
            this.lastCellCount += space;
        }

        let cellIdx = this.szCell[0].getRollIdx();
        let totalLen = currentShow + newSymbolCount;
        let actionCount = 0; // 掉落的动画不能一起，要间隔
        for (let i=1, moveIdx=0, cell:Cell; i<totalLen; i++){
            cell = this.szCell[moveIdx];
            if (cell.getSymbolId() != IconDefine.BLANK){
                moveIdx += 1;
                let {space} = ConfigMethod.decodeItemType(cell.getSymbolId());
                cellIdx += space;
                continue
            }

            if (this.szCell[i].getSymbolId() == IconDefine.BLANK){
                continue
            }

            
            let {frameType, space, itemType}  = ConfigMethod.decodeItemType(this.szCell[i].getSymbolId());
            this.swapAction(moveIdx, i, cellIdx, actionCount);
            cellIdx += space;
            actionCount += 1;

            if (itemType == IconDefine.SCATTER){
                this.szCell[moveIdx].node.setSiblingIndex(this.szCell.length);
            }
            
            // console.log(`moveIdx=${moveIdx}, i=${i}`)
            moveIdx += 1;
        }

        this.szSymbol = szSymbol;

        // this.stopSymbolShake();

        // this.dumpInfo();// 测试
        // console.log(`服务器数据${szSymbol}`);
    }

    /**
     * 已经有的符号填充到空白位置
     * @param szRewardIdx 
     */
    playFillEmptySymbol(szRewardIdx: number[]) {
        let moveSymbolCount = this.szSymbol.length - szRewardIdx.length; // 需要移动的符号数量
        if (moveSymbolCount == 0){ // 全消
            return false
        }

        let cellIdx = this.szCell[0].getRollIdx();
        let totalLen = this.szSymbol.length;
        let actionCount = 0; // 掉落的动画不能一起，要间隔
        for (let entityIdx=1, emptyIdx=0, cell:Cell; entityIdx < totalLen; entityIdx++) {
            cell = this.szCell[emptyIdx];
            if (cell.getSymbolId() != IconDefine.BLANK){
                emptyIdx += 1;
                let {space} = ConfigMethod.decodeItemType(cell.getSymbolId());
                cellIdx += space;
                continue
            }

            if (this.szCell[entityIdx].getSymbolId() == IconDefine.BLANK){
                continue
            }
            
            let {space} = ConfigMethod.decodeItemType(this.szCell[entityIdx].getSymbolId());
            this.swapAction(emptyIdx, entityIdx, cellIdx, actionCount);
            cellIdx += space;
            actionCount += 1;
            emptyIdx += 1;
            moveSymbolCount -= 1
            if (moveSymbolCount <= 0){
                break;
            }
        }

        return actionCount > 0;
    }

    /**
     * 新符号填充空白
     */
    playFillNewSymbol(newSymbolCount: number, szSymbol:number[]){
        let currentShow = this.szSymbol.length;
        let idx = 0;
        for(let len=newSymbolCount, symbol=0; idx < len; idx++) { // 从上面掉下填充空白位置
            // console.log( "i = " + i)
            let cell = this.szCell[currentShow + this.realCellIdx + idx];
            symbol = szSymbol[szSymbol.length - len + idx];
            this.setCellPosition(cell, this.lastCellCount);
            let {frameType, space, itemType} = ConfigMethod.decodeItemType(symbol);
            cell.setSymbol(symbol, frameType, space, itemType, false);
            this.lastCellCount += space;
        }

        let cellIdx = this.szCell[0].getRollIdx();
        let totalLen = currentShow + newSymbolCount;
        for (let moveIdx=0, i=moveIdx+1,  cell:Cell; i < totalLen; i++){
            cell = this.szCell[moveIdx];
            if (cell.getSymbolId() != IconDefine.BLANK){
                moveIdx += 1;
                let {space} = ConfigMethod.decodeItemType(cell.getSymbolId());
                cellIdx += space;
                continue
            }

            if (this.szCell[i].getSymbolId() == IconDefine.BLANK){
                continue
            }

            
            let {frameType, space, itemType} = ConfigMethod.decodeItemType(this.szCell[i].getSymbolId());
            this.swapAction(moveIdx, i, cellIdx, 0);
            cellIdx += space;

            if (itemType == IconDefine.SCATTER){
                this.szCell[moveIdx].node.setSiblingIndex(this.szCell.length);
            }
            
            // console.log(`moveIdx=${moveIdx}, i=${i}`)
            moveIdx += 1;
        }

        this.szSymbol = szSymbol;

        // this.dumpInfo();// 测试
        // console.log(`服务器数据${szSymbol}`);
    }


    /**
     * 停止所有图标晃动
     */
    stopSymbolShake(){
        this.szCell.forEach((v, k)=>{
            v.stopSymbolShake()
        })
    }

    private swapAction(emptyIdx:number, entityIdx:number, cellIdx: number, actionCount: number){
        let empty = this.szCell[emptyIdx];
        let entity = this.szCell[entityIdx];

        let topCellPoint = this.getCellPosition(this.showColNum);// 消除会导致掉落的位置靠后，会导致掉落距离过大，这里控制距离
        if (this.horizontal){
            if (entity.node.position.x > topCellPoint.x){
                entity.node.position = this.getCellPosition(this.showColNum + 1);
            }
        }else{
            if (entity.node.position.y > topCellPoint.y){
                entity.node.position = this.getCellPosition(this.showColNum + 1);
            }
        }
        
        // let emptyPos = empty.getPosition();
        let targetPos:Vec3
        if (entity.getSymbolId() % IconGrid.SPACEBASE == IconDefine.SCATTER){
            let entityPos = this.getCellPosition(entity.getRollIdx());
            empty.node.setPosition(entityPos);
            targetPos = this.getCellPosition(cellIdx);
            let worldPos = NodeEx.getWorldPosition(this.node, targetPos);
            targetPos = NodeEx.getLocalPosition(entity.node.parent, worldPos);
        }else{
            let entityPos = entity.getPosition();
            empty.node.setPosition(entityPos);
            targetPos = this.getCellPosition(cellIdx);
        }
     
        // console.log("distance", targetPos, entityPos,  Vec3.distance(targetPos, entityPos))
        
        entity.playBounce(targetPos, actionCount * 0.05, this.columnValue == COLUMN_HORIZONTAL, ()=>{
            if (!this.horizontal){// 横轴没有
                this.dustLayer.playDust(NodeEx.getWorldPosition(this.node, new Vec3(targetPos.x, targetPos.y - this.itemSize.height / 2, targetPos.z)));
            }
        }); // 有个图标占用多个格子，只能用虚拟坐标
        entity.setRollIdx(cellIdx);

        this.szCell[emptyIdx] = entity;
        this.szCell[entityIdx] = empty;
        empty.setEmptySymbol();
    }

    private playBounce(){
        let t = tween(this.node)
        t.call(()=>{
            this.finishBeforeEmit();
        })
        if (this.horizontal){
            t.by(0.08, {position:new Vec3(5, 0, 0)})
            .by(0.08, {position:new Vec3(-5, 0, 0)})
        }else{
            t.by(0.08, {position:new Vec3(0, 5, 0)})
            .by(0.08, {position:new Vec3(0, -5, 0)})
        }

        t.call(()=>{
            this.node.setPosition(this.rollOriginPoint);
            for (let i=this.realCellIdx, len=this.szSymbol.length + this.realCellIdx; i<len; i++){
                this.szCell[i].playScatter();
            }
            this.finishEmit();
        }).start()
    }

    finishBeforeEmit(){
        this.emitter.emit(EMIT_COLUME_DONE_BEFORE, this.columnValue);
    }

    finishEmit(){
        // console.log("finishEmit", new Date().getTime());
        this.emitter.emit(EMIT_COLUME_DONE, this.columnValue);
    }

    private setCellPosition(cell: Cell, cellIdx: number){
        cell.node.setPosition(this.getCellPosition(cellIdx))
        cell.setRollIdx(cellIdx)
    }

    private getCellPosition(cellIdx: number){
        if (this.horizontal) {
            return new Vec3(this.firstItemPosition.x + cellIdx*(this.itemSize.width+this.space), this.firstItemPosition.y, this.firstItemPosition.z);
        }else{
            return new Vec3(this.firstItemPosition.x, this.firstItemPosition.y + cellIdx*(this.itemSize.height+this.space), this.firstItemPosition.z);
        }
    }

    private onClickCell(cell: Cell){
        let idx:number = null;
        let isEmpty = false;//
        for (let i=this.szSymbol.length - 1; i>=this.realCellIdx; i--){ // 从上往下找
            if (this.szCell[i] == cell){
                isEmpty = cell.getSymbolId() == IconDefine.BLANK;// 空的，是有多个格子的符号，继续往下找
                if (isEmpty){
                    continue;
                }
                idx = i;
                break
            }
            if (isEmpty){
                if (this.szCell[i].getSymbolId() != IconDefine.BLANK) {// 找到真实的符号
                    cell = this.szCell[i];
                    idx = i;
                    break;
                }
            }
        }

        if (idx == null){
            return;
        }

        if (this.columnValue == COLUMN_HORIZONTAL){
            if (idx >= 4){
                return 
            }
        }else{
            if (idx >= 5){ // 
                return 
            }
        }

        this.emitter.emit(EMIT_SYMBOL_INFO_OPEN, this.columnValue, cell, idx);
    }

    updateTick(deltaTime: number) {
        if (this.rollStatus == RollStatus.STOP){
            return;
        }

        deltaTime = Math.min(deltaTime, 0.03);
        

        if (this.horizontal){
            let maxOffsetX = Math.min(this.itemSize.width, deltaTime*this.speed); // 有时候卡了，移动限制
            this.node.setPosition(this.node.position.x - maxOffsetX, this.node.position.y);
        }else{
            let maxOffsetY = Math.min(this.itemSize.height, deltaTime*this.speed); // 有时候卡了，移动限制
            this.node.setPosition(this.node.position.x, this.node.position.y - maxOffsetY);
        }
        
        if (this.rollStatus == RollStatus.PLAYING){
            this.updateFirstCellRandSymbol();// 循环替换超出的cell
        } else if (this.rollStatus == RollStatus.RESULT){
            if (this.snapedone){
                this.rollStatus = RollStatus.STOP;
                this.flushResultItem()//快速完成，直接刷新全部cell
            }else{
                if (this.szSymbolIdx >= this.szSymbol.length){
                    this.updateFirstCellRandSymbol();//非结果cell随机
                    if (this.szCell[this.realCellIdx] == this.firstCell){
                        this.rollStatus = RollStatus.STOP;
                        this.flushResultPosition()
                    }
                }else{
                    this.updateResultItem();// 控制好开奖的结果停止位置
                }
            }
           
            if (this.rollStatus == RollStatus.STOP){
                if (!this.snapedone){
                    this.playBounce()
                }else{
                    this.finishBeforeEmit()
                    this.finishEmit()
                }
            }
        } 
    }

    // 检查第一个符号是否超出虚拟节点
    private isCellOut(cell:Cell){
        let pos = cell.getRollOutWorldPosition(this.horizontal);
        if (this.horizontal){
            return pos.x <= NodeEx.getWorldPosition(this.virtualOutNode).x
        }else{
            return pos.y <= NodeEx.getWorldPosition(this.virtualOutNode).y
        }
    }
    
    // 更新随机符号
    private updateFirstCellRandSymbol() {
        let cell = this.szCell[0];
        if (this.isCellOut(cell)){// 第一个已经超过显示范围，挪动到最后一个位置
            this.szCell.shift();
            this.szCell.push(cell);
            this.setCellPosition(cell, this.lastCellCount);
            this.lastCellCount += cell.setRandSymbol(!this.isScatterEffect(), this.isWildCol(), this.columnValue > 1 && this.columnValue < COLUMN_LAST_IDX);
        }
    }

    // 更新具体元素
    private updateResultItem() {
        let cell = this.szCell[0];
        if (this.isCellOut(cell)){// 第一个已经超过显示范围，挪动到最后一个位置，并更新成结果符号
            this.szCell.shift()
            this.szCell.push(cell)
            this.setCellPosition(cell, this.lastCellCount)
            
            let {frameType, space, itemType} = ConfigMethod.decodeItemType(this.szSymbol[this.szSymbolIdx]);
            cell.setSymbol(this.szSymbol[this.szSymbolIdx], frameType, space, itemType, false);
            this.lastCellCount += space;
            if (this.szSymbolIdx == 0){ 
                this.firstCell = cell;
            }
            this.szSymbolIdx++;
        }
    }

    //显示开奖数据
    private flushResultItem(){
        this.lastCellCount = 0;
        let cellIdx = this.realCellIdx;

        for (let i=0, len=this.szSymbol.length; i<len; i++){
            let cell = this.szCell[cellIdx];
            this.setCellPosition(cell, this.lastCellCount);
            let {frameType, space, itemType} = ConfigMethod.decodeItemType(this.szSymbol[i]);
            cell.setSymbol(this.szSymbol[i], frameType, space, itemType, false);
            this.lastCellCount += space;
            if (itemType == IconDefine.SCATTER){ // 夺宝放在顶层
                cell.node.setSiblingIndex(this.szCell.length);
            }
            cellIdx++;
        }

        // 其他图标搞到外边，否则有可能也在显示范围内
        for (let i=this.szSymbol.length, len=this.szCell.length; i<len; i++){
            let cell = this.szCell[cellIdx];
            this.setCellPosition(cell, this.lastCellCount);
        }

        this.node.setPosition(this.rollOriginPoint);
        // this.dumpInfo();// 测试
        // console.log(`服务器数据${this.szSymbol}`);
    }

    /**
     * 重置滚动位置和节点顺序
     */
    private flushResultPosition(){
        this.lastCellCount = 0;
        let cellIdx = this.realCellIdx;

        let cell:Cell = null;
        for (let i=0; i<this.szSymbol.length; i++){
            cell = this.szCell[cellIdx];
            this.setCellPosition(cell,  this.lastCellCount);
            let {frameType, space, itemType} = ConfigMethod.decodeItemType(this.szSymbol[i]);
            if (itemType == IconDefine.SCATTER){ // 夺宝放在顶层
                cell.node.setSiblingIndex(this.szCell.length);
            }
            this.lastCellCount += space;
            cellIdx++;
        }

        this.node.setPosition(this.rollOriginPoint);
    }

    private isWildCol(){
        return this.columnValue == 0 || this.columnValue >= 1 && this.columnValue <= 4;
    }

    // // dumpinfo
    // private dumpInfo(){
    //     let sz = []
    //     for (let i=this.realCellIdx, len=this.szSymbol.length; i<len; i++){
    //         sz.push(this.szCell[i].getSymbolId());
    //     }

    //     console.log(`col=${this.columnValue}, data=${sz}`);
    // }
}

