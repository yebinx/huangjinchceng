import { _decorator, Component, EventTouch, instantiate, Label, Node, NodeEventType, ScrollView, Size, UITransform, Vec2, Vec3 } from 'cc';
import { NodeEx } from '../lib/NodeEx';
const { ccclass, property } = _decorator;

enum ItemFlg{
    NULL = 0,
    VIRTUAL = 1 << 1,
    REAL = 1 << 2,
}

// 一组数据选择某个idx
@ccclass('SharedSettingBetSelectIdx')
export class SharedSettingBetSelectIdx extends Component {
    @property({type:ScrollView})
    sv: ScrollView

    @property({type:Node})
    svitem:Node = null;

    private itemSize:Size
    private virtualItemCount: number = 0; // 虚拟节点数量，计算sv content用
    private realItemCount:number = 0; // 实际数据节点
    private point:Vec3 = null; // 选择的位置
    private pointIdx:number = 0; // 当前选择的idx
    private fullScreeItemCount = 0; // view全满需要几个item，超出的item在能滑动，这里记录满屏的条件

    private eventStartCallback: ()=>void = null;
    private eventStopCallback: (dataIdx: number)=>void = null; // 事件停止后回调
    private doLogic: boolean = false; // 滑动和点击会触发2次，这个标志用于一次只能触发一次
    private touchStartcontentPosition:Vec3 = null; //

    private data:string[] = null;

    onLoad() {
        this.svitem.active = false;

        let uiTransform = this.svitem.getComponent(UITransform);
        this.itemSize = new Size(uiTransform.width, uiTransform.height);
        this.fullScreeItemCount = Math.floor(this.node.getComponent(UITransform).height / this.itemSize.height);

        this.sv.cancelInnerEvents = false;// 关闭吞噬事件，否则会和点击的冲突，否则微小的拖动会显示怪异

        this.registerEvent()
    }

    protected onEnable(): void {
        // super.onEnable();
        this.scheduleOnce(()=>{this.sv.node.off(NodeEventType.MOUSE_WHEEL, null, null, true);}, 0) // 禁用鼠标滚动
    }
    
    setData(data: string[]){
        this.data = data;
    }

    setStartCallback(callback: ()=> void){
        this.eventStartCallback = callback;
    }
    
    setStopCallBack(callback: (dataIdx: number)=>void){
        this.eventStopCallback = callback;
    }

    touchEnable(){
        this.sv.enabled = false;
    }

    getSelectIdx(){
        return this.pointIdx
    }

    flush(){
        this.sv.content.removeAllChildren();
        this.virtualItemCount = 0;
        this.realItemCount = 0;

        if (this.data.length <= 0){
            return 
        }

        if (this.data.length == 1){
            this.addItem(this.data[0].toString(), ItemFlg.REAL)
            this.initSelectNode()
            this.updateContentSize()
            return 
        }

        // let emptyCount = Math.min(2, Math.max(0, Math.floor(this.data.length / 2)));
        let emptyCount = 2;
        this.virtualItemCount += emptyCount;
     
        this.data.forEach((v:string, k:number )=>{
            let item = this.addItem(v, ItemFlg.REAL | ItemFlg.VIRTUAL);
            NodeEx.addClick(item, this.onTouchCell.bind(this, k));
        })

        this.virtualItemCount += emptyCount;

        if (this.realItemCount < this.fullScreeItemCount){
            this.virtualItemCount = this.virtualItemCount + this.fullScreeItemCount - this.realItemCount;
        }

        this.initSelectNode()
        this.updateContentSize()
        this.addItem("--", ItemFlg.NULL, new Vec3(0, this.itemSize.height*emptyCount * -1 + this.itemSize.height * 0.5, 0)); // 顶部
        this.addItem("--", ItemFlg.NULL, new Vec3(0, this.itemSize.height*(this.data.length + emptyCount) * -1 - this.itemSize.height * 0.5, 0)) // 尾部

        // this.scheduleOnce(()=>{ // 初始化第几个
        //     this.scrollTo(2, 0)
        // }, 0)
    }

    private initSelectNode(){
        this.pointIdx = 0;
        let selectNode =  this.sv.content.children[this.pointIdx]
        this.point = new Vec3(selectNode.position)
    }

    getWorldPoint(){
        let uiTransform = this.sv.content.getComponent(UITransform);
        return uiTransform.convertToWorldSpaceAR(this.point);
    }

    registerEvent(){
        this.sv.node.on(Node.EventType.TOUCH_START, this.onEventScrollBegin, this);
        // this.sv.node.on(ScrollView.EventType.SCROLL_ENDED, this.onEventScrollEnd, this)
        this.sv.node.on(Node.EventType.TOUCH_END, this.onEventScrollTouchUp, this);
        this.sv.node.on(Node.EventType.TOUCH_CANCEL, this.onEventScrollTouchUp, this);
    }

    /**
     * 添加节点
     * @param data 显示内容
     * @param itemFlg 
     * @param point 指定位置
     * @returns 
     */
    private addItem(data: string, itemFlg: number, point?: Vec3){
        let newItem = instantiate(this.svitem);
        newItem.getComponent(Label).string = data;
        newItem.active = true;
        this.sv.content.addChild(newItem)

        if (point){
            newItem.position = point;
        }else{
            let offsetY = this.itemSize.height*this.virtualItemCount * -1 - this.itemSize.height * 0.5
            newItem.position = new Vec3(0, offsetY, 0);
        }
        
        if ((itemFlg & ItemFlg.REAL) == ItemFlg.REAL){
            this.realItemCount += 1;
        }

        if ((itemFlg & ItemFlg.VIRTUAL) == ItemFlg.VIRTUAL){
            this.virtualItemCount += 1;
        }
        
        return newItem
    }

    private updateContentSize(){
        this.sv.content.getComponent(UITransform).height = this.virtualItemCount * this.itemSize.height;
    }

    /**
     * 点击具体位置
     * @param idx 
     * @returns 
     */
    private onTouchCell(idx: number){
        if (!this.doLogic){
            return 
        }

        // console.log("onTouchCell" + idx)

        this.doLogic = false;

        this.scrollTo(idx, 0.1)
        if (this.eventStopCallback){
            this.eventStopCallback(this.pointIdx)
        }
    }
  
    private onEventScrollBegin(sv:ScrollView){
        // console.log("begin")
        this.doLogic = true;
        this.touchStartcontentPosition = this.sv.content.position.clone();
        if (this.eventStartCallback){
            this.eventStartCallback();
        }
    }

    // private onEventScrollEnd(sv:ScrollView){
    //     console.log("end")
    // }

    private onEventScrollTouchUp(event: EventTouch){
        if(!this.doLogic){
            return
        }
        this.doLogic = false;

        let moveY = Math.abs(this.sv.content.position.y - this.touchStartcontentPosition.y);// 移动多少像素

        let moveIdx = Math.floor(moveY / this.itemSize.y); // 大概移动几个位置
        let remainingY = moveY - moveIdx * this.itemSize.y;
        if (remainingY > this.itemSize.y*0.5){ // 如果超过半个节点大小则算多移动一个位置
            moveIdx += 1;
        }

        let targetIdx:number; // 计算最终选择的节点idx
        if (this.sv.content.position.y > this.touchStartcontentPosition.y){ // up
            targetIdx = this.pointIdx + moveIdx;
        }else{
            targetIdx =  this.pointIdx - moveIdx;
        }

        this.scrollTo(targetIdx, 0.1)

        if (this.eventStopCallback){
            this.eventStopCallback(this.pointIdx);
        }
    }

    /**
     * 滚到到哪个idx
     * @param targetIdx 目标点
     * @param durationSec 滚动动画时间
     */
    scrollTo(targetIdx: number, durationSec: number){
        if (this.realItemCount <= targetIdx){
            targetIdx = this.realItemCount - 1;
        }else{
            targetIdx = Math.max(0, targetIdx);
        }

        let targetNode = this.sv.content.children[targetIdx];
        let offsetY = this.point.y - targetNode.position.y; // 与上次节点相差位置
        this.sv.scrollToOffset(new Vec2(0, offsetY), durationSec); // 最终节点居中
        this.pointIdx = targetIdx;
        this.point = new Vec3(targetNode.position);
        this.point.y += offsetY;
    }
}


