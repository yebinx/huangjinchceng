import { _decorator, Component, Node } from 'cc';
import { HeartBeatData } from '../game_date/heart_beat_data';
import { GameData } from '../game_date/game_data';
import { Emitter } from '../../../shared/script/lib/Emitter';
const { ccclass, property } = _decorator;

// 心跳检查
@ccclass('HeartBeat')
export class HeartBeat extends Component {
    gameData: GameData;
    heartBeatData: HeartBeatData;
    private emitter: Emitter;

    setGameData(gameData:GameData){
        this.gameData = gameData;
        this.heartBeatData = this.gameData.getHeartbeatData();
    }

    setEmitter(emitter:Emitter){
        this.emitter = emitter;
    }

    protected start(): void {
        this.schedule(()=>{this.checkHeartBeat()}, 10)
    }

    // 定时检查心跳时间
    checkHeartBeat() {
        // 不检查心跳超时，等请求后服务器返回错误码
        // if (this.heartBeatData.isHeartbeatTimeOut()) {
        //     this.emitter.emit(EMIT_HEART_BEAT_TIME_OUT);
        //     this.unscheduleAllCallbacks();
        //     return;
        // }

        if (this.heartBeatData.isCheckHeartbeat()) {
            this.gameData.reqHeartBeat();
            // console.log("heartbeat 1")
        }
    }
}


