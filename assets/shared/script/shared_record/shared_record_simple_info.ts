import { _decorator, Button, Component, EventMouse, instantiate, Label, Node, Prefab, SpriteFrame } from 'cc';
import { ButtonEx } from '../lib/button/ButtonEx';
import { StringEx } from '../lib/StringEx';
import { SharedConfig } from '../config/shared_config';
import { SharedRecordFreeRemoveTimes } from './shared_record_free_remive_times';
import { IRecordProfile } from './shared_record_interface';
const { ccclass, property } = _decorator;

// 单条简介记录
@ccclass('SharedRecordSimpleInfo')
export class SharedRecordSimpleInfo extends Component {
    @property({type:Button})
    recordSimpleInfo:Button;

    @property({type:SpriteFrame})
    normalSprite:SpriteFrame;

    @property({type:SpriteFrame})
    emptySprite:SpriteFrame; // 和底板同色

    @property({type:Label})
    lbTime:Label; // 时间

    @property({type:Label})
    lbOrder:Label; // 订单

    @property({type:Label})
    lbBet:Label; // 下注

    @property({type:Label})
    lbWin:Label; // 赢

    @property({type:Node})
    recordFreeRemoveItemsLayer:Node;

    @property({type:Prefab})
    recordFreeRemoveItems:Prefab // 显示轮次

    private currentRecordFreeRemoveTimes:SharedRecordFreeRemoveTimes = null;
    private recordInfo:IRecordProfile;
    private clickCallback:(orderId: string)=>void

    setClickCallback(callback:(orderId: string)=>void){
        this.clickCallback = callback;
    }

    setData(recordInfo: IRecordProfile, index: number){
        this.recordInfo = recordInfo;
        this.recordSimpleInfo.normalSprite = index % 2 == 0 ? this.emptySprite : this.normalSprite;
        
        let date = new Date(recordInfo.createTime)
        const hours = StringEx.padStart(String(date.getHours()), 2, "0");
        const minutes =  StringEx.padStart(String(date.getMinutes()), 2, "0");
        const seconds =  StringEx.padStart(String(date.getSeconds()), 2, "0");

        this.lbTime.string = `${hours}:${minutes}:${seconds}\n${date.getMonth()+1}/${date.getDate()}`
        this.lbOrder.string = recordInfo.orderId;
        this.lbBet.string =  SharedConfig.ScoreFormat(recordInfo.bet);
        this.lbWin.string =  SharedConfig.ScoreFormat(recordInfo.win);

        this.showFreeRemoveTimes(recordInfo);
    }

    // 显示下方免费和轮次
    private showFreeRemoveTimes(recordInfo: IRecordProfile){
        if (recordInfo.freeTimes == 0 && recordInfo.removeNormalRound == 0){
            if (this.currentRecordFreeRemoveTimes){
                this.currentRecordFreeRemoveTimes.node.active = false;
            }
            return 
        }

        if (!this.currentRecordFreeRemoveTimes){
            let nd = instantiate(this.recordFreeRemoveItems)
            nd.parent = this.recordFreeRemoveItemsLayer;
            this.currentRecordFreeRemoveTimes = nd.getComponent(SharedRecordFreeRemoveTimes);
        }

        this.currentRecordFreeRemoveTimes.setData(recordInfo.freeTimes, recordInfo.removeNormalRound, recordInfo.removeFreeRound);
        this.currentRecordFreeRemoveTimes.node.active = true;
    }

    private onBtnClick(){
        if (this.clickCallback){
            this.clickCallback(this.recordInfo.orderId);
        }
    }
}


