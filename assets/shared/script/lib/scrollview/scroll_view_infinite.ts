import { Node, Prefab, instantiate, Vec3, ScrollView, Component, _decorator, Size, math, CCInteger } from 'cc';
import { NodeEx } from '../NodeEx';

const { ccclass, property } = _decorator;

@ccclass("ScrollViewInfinite")
export default class ScrollViewInfinite extends Component {
    @property({type:ScrollView})
    scrollView:ScrollView;

    @property({type:Prefab})
    itemPrefab: Prefab = null;

    @property({type:CCInteger})
    minViewCount:number = 3;

    private waitItems: Node[] = [];
    private useItems: Node[] = [];
    private virturalItemCount: number = 0;
    private realItemCount: number = 0;
    private ItemSize:Size = null;
    private startIdx: number = 0; // [startIdx, endIdx)
    private endIdx: number = 0;
    private viewCount: number = 0; // 整屏可以看到的item数量
    private bottomSpace: number = 0;
    private loadingNode:Node = null;

    // 新增的回调函数
    private itemUpdateCallback: (sv:ScrollViewInfinite, index: number, item: Node) => void = null;
    private itemCreateCallback: (sv:ScrollViewInfinite, index: number, item: Node) => void = null;

    protected onLoad() {
        this.ItemSize = NodeEx.getSize(this.itemPrefab.data);
    }

    start(): void {
        this.scrollView.content.removeAllChildren();
        this.scrollView.content.position = Vec3.ZERO; // 设置 content 的位置
        this.viewCount = Math.max(this.minViewCount, this.calculateVirtualItemCount()); 
        this.virturalItemCount = this.viewCount * 1.5; // 多50%，是适配的时候会发生显示
        for (let i = 0; i < this.virturalItemCount; i++) {// 预先创建复用的子节点
            this.createItem(i);
        }

        this.scrollView.node.on(ScrollView.EventType.SCROLLING, this.onScrolling, this);
    }

    public getRealItemCount(){ return this.realItemCount; }
    public getViewCount() {return Math.floor(this.calculateVirtualItemCount()); }

    public initialize(realItemCount: number) {
        this.realItemCount = realItemCount;
        this.updateContent(this.bottomSpace);

        this.startIdx = 0;
        this.endIdx = Math.min(realItemCount, this.viewCount);
        this.updateViewItem(this.startIdx, this.endIdx)
    }

    public appendItems(addItemCount: number) {
        if (addItemCount <= 0){
            return;
        }

        this.realItemCount += addItemCount;
        this.updateContent(this.bottomSpace);

        let showItemCount = this.endIdx - this.startIdx;
        if (showItemCount >= this.viewCount) {
            return 
        }

        if (this.endIdx >= this.viewCount){
            return
        }

        // 数据还没显示满
        let start = this.endIdx;
        let end = Math.min( this.realItemCount, this.viewCount);
        this.updateViewItem(start, end);
        this.endIdx = end;
    }

    // 添加loading
    public appendLoading(node:Node, offsetY: number){
        this.scrollView.content.addChild(node);
        this.loadingNode = node;
        
        let size = NodeEx.getSize(this.scrollView.content);
        size.height -= this.bottomSpace;

        node.position = new Vec3(0, -1 * size.height + offsetY);
        this.updateContent(this.bottomSpace);
        this.scrollView.scrollToBottom(null);
    }

    public removeLoading(){
        if (this.loadingNode != null){
            this.loadingNode.destroy();
            this.loadingNode = null;
        }

        this.updateContent(this.bottomSpace);
    }

    // 设置回调函数
    public setItemUpdateCallback(callback: (sv:ScrollViewInfinite, index: number, item: Node) => void) {
        this.itemUpdateCallback = callback;
    }

    public setItemCreateCallback(callback: (sv:ScrollViewInfinite, index: number,  item: Node) => void) {
        this.itemCreateCallback = callback;
    }

    public updateContent(bottomSpace: number) {
        if (this.scrollView.horizontal){
            const itemWidth = this.ItemSize.width; // 子节点的宽度
            const contentSize = NodeEx.getSize(this.node);
            contentSize.width = Math.max(contentSize.width, (this.realItemCount) * itemWidth) + bottomSpace;  // 计算 content 节点的宽度，确保能容纳所有子节点
            NodeEx.setSize(this.scrollView.content, contentSize.width, null);// 设置 content 节点的宽度
            return 
        }

        if (this.scrollView.vertical){
            this.bottomSpace = bottomSpace;
            const itemHeight = this.ItemSize.height; // 子节点的高度
            const contentSize = NodeEx.getSize(this.node);
            contentSize.height = Math.max(contentSize.height, (this.realItemCount) * itemHeight) + bottomSpace;  // 计算 content 节点的高度，确保能容纳所有子节点
    
            if (this.loadingNode != null){
                contentSize.height = contentSize.height + NodeEx.getSize(this.loadingNode).height;
            }
            NodeEx.setSize(this.scrollView.content, null, contentSize.height);// 设置 content 节点的高度
            return 
        }
    }

    // 跳转到哪个idx
    scrollToEx(targetIdx: number){
        if (this.useItems.length > 0){
            this.useItems.forEach((node:Node) => {
                node.active = false;
            });
            this.waitItems = this.waitItems.concat(this.useItems);
            this.useItems = [];
        }

        this.startIdx = Math.max(0, targetIdx - this.viewCount + 1);
        this.endIdx = Math.min(this.startIdx + this.viewCount, this.realItemCount);
        this.updateViewItem(this.startIdx, this.endIdx)
    }

    // 计算item数量
    private calculateVirtualItemCount() {
        if (this.scrollView.vertical){
            let scrollViewSize = NodeEx.getSize(this.node);
            let itemCount = Math.ceil(scrollViewSize.height / this.ItemSize.height);
            return itemCount;
        }
      
        if (this.scrollView.horizontal){
            let scrollViewSize = NodeEx.getSize(this.node);
            let itemCount = Math.ceil(scrollViewSize.width / this.ItemSize.width);
            return itemCount;
        }
    }

    private createItem(index: number) {
        const item = instantiate(this.itemPrefab); // 根据预制资源创建子节点
        this.scrollView.content.addChild(item); // 将子节点添加到 content 节点中
        this.waitItems.push(item); // 将子节点加入数组中
        item.active = false;
        if (this.itemCreateCallback){
            this.itemCreateCallback(this, index, item);
        }
    }

    private updateViewItem(startIdx: number, endIdx: number) {
        for (let start=startIdx, end=endIdx; start < end; start++){
            let item = this.waitItems.pop();
            item.active = true;
            this.useItems.push(item);
            this.setItemPosition(item, start);
            this.itemUpdateCallback(this, start, item);
        }
    }

    // 动态设置子节点的位置
    private setItemPosition(item:Node, index: number){
        if (this.scrollView.vertical){
            item.position = new Vec3(0, -index * this.ItemSize.height, 1);
            return 
        }

        if (this.scrollView.horizontal){
            item.position = new Vec3(index * this.ItemSize.width, 0, 1);
            return 
        }
    }

    private onScrolling() {
        if (this.scrollView.vertical){
            const offsetY = this.scrollView.content.position.y; // 获取 content 节点的纵向偏移量
            let start = Math.max(0, Math.floor(offsetY / this.ItemSize.height));
            const end = Math.min(start + this.viewCount, this.realItemCount);

            let showCount = end - start; // 显示数量
            if (showCount < this.viewCount && end > this.viewCount){// 最终显示数量过小，但实际数量很多，从尾更新到头，出现这种情况就是在滑动在尾部
                start =  Math.max(0, end - this.viewCount);
            }

            return this._ScrollVertical(start, end);
        }

        if (this.scrollView.horizontal){
            const offsetX = Math.abs(this.scrollView.content.position.x); // 获取 content 节点的纵向偏移量
            const start = Math.max(0, Math.floor(offsetX / this.ItemSize.width));
            const end = Math.min(start + this.viewCount, this.realItemCount);
            return this._ScrollHorizontal(start, end);
        }
    }

    private _ScrollVertical(start: number, end: number){
        if (this.startIdx == start){
            return 
        }

        if (this.endIdx == end){
            return
        }

        if (start > this.startIdx){ // 往上滑动
            for (let i=this.startIdx; i<start; i++){
                let item = this.useItems.shift();
                item.active = false;
                this.waitItems.push(item)
            }

            for (let j=this.endIdx; j < end; j++){
                let item = this.waitItems.pop();
                this.useItems.push(item);
                item.active = true;
                this.setItemPosition(item, j);
                this.itemUpdateCallback(this, j, item);
            }
        }else{ // 往下移动
            for (let i=this.endIdx; i>end; i--){
                let item = this.useItems.pop();
                item.active = false;
                this.waitItems.push(item)
            }

            let saveItem = [];
            for (let j=start; j < this.startIdx; j++){// 这里是从小往大
                let item = this.waitItems.pop();
                item.active = true;
                saveItem.push(item)
                this.setItemPosition(item, j);
                this.itemUpdateCallback(this, j, item);
            }

            this.useItems = saveItem.concat(this.useItems);
        }

        this.startIdx = start;
        this.endIdx = end;
    }

    private _ScrollHorizontal(start: number, end: number){
        if (this.startIdx == start){
            return 
        }

        if (this.endIdx == end){
            if (start >= this.startIdx){ // 往左拖动，可能会导致新的节点不在包含里面
                return
            }
        }

        if (start > this.startIdx){ // 往左滑动
            for (let i=this.startIdx; i<start; i++){
                let item = this.useItems.shift();
                if (!item){
                   continue;
                }
                
                item.active = false;
                this.waitItems.push(item)
            }

            for (let j=this.endIdx; j < end; j++){
                let item = this.waitItems.pop();
                if (!item){
                    continue;
                }

                this.useItems.push(item);
                item.active = true;
                this.setItemPosition(item, j);
                this.itemUpdateCallback(this, j, item);
            }
        }else{ // 往右移动
            for (let i=this.endIdx; i>end; i--){
                let item = this.useItems.pop();
                if (!item){
                    continue;
                }

                item.active = false;
                this.waitItems.push(item)
            }

            for (let j=start; j < this.startIdx; j++){
                let item = this.waitItems.pop();
                if (!item){
                    continue;
                }

                item.active = true;
                this.useItems.unshift(item);
                this.setItemPosition(item, j);
                this.itemUpdateCallback(this, j, item);
            }
        }

        this.startIdx = start;
        this.endIdx = end;
    }
}