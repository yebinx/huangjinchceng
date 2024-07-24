import DataManager from "../network/netData/DataManager";

export default class CardListEle{
    public list=[];
    public winpos=[];
    public droplist=[];
    public s2glist=[];

    //一下为一些标记数据，只是为了方便计算掉落拿到参考数据
    public removeList=[];
    public scoureList=[];
    constructor(){

    }

    public addUpListData(nIconAreaDistri,nRemoveIcon,startPos:number=1,endPos:number=4){
        for(let i=startPos;i<=endPos;i++){
            let tdata = nIconAreaDistri[i];
            let trowcount = tdata.nMaxColCount.value;
            let frameType = tdata.isGold.value;
            let tsId = tdata.iType.value;
            let tid = DataManager.convertId(tsId,frameType,trowcount);
            this.list.push(tid);
            this.addSourceListEle(tid,trowcount,frameType);
            tdata = nRemoveIcon[i];
            // trowcount = tdata.nMaxColCount.value;
            // frameType = tdata.isGold.value;
            //tid = DataManager.convertId(tdata.iType.value,frameType,trowcount);
            if(tdata.iType.value>0 || tdata.isGold.value>0){
                this.winpos.push(i-startPos);
                if(this.isRemoveEle(frameType)){
                    this.removeList.push({row:i-startPos,rowCount:trowcount,id:tid,col:i,norId:DataManager.convertToNorId(tsId)});
                }else{
                    if(frameType==1){
                        let tgoldId = DataManager.convertId(tsId,2,trowcount);
                        this.s2glist.push({goldenid:tgoldId,silverindex:i-startPos});
                    }else if(frameType==2){
                        let tgoldId = (trowcount*100)+1;//转百搭
                        this.s2glist.push({goldenid:tgoldId,silverindex:i-startPos});
                    }
                    console.log("win not remove",frameType,tid,0,i);

                }
                
                console.log("win row "+0,"col "+i,tid);
            }
        }
    }

    public addListEle(value:number){
        this.list.push(value);
    }

    public addWinPos(value:number){
        this.winpos.push(value);
    }

    public addDropEle(value:number){

    }

    public isRemoveEle(frameType){
        return frameType != 1 && frameType != 2;
    }

    public addSourceListEle(id:number,row3:number,frameType:number){
        this.scoureList.push({rowCount:row3,id:id,frameType:frameType});
    }

    public getRemoveRows(){
        let trow=0;
        for(let i=0;i<this.removeList.length;i++){
            trow += this.removeList[i].rowCount;
        }
        return trow;
    }

    public getAllRows(){
        let trow=0;
        for(let i=0;i<this.scoureList.length;i++){
            trow += this.scoureList[i].rowCount;
        }
        return trow;
    }

    public setDropListFromNextList(nextEle:CardListEle){
        let tthisRows = this.getAllRows()-this.getRemoveRows();
        let trows=0;
        this.droplist=[];
        for(let row=0;row<nextEle.scoureList.length;row++){
            trows += nextEle.scoureList[row].rowCount;
            if(trows>tthisRows){
                this.droplist.push(nextEle.scoureList[row].id);
            }
        }
        // for(let i=0;i<this.s2glist.length;i++){
        //     let tpos = this.s2glist[i].silverindex;
        //     let tid = nextEle.scoureList[tpos].id;
        //     this.s2glist[i].goldenid = tid;
        // }
    }
}