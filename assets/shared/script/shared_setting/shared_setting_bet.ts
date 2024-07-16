import { _decorator, Button, Color, color, Component, Label, math, Node, Sprite, tween, UITransform, Vec3 } from 'cc';
import { Emitter } from '../lib/Emitter';
import { ButtonEx } from '../lib/button/ButtonEx';
import { PromiseEx } from '../lib/PromiseEx';
import { Action } from '../action';
import { NodeEx } from '../lib/NodeEx';
import { EMIT_VIEW_RESIZE } from '../config/shared_emit_event';
import { SharedSettingBetSelectIdx } from './shared_setting_bet_select_idx';
import { SharedSettingUserInfo } from './shared_setting_user_info';
import { SCORE_MULTIPLE } from '../config/shared_config';

const { ccclass, property } = _decorator;

@ccclass('SharedSettingBet')
export class SharedSettingBet extends Component {
    @property({type:Sprite})
    spGrayBg:Sprite;

    @property({type:Node})
    spBg:Node = null; // 背景，最先出现

    @property({type:Node})
    root:Node = null; 

    @property({type:SharedSettingBetSelectIdx}) // 投注大小
    selectBet:SharedSettingBetSelectIdx;

    @property({type:SharedSettingBetSelectIdx}) // 投注倍数
    selectMultiple:SharedSettingBetSelectIdx;

    @property({type:SharedSettingBetSelectIdx}) // 总投注
    selectTotal:SharedSettingBetSelectIdx;

    @property({type:Node}) // 选择框
    selectFrame: Node;

    @property({type:Button})
    btnMaxBet:Button // 最大投注

    @property({type:Button})
    btnSussecc:Button // 确定

    @property({type:[Node]})
    ndAdaptationSpace:Node[] = []; // 适配节点

    @property({type:SharedSettingUserInfo})
    settingUserInfo:SharedSettingUserInfo

    szBetBase:number[] = []; // 投注大小
    szBetMultiple:number[] = []; // 投注倍率
    szBetTotal:number[] = []; // 总投注总额

    private totalLine = 20;
    private isSuccess: boolean = false;
    private emitter:Emitter;
    private successCallback:(baseBetIdx:number, multipleIdx:number)=>void;
    private destroyCallback:()=>void;

    onLoad() {
        // this.btnMaxBet = ButtonEx.replaceColorButton(this.btnMaxBet);
        // this.btnSussecc = ButtonEx.replaceColorButton(this.btnSussecc);

        this.selectBet.setStartCallback(this.onCallbackSelectStart.bind(this));
        this.selectMultiple.setStartCallback(this.onCallbackSelectStart.bind(this));
        this.selectTotal.setStartCallback(this.onCallbackSelectStart.bind(this));

        this.selectBet.setStopCallBack(this.onCallbackSelectBet.bind(this));
        this.selectMultiple.setStopCallBack(this.onCallbackSelectMultiple.bind(this));
        this.selectTotal.setStopCallBack(this.onCallbackBetTotal.bind(this));
    }

    protected start(): void {
        // this.test()
        this.spBg.active = false;
        
        this.playEnterAction();
    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);

        if (this.isSuccess){
            let selectBetIdx:number = this.selectBet.getSelectIdx();
            let selectMultipleIdx:number = this.selectMultiple.getSelectIdx();
            this.successCallback(selectBetIdx, selectMultipleIdx);
        }

        if (this.destroyCallback){
            this.destroyCallback()
        }
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
        this.settingUserInfo.setEmitter(emitter);
    }

    register(){
        this.emitter.addEventListener(EMIT_VIEW_RESIZE, this.onEmitViewResize, this);
        this.settingUserInfo.register()
    }

    setLine(line:number){
        this.totalLine = line;
    }

    setMultipleData(szData: number[]){
        this.szBetMultiple = szData;
    }

    setBetData(szData: number[]){
        this.szBetBase = szData;
    }

    setCallback(callBack: (baseBetIdx:number, multipleIdx:number)=>void){
        this.successCallback = callBack;
    }

    setDestroyCallback(destroyCallback: ()=>void){
        this.destroyCallback = destroyCallback;
    }

    // 关闭
    private onBtnClose(){
        this.playExitAction();
    }

    // 最大投注
    private async onBtnMaxBet(){
        this.selectBet.scrollTo(this.szBetBase.length - 1, 0.1);
        this.selectMultiple.scrollTo(this.szBetMultiple.length - 1, 0.1);
        this.selectTotal.scrollTo(this.szBetTotal.length - 1, 0.1);

        ButtonEx.InteractableOpacity(this.btnMaxBet, false);
        ButtonEx.InteractableOpacity(this.btnSussecc, false);
        await PromiseEx.CallDelayOnly(0.1)
        ButtonEx.InteractableOpacity(this.btnSussecc, true);
    }

    private onBtnSuccess(){
        this.isSuccess = true;
        this.playExitAction();
    }

    flush(baseBetIdx: number, multipleIdx:number){
        this.szBetTotal = []
        let totalSet = new Map();
        this.szBetBase.forEach(v1 => {
            this.szBetMultiple.forEach(v2 => {
                let total = Math.floor(v1 * v2 * this.totalLine);
                if (!totalSet[total]){
                    this.szBetTotal.push(total)
                    totalSet[total] = total;
                }
            });
        });
        
        if (this.szBetTotal.length >= 2){
            this.szBetTotal.sort((a, b) => a - b);
        }
        
        this.selectBet.setData(this.szBetBase.map((v)=>{return (v / SCORE_MULTIPLE).toFixed(2)}))
        this.selectMultiple.setData(this.szBetMultiple.map((v)=>{return v.toString()}))
        this.selectTotal.setData(this.szBetTotal.map((v)=>{return (v / SCORE_MULTIPLE).toFixed(2).toString()}));
        this.selectBet.flush()
        this.selectMultiple.flush()
        this.selectTotal.flush()

        this.updateSelectFramePos();

        this.initSelectIdx(baseBetIdx, multipleIdx);
    }

    // 初始化默认位置
    private initSelectIdx(baseBetIdx: number, multipleIdx:number){
        this.selectBet.scrollTo(baseBetIdx, null);
        this.selectMultiple.scrollTo(multipleIdx, null);

        let totalBet = this.szBetBase[baseBetIdx] * this.szBetMultiple[multipleIdx] * this.totalLine;
        for (let i=0; i<this.szBetTotal.length; i++){
            if (this.szBetTotal[i] == totalBet){
                this.selectTotal.scrollTo(i, null)
                break
            }
        }
    }

    private playExitAction(){
        // Audio.i.playCloseMenu();
        tween(this.spBg)
        .call(()=>{
            this.root.active = false;
        })
        .by(0.15, {position: new Vec3(0, -1000, 0)})
        .call(()=>{
            Action.grayLayerFadeOut(this.spGrayBg, 0.3, ()=>{
                this.node.destroy();
            });
        })
        .start()
    }

    private playEnterAction(){
        // Audio.i.playOpenMenu();
        this.spBg.position = this.spBg.position.add(new Vec3(0, -2000, 0));
        this.spBg.active = true;
        this.root.active = false;
        Action.grayLayerFadeIn(this.spGrayBg, 0.3);

        tween(this.spBg)
        .to(0.3, {position: new Vec3(0, 0, 0)})
        .call(()=>{
            this.root.active = true;
            Action.grayLayerFadeIn(this.root.getComponent(Sprite), 0.4)
        })
        .start()
    }

    private updateSelectFramePos(){
        let worldPoint = this.selectBet.getWorldPoint();
        let uiTransform = this.selectFrame.parent.getComponent(UITransform);
        let newPoint = uiTransform.convertToNodeSpaceAR(worldPoint);
        newPoint.x = this.selectFrame.position.x;
        this.selectFrame.position =  newPoint;
    }

    private onCallbackSelectStart(){
        ButtonEx.InteractableOpacity(this.btnSussecc, false);
        ButtonEx.InteractableOpacity(this.btnMaxBet, false);
    }

    // 选择投注大小事件
    private onCallbackSelectBet(idx: number){
        let selectBetIdx:number = idx;
        let selectMultipleIdx:number = this.selectMultiple.getSelectIdx();
        let totalBet = Math.floor(this.szBetBase[selectBetIdx] * this.szBetMultiple[selectMultipleIdx] * this.totalLine * 100) / 100;

        for (let i=0; i<this.szBetTotal.length; i++){
            if (this.szBetTotal[i] == totalBet){
                this.selectTotal.scrollTo(i, 0.1)
                break
            }
        }

        ButtonEx.InteractableOpacity(this.btnMaxBet, !(this.szBetBase.length - 1 == selectBetIdx && this.szBetMultiple.length - 1 == selectMultipleIdx));
        ButtonEx.InteractableOpacity(this.btnSussecc, true);
    }

    // 选择倍数事件
    private onCallbackSelectMultiple(idx: number){
        let selectBetIdx:number = this.selectBet.getSelectIdx();
        let selectMultipleIdx:number = idx;
        let totalBet = Math.floor(this.szBetBase[selectBetIdx] * this.szBetMultiple[selectMultipleIdx] * this.totalLine * 100) / 100;

        for (let i=0; i<this.szBetTotal.length; i++){
            if (this.szBetTotal[i] == totalBet){
                this.selectTotal.scrollTo(i, 0.1)
                break
            }
        }

        ButtonEx.InteractableOpacity(this.btnMaxBet, !(this.szBetBase.length - 1 == selectBetIdx && this.szBetMultiple.length - 1 == selectMultipleIdx));
        ButtonEx.InteractableOpacity(this.btnSussecc, true);
    }

    // 选择总投注事件
    private onCallbackBetTotal(idx: number){
        let total = this.szBetTotal[idx];
        let selectBetIdx:number = null;
        let selectMultipleIdx:number = null;
        for (let i=0; i < this.szBetBase.length; i++){
            let multiple = Math.floor(total / this.szBetBase[i] / this.totalLine * 100) / 100;
            for (let j=0; j < this.szBetMultiple.length; j++){
                if (multiple == this.szBetMultiple[j]){
                    selectBetIdx = i;
                    selectMultipleIdx = j;
                    break
                }
            }
        }
        this.selectBet.scrollTo(selectBetIdx, 0.1);
        this.selectMultiple.scrollTo(selectMultipleIdx, 0.1);

        ButtonEx.InteractableOpacity(this.btnMaxBet, !(this.szBetTotal.length - 1 == idx));
        ButtonEx.InteractableOpacity(this.btnSussecc, true);
    }

    //
    private onEmitViewResize(offsetY: number, limitOffsetY:number){
        let height = Math.max(Math.min(offsetY, limitOffsetY), 0)
        NodeEx.setSize(this.ndAdaptationSpace[0], null, height);
        NodeEx.setSize(this.ndAdaptationSpace[1], null, height);
    }

    //--------------------------------------------
    // test(){
    //     this.szBetBase = [0.01, 
    //      0.05,
    //      0.25,
    //     ]
    //     this.szBetMultiple = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    //     this.szBetTotal = []
    //     // this.szBetBase.forEach(v1 => {
    //     //     this.szBetMultiple.forEach(v2 => {
    //     //         this.szBetTotal.push(Math.floor(v1 * v2 * 20 * 100) / 100)
    //     //     });
    //     // });

    //     this.flush()
    // }
}


