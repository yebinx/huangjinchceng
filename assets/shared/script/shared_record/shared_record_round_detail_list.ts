import { _decorator, Button, Component, EventTouch, game, instantiate, isValid, Label, Layout, Node, NodeEventType, Prefab, ScrollView, Size, Sprite, tween, Vec3, Widget } from 'cc';
import ScrollViewInfinite from '../lib/scrollview/scroll_view_infinite';
import { PageViewEx } from '../lib/scrollview/pageview';
import { ButtonEx } from '../lib/button/ButtonEx';
import { NodeEx } from '../lib/NodeEx';
import { PromiseEx } from '../lib/PromiseEx';
import { StringEx } from '../lib/StringEx';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { SharedRecordRoundTitleList } from './shared_record_round_title_list';
import { SharedRecordRoundDetail } from './shared_record_round_detail';
import { SharedLoading } from '../shared_loading/shared_loading';
import { IGameRecord, NORMAL_SPIN_INDEX } from './shared_record_interface';
import { Emitter } from '../lib/Emitter';
const { ccclass, property } = _decorator;

// 局详情列表

@ccclass('SharedRecordRoundDetailList')
export class SharedRecordRoundDetailList extends Component {
    @property({type:Node})
    ndRoot:Node 

    @property({type:Sprite})
    spBg:Sprite;

    @property({type:Node})
    ndStopTouch:Node; // 停止点击，退出的时候拦截点击事件

    @property({type:SharedLoading})
    sharedLoding:SharedLoading; // 加载页面

    @property({type:Label})
    lbTitle:Label // 标题

    @property({type:Label})
    lbTime:Label // 日期

    @property({type:ScrollView})
    svRoundList:ScrollView;

    @property({type:Button})
    btnPrev:Button // 上一页

    @property({type:Button})
    btnNext:Button // 下一页

    @property({type:Button})
    btnSelectRoundNo:Button // 选择订单

    @property({type:Button})
    btnCloseRoundNo:Button // 关闭订单

    @property({type:Node})
    ndRecordRoundTitleLayer:Node // 选择记录层

    @property({type:ScrollViewInfinite})
    scrollViewInfinite:ScrollViewInfinite;// 无限滚动复用节点

    @property({type:PageViewEx})
    pageViewEx:PageViewEx; // 滑动翻页

    @property({type:Prefab})
    recordRoundTitleList:Prefab;

    @property({type:Prefab})
    recordRoundDetail:Prefab // round详情

    private currentRecordRoundTitleList:SharedRecordRoundTitleList = null;
    private emitter:Emitter;
    private requestOrderId:string; // 请求的id，避免请求后关闭，又请求其他页面
    private currentSpinIndex: number = NORMAL_SPIN_INDEX; // 当前查看的是第几次旋转
    private isExit: boolean = false; // 是否在退出，避免多次点击
    private gameRecord:IGameRecord = null;
    private exitCallback:Function = null;
    private closeCallback:()=>void = null;

    protected onLoad(): void {
        this.ndStopTouch.active = false;
        this.pageViewEx.listenerIdxChange(this.onCallbackPageViewChangeIdx.bind(this));
        this.pageViewEx.listenerSlideOutCallback(this.onCallbackPageViewSlideOut.bind(this));
        this.scrollViewInfinite.setItemCreateCallback(this.onScorllViewCreateItem.bind(this));
        this.scrollViewInfinite.setItemUpdateCallback(this.onScorllViewUpdateItem.bind(this));

        ButtonEx.replaceButtonOpacity(this.btnPrev, 0.5, false);
        ButtonEx.replaceButtonOpacity(this.btnNext, 0.5, false);
        this.btnPrev.node.active = false;
        this.btnNext.node.active = false;

        this.btnSelectRoundNo = ButtonEx.replaceColorButton(this.btnSelectRoundNo);
        this.btnCloseRoundNo = ButtonEx.replaceColorButton(this.btnCloseRoundNo);
        this.btnSelectRoundNo.node.active = false;
        this.btnCloseRoundNo.node.active = false;

        this.spBg.getComponent(Widget).enabled = false;

        this.sharedLoding.setCloseCallback(this.playExit.bind(this));
        this.sharedLoding.node.active = true;
    }

    protected start(): void {
        
    }

    setEmitter(emitter:Emitter){this.emitter = emitter;}
    setOrderId(orderId:string){ this.requestOrderId = orderId;}
    setExitCallback(cb:()=>void) { this.exitCallback = cb; }
    setGameRecord(gameRecord: IGameRecord){ this.gameRecord = gameRecord; }
    setRetryCallback(cb:Function) {
        this.sharedLoding.setRetryCallback(cb);
    }
    
    showRequestError(errorMsg: string, roundNo: string){
        if (this.requestOrderId != roundNo){
            return 
        }

        this.sharedLoding.showErrorMessage(errorMsg);
    }

    showLoading(){
        this.sharedLoding.showLoading();
    }

    playEnter(finishCallback: Function) {
        this.ndRoot.active = false;

        let pos = this.spBg.node.position;
        NodeEx.setPosition(this.spBg.node, 1000, null);

        tween(this.spBg.node)        
        .to(0.2, {position: new Vec3(0, pos.y, pos.z)})
        .call(()=>{
            this.spBg.getComponent(Widget).enabled = true;
            if (finishCallback){
                finishCallback();
            }
        })
        .start();
    }

    playExit(){
        if (this.isExit){
            return;
        }
        this.ndStopTouch.active = true;
        this.isExit = true;

        let pos = this.spBg.node.position;
        tween(this.spBg.node)        
        .call(()=>{
            if (this.exitCallback){
                this.exitCallback();
            }
        })
        .to(0.2, {position: new Vec3(1000, pos.y, pos.z)})
        .call(()=>{
            this.destroySelf()
        })
        .start();
    }

    async setData(orderId: string){
        if (this.requestOrderId != orderId){
            return 
        }

        this.sharedLoding.node.active = false;
        this.ndRoot.active = true;

        this.btnSelectRoundNo.node.active =  this.gameRecord.getRecordDetaiFreeTimes(this.requestOrderId) > 1;
        this.onChangeSpinInfo(NORMAL_SPIN_INDEX, this.gameRecord.getRecordDetailSpinTotalCount(this.requestOrderId));
        this.loadRoundDetailInfo();
    }

    private destroySelf(){
        this.node.destroy();
        if (this.closeCallback){
            this.closeCallback();
        }
    }

    // 加载详情列表，异步
    private async loadRoundDetailInfo(){
        await PromiseEx.CallDelayOnly(0);
        if (!isValid(this)){
            return 
        }

        let count = this.gameRecord.getRecordDetailRoundTotalCount(this.requestOrderId);
        this.scrollViewInfinite.initialize(count);

        this.pageViewEx.flush(count);
        this.pageViewEx.dispatchEvent();
    }

    setCloseCallback(callback: ()=>void) {
        this.closeCallback = callback;
    }

    // 切换轮次
    private onChangeSpinInfo(spinIndex: number, totalSpin: number){
        let createTime = this.gameRecord.getRecordDetailCreateTime(this.requestOrderId, spinIndex);
        let date = new Date(createTime)
        let strTime = l10n.t("shared_record_round_date")
        strTime = strTime.replace("{1}", String(date.getFullYear()))
        .replace("{2}", StringEx.padStart(String(date.getMonth() + 1), 2, "0"))
        .replace("{3}", StringEx.padStart(String(date.getDate()), 2, "0"))
        .replace("{4}", StringEx.padStart(String(date.getHours()), 2, "0"))
        .replace("{5}", StringEx.padStart(String(date.getMinutes()), 2, "0"))

        this.lbTime.string = `${strTime}`
        if (spinIndex == NORMAL_SPIN_INDEX){ // 第一局一定是正常局，后面全部是免费
            this.lbTitle.string = l10n.t("shared_record_normal_play"); // 普通旋转
        }else{
            let roundName = l10n.t("shared_record_free_play")   // 免费旋转n/n
            .replace("{1}", `${spinIndex}`)
            .replace("{2}", `${totalSpin-1}`);
            this.lbTitle.string = roundName
        }
    }

    // 更新左右箭头
    private updatePrevAndNext(selectPage: number, totalPage:number){
        this.btnPrev.node.active = selectPage > 0;
        this.btnNext.node.active = selectPage + 1 < totalPage;
    }

    // 切换页面回调
    private onCallbackPageViewChangeIdx(selectPage: number, totalPage:number){
        this.updatePrevAndNext(selectPage, totalPage);

        let spinIndex = this.gameRecord.getRecordDetailSpinIndex(this.requestOrderId, selectPage);
        if (this.currentSpinIndex == spinIndex){
            return 
        }

        this.currentSpinIndex = spinIndex;
        this.onChangeSpinInfo(spinIndex, this.gameRecord.getRecordDetailSpinTotalCount(this.requestOrderId));
    }

    // 往右边划着退出
    private onCallbackPageViewSlideOut(){
        this.playExit()
    }

    // 选择roundno
    private onCallbackSelectRoundNo(selectSpinIndex: number){
        if (this.currentSpinIndex == selectSpinIndex){
            return;
        }

        let totalDetailPage = this.gameRecord.getRecordDetailSpinOffsetCount(this.requestOrderId, selectSpinIndex);
        this.scrollViewInfinite.scrollToEx(totalDetailPage);
        this.pageViewEx.scrollToEx(totalDetailPage, 0);
    }

    // 打开round 详情选择
    private onBtnOpenRecordRoundTitleList(){
        this.btnSelectRoundNo.node.active = false;
        this.btnCloseRoundNo.node.active = true;

        this.btnPrev.node.active = false;
        this.btnNext.node.active = false;

        if (isValid(this.currentRecordRoundTitleList)){
            return 
        }

        let nd = instantiate(this.recordRoundTitleList);
        nd.parent = this.ndRecordRoundTitleLayer;
        this.currentRecordRoundTitleList = nd.getComponent(SharedRecordRoundTitleList);
        this.currentRecordRoundTitleList.setExitCallback(()=>{
            this.btnSelectRoundNo.node.active = true;
            this.btnCloseRoundNo.node.active = false;
            this.updatePrevAndNext(this.pageViewEx.getCurrentIdx(), this.pageViewEx.getTotalIdx());
        });

        this.currentRecordRoundTitleList.setSelectRoundNoCallback(this.onCallbackSelectRoundNo.bind(this));

        this.currentRecordRoundTitleList.setData(this.requestOrderId, this.gameRecord, this.currentSpinIndex);
        this.currentRecordRoundTitleList.playEnter();
    }

    // 关闭round 详情
    private onBtnCloseRecordRoundTitleList(){
        if (this.currentRecordRoundTitleList != null){
            this.currentRecordRoundTitleList.playExit();
            this.currentRecordRoundTitleList = null;
        }
    }

    private onBtnBack() {
        this.playExit();
    }

    private onBtnPrevPage(){
        this.pageViewEx.prevPage();
    }

    private onBtnNextPage(){
        this.pageViewEx.nextPage();
    }
    
    private onScorllViewCreateItem(sv:ScrollViewInfinite, index: number, node:Node){
        let recordSimpleInfo = node.getComponent(SharedRecordRoundDetail);
        recordSimpleInfo.setEmitter(this.emitter);
    }

   private onScorllViewUpdateItem(sv:ScrollViewInfinite, index: number, node:Node){
        let data = this.gameRecord.getRecordDetailData(this.requestOrderId, index);
        if (data == null){
            return;
        }
        let recordRoundDetail = node.getComponent(SharedRecordRoundDetail);
        recordRoundDetail.setData(data, index);
   }
}


