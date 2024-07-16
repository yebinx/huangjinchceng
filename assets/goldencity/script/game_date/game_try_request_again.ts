
// 从新尝试，请求缓存
export class GameTryRequestAgain {
    private reqGameRecord:any = null;
    private reqRecordDetail: any = null;

    saveReqGameRecord(startTimestamp: number, endTimestamp: number, offset:number){
        this.reqGameRecord = {startTimestamp: startTimestamp, endTimestamp:endTimestamp, offset:offset}
    }

    getReqGameRecord(){
        return this.reqGameRecord
    }

    clearReqGameRecord(){
        this.reqGameRecord = null;
    }

    saveReqRecordDetail(orderId:string){
        this.reqRecordDetail = orderId;
    }

    getReqRecordDetail(){
        return this.reqRecordDetail
    }

    clearReqRecordDetail(){
        this.reqRecordDetail = null;
    }
}


