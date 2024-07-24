import DataManager from "../network/netData/DataManager";
import CardListEle from "./CardListEle";

export default class BetResultEle{
    public card_list:Array<CardListEle>=[];
    public win:number=0;
    public havewin:number=0;
    public removelist=[];
  
    public roundid:string="";
    public sceneodds:number=1;
    public balance:number=0;
    public scattercount:number=0;
    public createtime:number=0;
    constructor(CMD_S_GameEnd){
        this.win = CMD_S_GameEnd.lAwardGold.value;
        this.havewin = CMD_S_GameEnd.lAwardGold.value;
        this.balance = CMD_S_GameEnd.llUserTotalScore.value;
        this.addCardList(CMD_S_GameEnd);
        this.setRmoveListData();
    }

    private addCardList(CMD_S_GameEnd){
        let nIconAreaDistri = CMD_S_GameEnd.nIconAreaDistri;
        let nIconAwardPos = CMD_S_GameEnd.nIconAwardPos;
        let nReplaceWildCol = CMD_S_GameEnd.nReplaceWildCol;
        let nRemoveIcon = CMD_S_GameEnd.nRemoveIcon;
        let nIconAfterRemove = CMD_S_GameEnd.nIconAfterRemove;
        let nIconAfterFill = CMD_S_GameEnd.nIconAfterFill;

        let tele:CardListEle=new CardListEle();
        tele.addUpListData(nIconAreaDistri[0],nRemoveIcon[0]);
        this.card_list.push(tele);

        let tdata;
        for(let col=0;col<6;col++){
            tele = new CardListEle();
            for(let row=1;row<nIconAreaDistri.length;row++){
                tdata = nIconAreaDistri[row][col];
                let trowcount = tdata.nMaxColCount.value;
                let frameType = tdata.isGold.value;
                let tsId = tdata.iType.value;
                let tid = DataManager.convertId(tsId,frameType,trowcount);
                if(tdata.iType.value>0){
                    tele.addListEle(tid);
                    tele.addSourceListEle(tid,trowcount,frameType);
                }

                tdata = nRemoveIcon[row][col];
                // trowcount = tdata.nMaxColCount.value;
                frameType = tdata.isGold.value;
                //tid = DataManager.convertId(tdata.iType.value,frameType,trowcount);
                if(tdata.iType.value>0 || frameType>0){
                    //tele.addDropEle(tid);
                    tele.addWinPos(row-1);
                    if(tele.isRemoveEle(frameType)){
                        tele.removeList.push({row:row-1,rowCount:trowcount,col:col,id:tid,norId:DataManager.convertToNorId(tsId)});
                    }
                    else{
                        console.log("win not remove",frameType,tid,row-1,col);
                        if(frameType==1){
                            let tgoldId = DataManager.convertId(tsId,2,trowcount);
                            tele.s2glist.push({goldenid:tgoldId,silverindex:row-1});
                        }else if(frameType==2){
                            let tgoldId = (trowcount*100)+1;//转百搭
                            tele.s2glist.push({goldenid:tgoldId,silverindex:row-1});
                        }
                    } 
                    console.log("win row "+row,"col "+col,tid);
                }
            }
            this.card_list.push(tele);
        }
    }

    private setRmoveListData(){
        let tremoveIds = this.getRemoveIds();
        if(tremoveIds.length){
            for(let i=0;i<tremoveIds.length;i++){
                let tcounts = this.getWinCount(tremoveIds[i]);
                this.removelist.push({iconid:tremoveIds[i],winlines:this.getWinLins(tcounts),wincount:tcounts});
            }
        }
    }

    private getRemoveIds(){
        let tids=[];
        for(let j=0;j<this.card_list.length;j++){
            let tCardEle:CardListEle = this.card_list[j];
            for(let i=0;i<tCardEle.removeList.length;i++){
                let tid = tCardEle.removeList[i].id;
                if(tids.indexOf(tid)<0)tids.push(tid);
            }
        }
        return tids;
    }

    private getWinCount(id:number){
        let tcounts = [];
        for(let i=1;i<this.card_list.length;i++){
            let tremoveEles = this.card_list[i].removeList;
            let tnum=0;
            for(let h=0;h<tremoveEles.length;h++){
                if(tremoveEles[h].id==id)tnum++;
            }
            tcounts[i-1]=tnum;
        }
        let tupremoveList = this.card_list[0].removeList;
        for(let i=0;i<tupremoveList.length;i++){
            if(tcounts[tupremoveList[i].col])tcounts[tupremoveList[i].col] += 1;
            else tcounts[tupremoveList[i].col] = 1;
        }
        return tcounts;
    }

    private getWinLins(counts){
        let tlines=1;
        for(let i=0;i<counts.length;i++){
            if(counts[i]>0)tlines = tlines*counts[i];
        }
        return tlines;
    }
}