import { _decorator, Component, Label, Node } from 'cc';
import { Emitter } from '../lib/Emitter';
import { EMIT_SCORE_BET, EMIT_SCORE_GET, EMIT_SCORE_TOTAL } from '../config/shared_emit_event';
import { I_EMIT_SCORE_BET, I_EMIT_SCORE_GET } from '../config/shared_emit_interface';
import { SharedConfig } from '../config/shared_config';
const { ccclass, property } = _decorator;

@ccclass('SharedSettingUserInfo')
export class SharedSettingUserInfo extends Component {
    @property({type: Label})
    lbTotalWin:Label // 上局总赢

    @property({type: Label})
    lbMoneyBag:Label // 钱包

    @property({type: Label})
    lbTotalBet:Label // 当前选择下注

    emitter:Emitter;
    
    protected onLoad(): void {
        
    }
    
    start() {

    }

    protected onDestroy(): void {
        this.emitter.removeEventByTarget(this);
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
    }
   
    register(){
        this.emitter.addEventListener(EMIT_SCORE_TOTAL, this.setMoneyBag, this)
        this.emitter.addEventListener(EMIT_SCORE_BET, this.setTotalBet, this)
        this.emitter.addEventListener(EMIT_SCORE_GET, this.setTotalWin, this)
    }

    private setTotalWin(data:I_EMIT_SCORE_GET){
        this.lbTotalWin.string = SharedConfig.ScoreFormat(data.score);
    }

    private setMoneyBag(v:string){
        this.lbMoneyBag.string = v;
    }

    private setTotalBet(emitArgs:I_EMIT_SCORE_BET){
        this.lbTotalBet.string = emitArgs.totalBet;
    }
}


