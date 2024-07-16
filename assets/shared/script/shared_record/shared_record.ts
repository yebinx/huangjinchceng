import { _decorator, Button, Component, instantiate, isValid, Node, Prefab, Sprite, tween, Vec3, Widget } from 'cc';
import { Emitter } from '../lib/Emitter';
import { DateEx } from '../lib/DateEx';
import { EventAfter } from '../lib/event_after_callback';
import { EMIT_REQ_GAME_RECORD, EMIT_REQ_GAME_RECORD_RETRY, EMIT_REQ_RECORD_DETAIL, EMIT_REQ_RECORD_DETAIL_RETRY, EMIT_SHOW_GAME_RECORD, EMIT_SHOW_GAME_RECORD_DETAIL, EMIT_SHOW_GAME_RECORD_ERROR, EMIT_VIEW_RESIZE_FLUSH } from '../config/shared_emit_event';
import { SharedRecordDateType } from './shared_record_date_type';
import { SharedRecordCustomDate } from './shared_record_custom_date';
import { SharedRecordRoundDetailList } from './shared_record_round_detail_list';
import { SharedRecordDetailList } from './shared_record_detail_list';
import { SharedAdaptation } from '../shared_adaptation/shared_adaptation';
import { SharedMenuAdaptation } from '../shared_adaptation/shared_menu_adaptation';
import { SharedLoading } from '../shared_loading/shared_loading';
import { IGameRecord } from './shared_record_interface';
import { NodeEx } from '../lib/NodeEx';
import { TweenEx } from '../lib/TweenEx';
const { ccclass, property } = _decorator;

export enum SharedRecordEvent {
    CLOSE_RECORD = "CLOSE_RECORD", // 退出记录查看
    OPEN_RECORD_DATE_TYPE = "OPEN_RECORD_DATE_TYPE", // 打开选择日期
    OPEN_RECORD_CUSTOM_DATE = "OPEN_RECORD_CUSTOM_DATE", // 打开自定义日期
    REQUEST_CUSTOM_DATE_RECORD = "REQUEST_CUSTOM_DATE_RECORD", // 查询自定义记录
    OPEN_RECORD_ROUND_DETAIL_LIST = "OPEN_RECORD_ROUND_DETAIL_LIST", // 打开记录详情
    REQUEST_REMAINING_DATA = "REQUEST_REMAINING_DATA" // 请求剩余数据
}

export enum SelectDateType {
    TODAY, // 今天
    LAST_WEEK, // 最近七天
    CUSTOM // 自定义
}

// 记录入口点，管理

@ccclass('SharedRecord')
export class SharedRecord extends Component {
    @property({type:Node, tooltip:"实际根节点"})
    recordRoot:Node; // 实际根节点

    @property({type:Sprite})
    spBg:Sprite;
    
    @property({type:SharedLoading})
    sharedLoding:SharedLoading; // 加载页面

    @property({type:Node})
    ndRecordShow:Node; // 显示历史记录节点

    @property({type:Node})
    ndRecordDetail:Node; // 显示单条记录详情

    @property({type:Node})
    ndFirstEnterTipsLayer:Node; // 首次进入提示

    @property({type:Prefab})
    messageTips:Prefab; // 错误消息提示

    @property({type:Prefab}) // 历史记录
    recordDetailList:Prefab;

    @property({type:Prefab})
    recordDateType:Prefab; // 选择日期

    @property({type:Prefab})
    recordCustomDate:Prefab; // 自定义日期

    @property({type:Prefab})
    recordRoundDetailList:Prefab; // 记录详情

    @property({type:Prefab})
    sharedRecordFirstTips:Prefab; // 首次进入提示

    private isExitAction: boolean = false;
    private emitter:Emitter;
    private startTimestamp: number = 0; // 搜素开始时间，毫秒
    private endTimestamp: number = 0; // 搜素结束时间，毫秒
    private selectDateType:SelectDateType = SelectDateType.TODAY;
    private currRecordDetailList:SharedRecordDetailList = null;
    private currRecordRoundDetailList:SharedRecordRoundDetailList = null;
    private gameRecord:IGameRecord = null;
    private destroyCallback:()=>void;

    protected onLoad(): void {
        this.sharedLoding.setCloseCallback(this.onBtnClose.bind(this));
        this.sharedLoding.setRetryCallback(this.onCallbackRetry.bind(this));
        this.startTimestamp = DateEx.getTodayZero();
        this.endTimestamp = this.startTimestamp + (3600 * 24 - 1) * 1000;
    }

    start() {
        // this.test()
    }

    protected startAfter(){
        this.spBg.getComponent(Widget).enabled = false;
        this.playEnterAction();
    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);
        
        if (this.destroyCallback){
            this.destroyCallback()
        }
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
        let adaptation = this.sharedLoding.node.getComponent(SharedAdaptation);
        adaptation.setEmitter(emitter);
        adaptation.register();
    }

    setDestroyCallback(destroyCallback: ()=>void){
        this.destroyCallback = destroyCallback;
    }

    register(){
        this.node.on(EventAfter.START_AFTER, this.startAfter, this);
        this.node.on(SharedRecordEvent.CLOSE_RECORD, this.onBtnClose, this);
        this.node.on(SharedRecordEvent.OPEN_RECORD_DATE_TYPE, this.onNodeEventOpenRecordDateType, this);
        this.node.on(SharedRecordEvent.OPEN_RECORD_CUSTOM_DATE, this.onNodeEventOpenRecordCustomDate, this);
        this.node.on(SharedRecordEvent.REQUEST_CUSTOM_DATE_RECORD, this.onNodeEventRequestCustomDateRecord, this);
        this.node.on(SharedRecordEvent.OPEN_RECORD_ROUND_DETAIL_LIST, this.onNodeEventOpenRecordRoundDetailList, this);
        this.node.on(SharedRecordEvent.REQUEST_REMAINING_DATA, this.onNodeEventRequestRemainingData, this);

        this.emitter.addEventListener(EMIT_SHOW_GAME_RECORD, this.onEmitShowHistory, this);
        this.emitter.addEventListener(EMIT_SHOW_GAME_RECORD_DETAIL, this.onEmitShowGameRecordDetail, this);
        this.emitter.addEventListener(EMIT_SHOW_GAME_RECORD_ERROR, this.onEmitRequestError, this);
    }

    setGameRecord(gameRecord: IGameRecord){ this.gameRecord = gameRecord; }

    showLoadingTips(){
        this.sharedLoding.node.active = true;
        this.sharedLoding.showLoading();
    }

    requestDate(offset: number){
        // console.log("startTimestamp " + this.startTimestamp)
        // console.log("endTimestamp " + this.endTimestamp)
        if (offset <= 0) {// 重新请求把旧的列表删除
            if (this.currRecordDetailList != null){
                this.currRecordDetailList.destroySelf();
                this.currRecordDetailList = null;
            }
        }

        this.emitter.emit(EMIT_REQ_GAME_RECORD, this.startTimestamp, this.endTimestamp, offset)
    }

    // 显示首次进入
    showFirstEnterTips(delayTime: number){
        let nd = instantiate(this.sharedRecordFirstTips);
        nd.parent = this.ndFirstEnterTipsLayer;

        let adaptation = nd.getComponent(SharedAdaptation)
        adaptation.setEmitter(this.emitter)
        adaptation.register()

        TweenEx.DelayCall(nd, delayTime, ()=>{
            TweenEx.FadeOutOpacity(nd, 0.6, null, ()=>{
                nd.destroy();
            }).start();
        })
    }

    private playEnterAction(){
        // Audio.i.playOpenMenu();
        this.spBg.node.position = new Vec3(0, -2500, 0);
        tween(this.spBg.node)
        .to(0.4, {position: new Vec3(0, 0, 0)})
        .call(()=>{
            this.spBg.getComponent(Widget).enabled = true;
            this.requestDate(0);
            // this.ndRoot.active = true;
            // Action.grayLayerFadeIn(this.ndRoot.getComponent(Sprite))
        })
        .start()
    }

    private playExitAction(){
        if (this.isExitAction){
            return 
        }
        this.isExitAction = true;
        // Audio.i.playCloseMenu();

        tween(this.spBg.node)
        .to(0.4, {position: new Vec3(0, -3500, 0)})
        .call(()=>{
            if (this.recordRoot){
                this.recordRoot.destroy()
            }else{
                this.node.destroy();
            }
        })
        .start()
    }


    private hideLoadingTips(){
        this.sharedLoding.node.active = false;
    }

    private onCallbackRetry(){
        if (!isValid(this.currRecordRoundDetailList)){ // 请求记录列表
            this.showLoadingTips();
            this.emitter.emit(EMIT_REQ_GAME_RECORD_RETRY);
            return 
        }

        this.currRecordRoundDetailList.showLoading();
        this.emitter.emit(EMIT_REQ_RECORD_DETAIL_RETRY);
    }

    // 显示错误信息
    private onEmitRequestError(errorMsg: string, isDetail: boolean, roundNo: string){
        if (!isDetail){
            if (isValid(this.currRecordDetailList)){
                this.currRecordDetailList.node.active = false;
            }
            this.ndRecordDetail.removeAllChildren();

            this.sharedLoding.node.active = true;
            this.sharedLoding.showErrorMessage(errorMsg);
            return;
        }

        if (!isValid(this.currRecordRoundDetailList)){
            return 
        }

        this.currRecordRoundDetailList.showRequestError(errorMsg, roundNo);
    }

    // 显示历史记录
    private onEmitShowHistory(offset: number, startTimestamp: number, endTimestamp: number){
        this.hideLoadingTips();
        if (!isValid(this.currRecordDetailList)){
            let nd = instantiate(this.recordDetailList);
            nd.parent = this.ndRecordShow;
            this.currRecordDetailList = nd.getComponent(SharedRecordDetailList);
            this.currRecordDetailList.setGameRecord(this.gameRecord);
            this.menuAdaptation(nd);
        }

        this.currRecordDetailList.node.active = true;

        this.scheduleOnce(()=>{
            if (offset <= 0){
                this.currRecordDetailList.setData(this.node, startTimestamp, endTimestamp, this.selectDateType);
            }else{
                this.currRecordDetailList.setRemainingData(offset);
            }
            this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
        }, 0)
    }

    // 显示记录详情
    private onEmitShowGameRecordDetail(roundId: string){
        if (!isValid(this.currRecordRoundDetailList)){
            return 
        }

        this.currRecordRoundDetailList.setData(roundId);
    }

    // 
    private menuAdaptation(node:Node){
        let menuAdaptation = node.getComponent(SharedMenuAdaptation)
        menuAdaptation.setEmitter(this.emitter)
        menuAdaptation.register()
        this.emitter.emit(EMIT_VIEW_RESIZE_FLUSH);
    }

    private onBtnClose(){
        this.playExitAction();
    }

    // 打开日期选择
    private onNodeEventOpenRecordDateType(){
        let nd = instantiate(this.recordDateType);
        let recordDateType = nd.getComponent(SharedRecordDateType);
        recordDateType.setDate(this.node, this.selectDateType);
        nd.parent = this.ndRecordShow;
        this.menuAdaptation(nd);
    }

    // 打开自定义日期
    private onNodeEventOpenRecordCustomDate(){
        let nd = instantiate(this.recordCustomDate);
        nd.parent = this.ndRecordShow;
        let recordCustomDate = nd.getComponent(SharedRecordCustomDate)
        recordCustomDate.setDate(this.node)

        this.menuAdaptation(nd);
    }

    // 自定义日期查询
    private onNodeEventRequestCustomDateRecord(startTimestamp: number, endTimestamp: number, selectDateType:SelectDateType){
        this.startTimestamp = startTimestamp;
        this.endTimestamp = endTimestamp;
        this.selectDateType = selectDateType;
        this.ndRecordShow.removeAllChildren();
        this.ndRecordDetail.removeAllChildren();
        this.showLoadingTips();
        this.requestDate(0);
    }

    // 打开记录详情
    private onNodeEventOpenRecordRoundDetailList(orderId:string){
        // this.showLoadingTips()
        let nd = instantiate(this.recordRoundDetailList);
        nd.parent = this.ndRecordDetail;

        let recordRoundDetailList = nd.getComponent(SharedRecordRoundDetailList);
        recordRoundDetailList.setCloseCallback(()=>{
            // this.ndRecordShow.active = true;// 把记录列表显示出来
        })

        recordRoundDetailList.setExitCallback(()=>{
            this.ndRecordShow.active = true;// 把记录列表显示出来
        })

        recordRoundDetailList.setRetryCallback(this.onCallbackRetry.bind(this));
        recordRoundDetailList.setEmitter(this.emitter);
        recordRoundDetailList.setGameRecord(this.gameRecord);
        recordRoundDetailList.setOrderId(orderId);

        let adaptation = recordRoundDetailList.sharedLoding.getComponent(SharedAdaptation)
        adaptation.setEmitter(this.emitter)
        adaptation.register()
        
        this.menuAdaptation(nd);

        recordRoundDetailList.playEnter(()=>{
            this.ndRecordShow.active = false;
            this.emitter.emit(EMIT_REQ_RECORD_DETAIL, orderId);
        })
        
        this.currRecordRoundDetailList = recordRoundDetailList;
    }

    // 请求剩余数据
    private onNodeEventRequestRemainingData(offset:number){
        this.requestDate(offset)
    }



//     test(){
//         let list = [
//             {
//  /** 创建时间-时间戳-毫秒 */
//  create_timestamp: 1690300800000,
//  /** 交易单号-mongodb-obj-id */
//  order_id: "2-1690439980-FA927A10E83F4ADD824",
//  /** 牌局信息 */
//  round_no: "round_no",
//  /** 下注的额度 */
//  bet: 1000,
//  /** 盈利 */
//  win: -30001,
//  free_times:10,

//             } as TCsll2RecordInfo,
//         ]


//         let rep = {
//              /** 游戏记录 */
//   list: list,
//   /** 数量 */
//   count: 1,
//   /** 总下注 */
//   bet: 10050,
//   /** 总盈利 */
//   win: 454541,
//   /** 用来查询的ID */
//   id: 1,
//         } as TCsll2RecordListRsp
//         this.onEmitShowHistory(rep)
//     }
}


