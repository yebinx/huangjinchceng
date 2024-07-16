enum ResultType{
    INIT = 0, // init
    START = 1 << 0, // 开始游戏
    RECEIVEDATA = 1 << 1, // 接受到服务器数据
    SNAPEDONE = 1 << 2, // 极速模式
    TOUCHSTOP = 1 << 3, // 点击停止
    STOPROLL = 1 << 4, // 停止滚动，准备开奖
}

export class GameStatusType {
    private clientRoundId = 0; // 一些异步操作，会导致代码先后顺序错误，用这个标志区分回合的唯一性
    private resultFlg: number = ResultType.INIT;
    private snapeDoneSetting:boolean = false; // 是否快速旋转设置
    private snapeDoneSettingTemp: boolean = false; // 快速旋转设置，每次设置后，下局才生效

    reset(){
        this.clientRoundId++;
        this.resultFlg = ResultType.INIT;
    }

    isInit(){return this.resultFlg == ResultType.INIT;}
    isStart(){return (this.resultFlg & ResultType.START) == ResultType.START;}
    isReceiveData(){return  (this.resultFlg & ResultType.RECEIVEDATA) == ResultType.RECEIVEDATA;}
    isSnapeDone(){return  (this.resultFlg & ResultType.SNAPEDONE) == ResultType.SNAPEDONE;}
    isTouchStop(){return  (this.resultFlg & ResultType.TOUCHSTOP) == ResultType.TOUCHSTOP;}
    isStopRoll(){return  (this.resultFlg & ResultType.STOPROLL) == ResultType.STOPROLL;}

    addStart(){this.resultFlg |= ResultType.START;}
    addReceiveData(){this.resultFlg |= ResultType.RECEIVEDATA;}
    addSnapeDone(){this.resultFlg |= ResultType.SNAPEDONE;}
    addTouchStop(){this.resultFlg |= ResultType.TOUCHSTOP;}
    addStopRoll(){this.resultFlg |= ResultType.STOPROLL;}

    isSnapeDoneSetting(){return this.snapeDoneSetting;}
    setSnapeDoneTemp(snapeDone:boolean){this.snapeDoneSettingTemp = snapeDone;}
    updateSnapeDone(){this.snapeDoneSetting = this.snapeDoneSettingTemp;}
    getClientRoundId(){return this.clientRoundId;}

    checkClientRound(clientRoundId: number){return this.clientRoundId == clientRoundId;}

    // dump(){
    //     let info = {
    //         isInit: this.isInit(),
    //         isStart: this.isStart(),
    //         isReceiveData: this.isReceiveData(),
    //         isSnapeDone: this.isSnapeDone(),
    //         isTouchStop: this.isTouchStop(),
    //         isStopRoll: this.isStopRoll(),
    //     }
    //     return JSON.stringify(info)
    // }
}


