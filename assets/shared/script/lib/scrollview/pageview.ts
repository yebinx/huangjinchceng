import { _decorator, Component, EventTouch, Layout, Node, NodeEventType, ScrollView, Size, Socket, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PageViewEx')
export class PageViewEx extends Component {
    @property({type:ScrollView})
    scrollView: ScrollView;

    private doLogic: boolean = false;
    private doMoveLogic: boolean = false;
    private touchBeginContentPos = Vec3.ZERO;// 点击开始，scorellview的content位置，不能用touch转换，会有转换不正确
    private itemSize:Size;
    private realItemCount:number = 0; // 实际数据节点
    private currentPoint:Vec3 = null; // 选择的位置
    private currentIdx:number = 0; // 当前选择的idx
    ItemSizePer = 0.3; // 拖到百分多少算移动， 0~1

    private idxChangeCallback:(selectPage: number, totalPage:number)=>void;
    private slideOutCallback:()=>void;
    
    protected onLoad(): void {
        this.scrollView.node.on(NodeEventType.TOUCH_START, this.onEventScrollBegin, this, true); // 使用捕获层，否则事件可能会被其他节点吞噬
        this.scrollView.node.on(NodeEventType.TOUCH_END, this.onEventScrollTouchUp, this);
        this.scrollView.node.on(NodeEventType.TOUCH_CANCEL, this.onEventScrollTouchUp, this);
    }

    start(): void {
        let uiTransform = this.scrollView.getComponent(UITransform);
        this.itemSize = new Size(uiTransform.width, uiTransform.height);
    }

    getCurrentIdx(){ return this.currentIdx; }
    getTotalIdx() { return this.realItemCount; }

    listenerIdxChange(callback: (selectPage: number, totalPage:number)=>void){
        this.idxChangeCallback = callback;
    }

    listenerSlideOutCallback(cb: ()=>void){
        this.slideOutCallback = cb;
        this.scrollView.node.on(NodeEventType.TOUCH_MOVE, this.onEventScrollMove, this, true);
    }

    flush(realItemCount?: number){
        if (realItemCount){
            this.realItemCount = realItemCount;
        }else{
            this.realItemCount = this.scrollView.content.children.length;
        }
        
        // 下一帧更新，否则初始化的时候content还没进行update
        this.scheduleOnce(()=>{
            let layout =this.scrollView.content.getComponent(Layout)
            if (layout){
                layout.updateLayout()
            }
    
            this.currentPoint = this.scrollView.content.children[this.currentIdx].position.clone();
        }, 0)
    }

    // 触发一次事件
    dispatchEvent(){
        if (this.idxChangeCallback){
            this.idxChangeCallback(this.currentIdx, this.realItemCount);
        }
    }

    // 移动下一页
    nextPage(){
        let nextPage = this.currentIdx + 1;
        if (nextPage >= this.realItemCount){
            return 
        }
        this.scrollToEx(nextPage, 0.3);
    }

    // 上一页
    prevPage(){
        let prevPage = this.currentIdx - 1;
        if (prevPage < 0){
            return 
        }
        this.scrollToEx(prevPage, 0.3);
    }

    /**
     * 滚到到哪个idx
     * @param targetIdx 目标点
     * @param durationSec 滚动动画时间
     */
    scrollToEx(targetIdx: number, durationSec: number){
        if (this.realItemCount == 0){
            return 
        }

        if (this.realItemCount <= targetIdx){
            targetIdx = this.realItemCount - 1;
        }else{
            targetIdx = Math.max(0, targetIdx);
        }

        let targetNode = this.scrollView.content.children[targetIdx];
        if (this.scrollView.vertical){ // 垂直滚动，还未验证
            let offsetY = this.currentPoint.y - targetNode.position.y; // 与上次节点相差位置
            this.scrollView.scrollToOffset(new Vec2(0, offsetY), durationSec); // 最终节点居中
            this.currentIdx = targetIdx;
            this.currentPoint = new Vec3(targetNode.position);
            this.currentPoint.y += offsetY;
        }else{ // 水平滚动
            // cocos引擎设计反人类，偏移不用相对位置，而是用容器大小，难以理解
            let offsetMax = this.scrollView.getMaxScrollOffset();
            let offsetX = offsetMax.x / (this.realItemCount - 1) * targetIdx;

            if (offsetX == 0){// 左往右滑 使用引擎的回弹
                if (this.scrollView.elastic && this.scrollView.content.position.x > 0 && this.currentIdx <= 0){
                    // console.log("scrollToEx", "return", 1)
                    return 
                }
            }
            if (offsetX == offsetMax.x){ // 右往左滑 使用引擎的回弹
                if (this.scrollView.elastic && this.scrollView.content.position.x < -1 *(this.realItemCount * this.itemSize.width) ){
                    // console.log("scrollToEx", "return", 2)
                    return 
                }
            }

            // console.log("scrollToEx", "offset", offsetX)
            this.scrollView.scrollToOffset(new Vec2(offsetX, 0), durationSec); // 最终节点居中
            this.currentIdx = targetIdx;
        }

        if (this.idxChangeCallback){
            this.idxChangeCallback(this.currentIdx, this.realItemCount);
        }

        // console.log("targetIdx " + targetIdx)
    }

    private onEventScrollBegin(scrollView:ScrollView){
        // console.log("begin")
        this.doLogic = true;
        this.doMoveLogic = true;
        this.touchBeginContentPos = this.scrollView.content.position.clone();
        // if (this.eventStartCallback){
        //     this.eventStartCallback();
        // }
    }

    // 检查移动到最左边的idx，做自动退出逻辑
    // TODO, 这里其实不同项目，根据合适情况修改吧，这个项目只做滑动退出
    private onEventScrollMove(scrollView:ScrollView){
        if(!this.doLogic || !this.doMoveLogic){
            return
        }

        if (!this.scrollView.horizontal){
            return 
        }
        
        if (this.realItemCount == 0){
            return 
        }

        let startPoint = this.touchBeginContentPos;
        let endPoint = this.scrollView.content.position.clone();

        let moveX = Math.abs(startPoint.x - endPoint.x);// 移动多少像素
        if (moveX < this.itemSize.width*this.ItemSizePer){
            return 
        }

        let moveIdx = Math.floor(moveX / this.itemSize.width); // 大概移动几个位置
        let remainingX = moveX - moveIdx * this.itemSize.width;
        if (remainingX > this.itemSize.width*this.ItemSizePer){ // 如果超过半个节点大小则算多移动一个位置
            moveIdx += 1;
        }

        let targetIdx:number; // 计算最终选择的节点idx
        if (endPoint.x > startPoint.x){ // left to right
            targetIdx = this.currentIdx - moveIdx;
        }else{
            targetIdx =  this.currentIdx + moveIdx;
        }

        if (targetIdx >= 0) {
            return 
        }

        this.doMoveLogic = false;
        if (this.slideOutCallback){
            this.slideOutCallback();
        }
    }

    private onEventScrollTouchUp(event: EventTouch){
        if(!this.doLogic){
            return
        }
        this.doLogic = false;

        if (this.realItemCount == 0){
            return 
        }

        let startPoint = this.touchBeginContentPos;
        let endPoint = this.scrollView.content.position.clone();

        let targetIdx:number; // 计算最终选择的节点idx
        if (this.scrollView.vertical){  //垂直滚动
            let moveY = Math.abs(startPoint.y - endPoint.y);// 移动多少像素
            let moveIdx = Math.floor(moveY / this.itemSize.y); // 大概移动几个位置
            let remainingY = moveY - moveIdx * this.itemSize.y;
            if (remainingY > this.itemSize.y*this.ItemSizePer){ // 如果超过半个节点大小则算多移动一个位置
                moveIdx += 1;
            }
    
            if (endPoint.y > startPoint.y){ // up
                targetIdx = this.currentIdx + moveIdx;
            }else{
                targetIdx =  this.currentIdx - moveIdx;
            }
        }else{ // 水平滚动
            let moveX = Math.abs(startPoint.x - endPoint.x);// 移动多少像素
            let moveIdx = Math.floor(moveX / this.itemSize.width); // 大概移动几个位置
            let remainingX = moveX - moveIdx * this.itemSize.width;
            if (remainingX > this.itemSize.width*this.ItemSizePer){ // 如果超过半个节点大小则算多移动一个位置
                moveIdx += 1;
            }
    
            if (endPoint.x > startPoint.x){ // left to right
                targetIdx = this.currentIdx - moveIdx;
            }else{
                targetIdx =  this.currentIdx + moveIdx;
            }

            // console.log("moveX", moveX)
            // console.log("moveIdx", moveIdx)
            // console.log("itemSize.Width", this.itemSize.width)
            // console.log("remainingX", remainingX)
            // console.log("ItemSizePer", this.itemSize.width*this.ItemSizePer)
        }

        // console.log("onEventScrollTouchUp", targetIdx)
        this.scrollToEx(targetIdx, this.scrollView.bounceDuration)
        // console.log("touch up");
    }
}
