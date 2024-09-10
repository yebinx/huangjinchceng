import { _decorator, Color, Component, instantiate, isValid, Node, Prefab, ScrollView, Sprite, tween, Vec3, Widget } from 'cc';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { NodeEx } from '../lib/NodeEx';
import { PromiseEx } from '../lib/PromiseEx';
import { Action } from '../action';
import { SharedRecordRoundTitle } from './shared_record_round_title';
import { IGameRecord } from './shared_record_interface';
const { ccclass, property } = _decorator;

// 记录详情 选择某轮记录

@ccclass('SharedRecordRoundTitleList')
export class SharedRecordRoundTitleList extends Component {
    @property({type:Sprite})
    spBg:Sprite;

    @property({type:Sprite})
    ndRoot:Sprite;

    @property({type:ScrollView})
    svContent:ScrollView;

    @property({type:Prefab})
    recordRoundTitle:Prefab; //  标题

    private isExit: boolean = false;
    private exitCallback:Function;
    private selectRoundNoCallback: (idx: number)=>void

    async setData(orderId: string, gameRecord:IGameRecord, selectIdx: number){
        let nd = instantiate(this.recordRoundTitle);
        nd.parent = this.svContent.content;
        let recordRoundTitle = nd.getComponent(SharedRecordRoundTitle);
        let roundName = l10n.t("shared_record_normal_play");
        recordRoundTitle.setDate(roundName, gameRecord.getRecoredDetailSpinWin(orderId, 0), 0 == selectIdx);

        NodeEx.addClick(nd, this.onNodeClickRoundNo.bind(this, 0))

        for (let i=1, len = gameRecord.getRecordDetaiFreeTimes(orderId); i<=len; i++){
            let nd = instantiate(this.recordRoundTitle);
            nd.parent = this.svContent.content;
            let recordRoundTitle = nd.getComponent(SharedRecordRoundTitle);
            let roundName = l10n.t("shared_record_free_play")
            .replace("{1}", `${i}`)
            .replace("{2}", `${len}`);
            
            recordRoundTitle.setDate(roundName, gameRecord.getRecoredDetailSpinWin(orderId, i), i == selectIdx);
            NodeEx.addClick(nd, this.onNodeClickRoundNo.bind(this, i))

            if (i%4 == 0){
                await PromiseEx.CallDelayOnly(0);
                if (!isValid(this.svContent.node)){
                    return;
                }
            }
        }
    }

    playEnter(){
        this.ndRoot.node.active = false;
        this.spBg.getComponent(Widget).enabled = false;
        let position = this.spBg.node.position;
        this.spBg.node.position = new Vec3(position.x, 1638, 0)

        tween(this.spBg.node)
        .to(0.2, {position: Vec3.ZERO})
        .call(()=>{
            this.ndRoot.node.active = true;
            Action.grayLayerFadeIn(this.ndRoot, 0.3)
        })
        .start();
    }

    playExit(){
        if (this.isExit){
            return 
        }

        this.isExit = true;

        let position = this.spBg.node.position;
        tween(this.spBg.node)
        .call(()=>{
            this.ndRoot.node.active = false;
        })
        .to(0.2, {position:  new Vec3(position.x, 1638, 0)})
        .call(()=>{
           this.destroySelf();
           if (this.exitCallback){
                this.exitCallback();
           }
        })
        .start();
    }

    setExitCallback(cb:()=>void){ this.exitCallback = cb;}
    setSelectRoundNoCallback(cb:()=>void){ this.selectRoundNoCallback = cb;}

    destroySelf(){
        this.node.destroy();
    }

    private onNodeClickRoundNo(idx: number){
        if (this.selectRoundNoCallback){
            this.selectRoundNoCallback(idx);
        }

        this.playExit();
    }

    private onBtnClose(){
        this.playExit();
    }
}


