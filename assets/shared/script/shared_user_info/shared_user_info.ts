import { _decorator, Button, Color, Component, Label, tween, Vec3 } from 'cc';
import { Emitter } from '../../../shared/script/lib/Emitter';
import { EMIT_BALANCE_OPEN, EMIT_GAME_HISTORY_OPEN, EMIT_GAME_START, EMIT_SCORE_BET, EMIT_SCORE_GET, EMIT_SCORE_TOTAL, EMIT_SETTING_BET_OPEN } from '../config/shared_emit_event';
import { SharedConfig } from '../config/shared_config';
import { TweenEx } from '../lib/TweenEx';
import { I_EMIT_SCORE_BET, I_EMIT_SCORE_GET } from '../config/shared_emit_interface';
const { ccclass, property } = _decorator;

@ccclass('SharedUserInfo')
export class SharedUserInfo extends Component {
   @property({type:Label})
   lbMoneyBag:Label; // 钱包

   @property({type:Label})
   lbTotalBet:Label; // 总投注

   @property({type:Label})
   lbWin:Label; // 本局总赢

   @property({type:Button})
   btnMoneyBag:Button; // 钱包

   @property({type:Button})
   btnTotalBet:Button; // 总压

   @property({type:Button})
   btnPrize:Button; // 奖励

   private prize:number = 0;
   private emitter:Emitter;
   private defaultColor = new Color(134, 240, 255, 255)
//    private 

    protected onLoad(): void {
        this.setLableColor(this.defaultColor);
        this.btnTouchEnable(true);
    }

    register() {
        this.emitter.addEventListener(EMIT_GAME_START, this.onEmitGameStart, this);
        this.emitter.addEventListener(EMIT_SCORE_TOTAL, this.onEmitTotalScore, this);
        this.emitter.addEventListener(EMIT_SCORE_BET, this.onEmitBetScore, this);
        this.emitter.addEventListener(EMIT_SCORE_GET, this.onEmitGetScore, this);
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
    }

    reset(){
        this.setLableColor(this.defaultColor);
        this.btnTouchEnable(true);
    }

    private setLableColor(color:Color){
        this.lbMoneyBag.color = color.clone();
        this.lbTotalBet.color = color.clone();
        this.lbWin.color = color.clone();
    }

    private btnTouchEnable(enable: boolean){
        this.btnMoneyBag.interactable = enable;
        this.btnTotalBet.interactable = enable;
        this.btnPrize.interactable = enable;
    }

    private onEmitGameStart(){
        this.setLableColor(Color.WHITE);
        this.btnTouchEnable(false);
    }

    private onEmitTotalScore(info:string){
        this.lbMoneyBag.string = info;
    }

    private onEmitBetScore(emitArgs:I_EMIT_SCORE_BET){
        this.lbTotalBet.string = emitArgs.totalBet;

        if (!emitArgs.isAction){
            return;
        }
        
        tween(this.lbTotalBet.node)
        .to(0.1,{scale: new Vec3(1.3, 1.3, 1.3)})
        .to(0.05,{scale: new Vec3(1.0, 1.0, 1.0)})
        .to(0.05,{scale: new Vec3(1.1, 1.1, 1.1)})
        .to(0.05,{scale: new Vec3(1.0, 1.0, 1.0)})
        .start()
    }

    private onEmitGetScore(data:I_EMIT_SCORE_GET){
        let temp = this.prize;
        this.prize = data.score;
       
        if (!data.action){
            this.lbWin.string = SharedConfig.ScoreFormat(this.prize);
            return
        }

        if (!data.duration){
            data.duration = 0.2
        }

        TweenEx.Score(this.lbWin, data.duration, temp, this.prize, (lb:Label, currentNum:number)=>{
            lb.string = SharedConfig.ScoreFormat(currentNum);
        })
        .start()
    }

    // 打开投注设置
    private onBtnOpenSettingBet(){
        this.emitter.emit(EMIT_SETTING_BET_OPEN);
    }

     // 查看记录
    private onBtnOpenRecord(){
        this.emitter.emit(EMIT_GAME_HISTORY_OPEN);
    }

    // 打开余额
    private onBtnOpenBalance(){
        this.emitter.emit(EMIT_BALANCE_OPEN);
    }
}


