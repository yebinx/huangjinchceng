import { _decorator, Button, Component, EventMouse, EventTouch, instantiate, Label,  Node, NodeEventType, Prefab, ScrollView } from 'cc';
import ScrollViewInfinite from '../lib/scrollview/scroll_view_infinite';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { ScrollViewEx } from '../lib/scrollview/ScrollviewEx';
import { DateEx } from '../lib/DateEx';
import { NodeEx } from '../lib/NodeEx';
import { SharedConfig } from '../config/shared_config';
import { SelectDateType, SharedRecordEvent } from './shared_record';
import { SharedRecordSimpleInfo } from './shared_record_simple_info';
import { SharedLoadingTips } from '../shared_loading/shared_loading_tips';
import { IGameRecord } from './shared_record_interface';
const { ccclass, property } = _decorator;

// 记录简介列表
@ccclass('SharedRecordDetailList')
export class SharedRecordDetailList extends Component {
    @property({type:Label})
    lbDate:Label // 日期

    @property({type:Button})
    btnDate:Button; // 日历

    @property({type:Label})
    lbNotRecordTips:Label // 没有历史记录

    @property({type:ScrollView})
    svContent:ScrollView; 

    @property({type:Label})
    lbBet:Label // 投注()

    @property({type:Label})
    lbWin:Label // 投注()

    @property({type:Label})
    lbTotalRecord:Label // 总条记录

    @property({type:Label})
    lbTotalBet:Label; // 总下注

    @property({type:Label})
    lbTotalWin:Label; // 总赢

    @property({type:Label})
    lbBottomTime:Label; // 底部时间

    @property({type:Prefab})
    recordSimpleInfo:Prefab; // 单条记录

    @property({type:Prefab})
    loadingTips:Prefab; // 提示

    private record: Node = null;
    private currLoadingTips:SharedLoadingTips = null;
    private requestData: boolean = false; // 是否在请求剩余数据
    private scrollViewInfinite:ScrollViewInfinite = null; // 无线滚动
    private gameRecord:IGameRecord = null;

    protected onLoad(): void {
        this.lbNotRecordTips.node.active = false;
        this.lbBet.string = `${l10n.t("shared_record_bet")}(${l10n.t("shared_money_symbol")})`;
        this.lbWin.string = `${l10n.t("shared_record_win")}(${l10n.t("shared_money_symbol")})`;

        let scrollviewInfinite = ScrollViewEx.replaceScrollViewInfinite(this.svContent, this.recordSimpleInfo);
        scrollviewInfinite.setItemCreateCallback(this.onScorllViewCreateItem.bind(this));
        scrollviewInfinite.setItemUpdateCallback(this.onScorllViewUpdateItem.bind(this));
        this.scrollViewInfinite = scrollviewInfinite;
    }

    protected start(): void {
        this.svContent.node.on(ScrollView.EventType.BOUNCE_BOTTOM, this.onScrollBounceBottom, this);
        this.svContent.node.on(NodeEventType.TOUCH_START, this.onScrollTouchStart, this, true);
        this.svContent.node.on(NodeEventType.MOUSE_ENTER, this.onEventMouseEnter, this, true);
        this.svContent.node.on(NodeEventType.MOUSE_LEAVE, this.onEventMouseLevel, this, true);
    }

    setGameRecord(gameRecord: IGameRecord){ this.gameRecord = gameRecord; }
    
    setData(record:Node, startTimestamp: number, endTimestamp: number, selectDateType:number) {
        this.record = record;
        this.setDate(startTimestamp, endTimestamp, selectDateType);

        let recordProfileSummary = this.gameRecord.getRecordProfileSummary();
        this.lbTotalRecord.string = l10n.t("shared_record_total_record_n").replace("{1}", String(recordProfileSummary.profileTotalLenght)) ;
        this.lbTotalBet.string = `(${l10n.t("shared_money_symbol")})${SharedConfig.ScoreFormat(recordProfileSummary.betTotal)}`;
        this.lbTotalWin.string = `(${l10n.t("shared_money_symbol")})${SharedConfig.ScoreFormat(recordProfileSummary.winTotal)}`;

        if (this.gameRecord.getRecordProfileTotalLenght() <= 0){
            this.lbNotRecordTips.node.active = true;
            this.svContent.verticalScrollBar.node.active = false;
            return 
        }

        this.svContent.verticalScrollBar.node.active = true;
        this.scrollViewInfinite.initialize(this.gameRecord.getRecordProfileLenght());
    }

    // 更新剩余的数据
    setRemainingData(offset: number){
        this.requestData = false;
        this.svContent.enabled = true;
        this.btnDate.interactable = true;
        this.currLoadingTips.destroySelf();
        this.currLoadingTips = null;

        this.scrollViewInfinite.removeLoading();
        this.scrollViewInfinite.appendItems(this.gameRecord.getRecordProfileLenght() - offset);
    }

    destroySelf(){
        this.node.destroy();
    }

    private setDate(startTimestamp: number, endTimestamp: number, selectDateType:number){
        let today = DateEx.getTodayZero();
        if (today == startTimestamp && selectDateType == SelectDateType.TODAY){
            this.lbDate.string = l10n.t("shared_record_date_today")
            this.lbBottomTime.string = this.lbDate.string;
            return 
        }

        let lastWeekStart = today - (3600*24*1000*6)
        if (lastWeekStart == startTimestamp && selectDateType == SelectDateType.LAST_WEEK){
            let isWeek = Math.ceil((endTimestamp - startTimestamp) / (3600*24*1000)) >= 7;
            if (isWeek){
                this.lbDate.string = l10n.t("shared_record_date_last_week")
                this.lbBottomTime.string = this.lbDate.string;
                return 
            }
        }

        let startDate = new Date(startTimestamp);
        let endDate = new Date(endTimestamp);

        let dateRange = l10n.t("shared_record_date_range");
        dateRange = dateRange.replace("{1}", String(startDate.getFullYear()))
                            .replace("{2}", String(startDate.getMonth()+1))
                            .replace("{3}", String(startDate.getDate()))

                            .replace("{4}", String(endDate.getFullYear()))
                            .replace("{5}", String(endDate.getMonth()+1))
                            .replace("{6}", String(endDate.getDate()))

        this.lbDate.string = dateRange;
        this.lbBottomTime.string = this.lbDate.string;
    }

    private onCallbackClickRound(roundNo: string){
        this.record.emit(SharedRecordEvent.OPEN_RECORD_ROUND_DETAIL_LIST, roundNo);
    }

    // 关闭
    private onBtnClose(){
        this.node.destroy();
        this.record.emit(SharedRecordEvent.CLOSE_RECORD);
    }

    // 打开日期
    private onBtnDate(){
        this.record.emit(SharedRecordEvent.OPEN_RECORD_DATE_TYPE);
    }
 
    // 监听滚动到最低反弹
    private onScrollBounceBottom(sv:ScrollView){
        if (this.gameRecord.getRecordProfileTotalLenght() <= this.scrollViewInfinite.getRealItemCount()){
            return 
        }

        this.requestData = true;

        // 除了可以退出，其他按钮都不能点
        sv.scrollToBottom();
        sv.enabled = false;
        this.btnDate.interactable = false;

        let nd = instantiate(this.loadingTips);
        this.scrollViewInfinite.appendLoading(nd, NodeEx.getSize(nd).height / -2);
        this.currLoadingTips = nd.getComponent(SharedLoadingTips); // 加载loading

        this.record.emit(SharedRecordEvent.REQUEST_REMAINING_DATA, this.scrollViewInfinite.getRealItemCount());
    }

   //
   private onScrollTouchStart(event:EventTouch){
        if (!this.requestData){
            return 
        }

        event.propagationStopped = true;
   }

    private onScorllViewCreateItem(sv:ScrollViewInfinite, index: number, node:Node){
        let recordSimpleInfo = node.getComponent(SharedRecordSimpleInfo);
        recordSimpleInfo.setClickCallback(this.onCallbackClickRound.bind(this));
    }

    private onScorllViewUpdateItem(sv:ScrollViewInfinite, index: number, node:Node){
        let data = this.gameRecord.getRecordProfileData(index)
        if (!data){
            return 
        }

        let recordSimpleInfo = node.getComponent(SharedRecordSimpleInfo);
        recordSimpleInfo.setData(data, index);
    }

    
    private onEventMouseEnter(event: EventMouse){
        this.svContent.verticalScrollBar.enableAutoHide = false;
        this.svContent.verticalScrollBar.show();
    }

    private onEventMouseLevel(event: EventMouse){
        this.svContent.verticalScrollBar.enableAutoHide = true;
    }
}


