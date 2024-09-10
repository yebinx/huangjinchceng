import { GameData } from "../../../goldencity/script/game_date/game_data";
import DataManager from "../network/netData/DataManager";
import BetResultEle from "./BetResultEle";
import CardListEle from "./CardListEle";

export default class BetResult{
    public row:number=6;
    public col:number=6;
    public balance:number=0;
    public result:Array<BetResultEle>=[];
    public bet:number=0;
    public freetimes:number=0;
    public wintotal:number=0;
    public orderid:string="7-1703208881-4DB83D1F0";
    constructor(CMD_S_GameEnd){
       this.addRound(CMD_S_GameEnd);
    }

    public addRound(CMD_S_GameEnd){
        this.setOutData(CMD_S_GameEnd);
        this.addResultData(CMD_S_GameEnd);
    }

    private setOutData(CMD_S_GameEnd){
        this.balance = CMD_S_GameEnd.llUserTotalScore.value;
        this.freetimes = CMD_S_GameEnd.nCurRoundFreeCount.value;
        let ttotal = CMD_S_GameEnd.lNormalTotalAwardGold.value;
        if(ttotal>this.wintotal)this.wintotal = ttotal;
        this.bet = DataManager.currBet;
    }

    private addResultData(CMD_S_GameEnd){
        let tresuele:BetResultEle = new BetResultEle(CMD_S_GameEnd);
        this.result.push(tresuele);
    }
    /**掉落和消除根据下一屏数据获取*/
    public norData(){
        if(this.result.length>1){
            for(let i=0;i<this.result.length;i++){
                let tresult = this.result[i];
                let tcardlist = tresult.card_list;
                for(let col=0;col<tcardlist.length;col++){
                    if(tcardlist[col].removeList.length)this.norDropList(tcardlist[col],col,i);
                }
            }
        }
    }


    private norDropList(cardEle:CardListEle,col,index){
        let tremoveLen = cardEle.getRemoveRows();
        if(tremoveLen>0){
            let tnextresult = this.result[index+1];
            let tnextCardList = tnextresult.card_list[col];
            cardEle.setDropListFromNextList(tnextCardList);
        }
       
    }
}