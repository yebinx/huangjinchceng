import { _decorator, Component, EventTouch, instantiate, Label, Layout, Node, NodeEventType, Prefab, ScrollView, Vec3 } from 'cc';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { NodeEx } from '../lib/NodeEx';
import { TouchEventEx } from '../lib/TouchEventEx';
import { SharedConfig } from '../config/shared_config';
import { SharedRecordWinLineDetail } from './shared_record_win_line_detail';
import { SharedRecordWinLineScatter } from './shared_recprd_win_line_scatter';
import { SharedRecordWinLineInfo } from './shared_record_win_line_info';
import { IRecordDetail, IRocordLineInfo } from './shared_record_interface';
import { Emitter } from '../lib/Emitter';
const { ccclass, property } = _decorator;

// 每轮结果

@ccclass('SharedRecordRoundDetail')
export class SharedRecordRoundDetail extends Component {
    @property({type:Label})
    lbOrder:Label // 订单

    @property({type:Label})
    lbBet:Label // 投注值

    @property({type:Label})
    lbWin:Label // 盈利值

    @property({type:Label})
    lbBalance:Label // 余额值

    @property({type:Label})
    lbBetFont:Label // 投注

    @property({type:Label})
    lbWinFont:Label // 盈利

    @property({type:Label})
    lbBalanceFont:Label // 余额

    @property({type:Label})
    lbRound:Label // 第n回合

    @property({type:Label})
    lbDetailBet:Label // 投注

    @property({type:Label})
    lbMultiple:Label // 投注倍数

    @property({type:Label})
    lbRewardMultiple:Label // 奖金乘数

    @property({type:Label})
    lbNotRewardTips:Label // 无中奖组合

    @property({type:Node})
    ndWinLineInfo:Node // 中奖线路图层

    @property({type:Layout})
    ndTitleContent:Layout; // 标题

    @property({type:ScrollView})
    svRoundList:ScrollView;
    
    @property({type:Layout})
    ndSymbolResultContent:Layout; // 开奖结果
    
    @property({type:Layout})
    ndExtra:Layout // 额外的拓展

    @property({type:Layout})
    ndWinLineContent:Layout // 存放中奖线路

    @property({type:Prefab})
    recordWinLineDetail:Prefab; // 中奖线路

    @property({type:Prefab})
    recordWinLineScatter:Prefab; // 中奖scatter

    @property({type:Prefab})
    RecordWinLineInfo:Prefab; // 中奖路线详情

    private emitter:Emitter;
    private currentRecordWinLineInfo:Node = null;
    private currentRecordWinLineDetail:SharedRecordWinLineDetail = null;

    onLoad() {
        this.svRoundList.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.lbDetailBet.string = `${l10n.t("shared_setting_bet_base")} ${SharedConfig.ScoreFormat(0)}`;
        this.lbMultiple.string =  `${l10n.t("shared_setting_bet_multiple")} ${0}`;

        this.lbBetFont.string = `${l10n.t("shared_record_bet")}( ${l10n.t("shared_money_symbol")} )`
        this.lbWinFont.string = `${l10n.t("shared_record_win")}( ${l10n.t("shared_money_symbol")} )`
        this.lbBalanceFont.string = `${l10n.t("shared_record_balance")}( ${l10n.t("shared_money_symbol")} )`
    }

    setEmitter(emitter:Emitter){this.emitter = emitter;}

    setData(data:IRecordDetail, dataIdx: number) {
        this.reset();
     
        this.lbRound.string = l10n.t("shared_round_count").replace("{1}", `${data.round}`);
        this.lbDetailBet.string = `${l10n.t("shared_setting_bet_base")} ${SharedConfig.ScoreFormat(data.betSize)}`;
        this.lbMultiple.string =  `${l10n.t("shared_setting_bet_multiple")} ${data.betMultiple}`;

        this.lbOrder.string = `${data.roundId}`;
        this.lbBet.string = `${SharedConfig.ScoreFormat(data.bet)}`;
        this.lbWin.string = `${SharedConfig.ScoreFormat(data.win)}`;
        this.lbBalance.string = `${SharedConfig.ScoreFormat(data.balance)}`;

        this.ndTitleContent.updateLayout(true);
        
        this.lbRewardMultiple.string = `${l10n.t("shared_record_reward_multiple")} x${data.rewardMultiple}`
        this.lbNotRewardTips.node.active = (data.lineInfoList.length <= 0); 

        // 外接
        this.emitter.emit("SharedRecordRoundDetail", this.ndSymbolResultContent.node, data, this.ndExtra.node, this.ndWinLineContent.node);
        this.ndSymbolResultContent.updateLayout();

        if (data.lineInfoList.length == 0){
            return 
        }

        if (data.lineInfoList.length == 1 && data.lineInfoList[0].isScatter){// 处理scatter
            this.addRecordWinLineScatter(data.lineInfoList[0]);
            this.lbNotRewardTips.node.active = true; 
            return 
        }

        for (let i=0, len=data.lineInfoList.length; i<len; i++){
            this.addRecordWinLineDetail(data.lineInfoList[i]);
        }
    }

    private reset(){
        this.lbNotRewardTips.node.active = true;
        this.ndWinLineContent.node.removeAllChildren();
        this.ndExtra.node.removeAllChildren();
        this.removeRecordWinLineInfo();
        this.svRoundList.scrollToTop(null);
    }

    // 正常图标中奖线路
    private addRecordWinLineDetail(data: IRocordLineInfo){
        let nd = instantiate(this.recordWinLineDetail);
        nd.parent = this.ndWinLineContent.node;
        let recordWinLineDetail = nd.getComponent(SharedRecordWinLineDetail);
        recordWinLineDetail.setEmitter(this.emitter);
        recordWinLineDetail.setData(data);
        recordWinLineDetail.setClickCallback(this.onTouchWinLineDetail.bind(this));
    }

    // scatter 中奖线路
    private addRecordWinLineScatter(data: IRocordLineInfo){
        let nd = instantiate(this.recordWinLineScatter);
        nd.parent = this.ndWinLineContent.node;
        let recordWinLineScatter = nd.getComponent(SharedRecordWinLineScatter);
        recordWinLineScatter.setEmitter(this.emitter);
        recordWinLineScatter.setData(data);
    }

    private onTouchWinLineDetail(recordWinLineDetail:SharedRecordWinLineDetail, recordLineInfo:IRocordLineInfo, isTouchMove: boolean){
        if (this.removeRecordWinLineInfo()){// 再次点击则关闭
            if (this.currentRecordWinLineDetail != null && this.currentRecordWinLineDetail == recordWinLineDetail) {
                this.currentRecordWinLineDetail = null;
                return;
            }
        }

        if (isTouchMove){
            return 
        }

        // 显示中奖线路详情
        let worldPos = NodeEx.getWorldPosition(recordWinLineDetail.node, new Vec3(0, NodeEx.getSize(recordWinLineDetail.node).height / -2))
        let nd = instantiate(this.RecordWinLineInfo);
        nd.parent = this.ndWinLineInfo;
        nd.position = NodeEx.getLocalPosition(this.ndWinLineInfo, worldPos)

        let recordWinLineInfo = nd.getComponent(SharedRecordWinLineInfo)
        recordWinLineInfo.setData(recordLineInfo);

        this.currentRecordWinLineInfo = nd;
        this.currentRecordWinLineDetail = recordWinLineDetail;
    }

    private removeRecordWinLineInfo(){
        if (this.currentRecordWinLineInfo){
            this.currentRecordWinLineInfo.destroy();
            this.currentRecordWinLineInfo = null;
            return true
        }
        return false
    }
    
    private onTouchEnd(event:EventTouch){
        if (TouchEventEx.isTouchMove(event)){
            return
        }
        
        this.removeRecordWinLineInfo();
    }
}


