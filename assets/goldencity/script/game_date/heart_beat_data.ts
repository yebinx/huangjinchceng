
// 心跳数据
export class HeartBeatData  {
    private lastHeartBeatTime = 0; // 最后心跳时间戳

    isCheckHeartbeat(){
        let now = new Date().getTime();
        return now - this.lastHeartBeatTime > 60 * 3 * 1000;
    }

    // 心跳超时
    isHeartbeatTimeOut(){
        let now = new Date().getTime();
        return now - this.lastHeartBeatTime > 60 * 10 * 1000;
    }

    // 更新心跳时间戳
    updateLastHeartBeatTime(){
        this.lastHeartBeatTime = new Date().getTime();
    }
}


