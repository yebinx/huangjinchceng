
// 游戏时间
export class GameTime {
    private spinTimestamp: number = 0; // 开始旋转的时间
    saveSpinTimestamp() {
        this.spinTimestamp = new Date().getTime();
    }

    // 获取旋转了多久，毫秒
    getSpinPastTime(){
        return new Date().getTime() - this.spinTimestamp;
    }
}


