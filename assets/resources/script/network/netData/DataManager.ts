
import { IconFrame, IconGrid } from "../../../../goldencity/proto/base";
import BetInfo from "../../data/BetInfo";
import BetResult from "../../data/BetResult";
import UserInfo from "../../data/UserInfo";
import { mssCmd } from "./cmd";

export default class DataManager{
    public static gametoken:string="";
    public static userId:number=0;
    public static serverTypeStr="";
    public static totalRoomInitCost:number=0;
    public static tagUserInfoHead=null;
    public static CMD_S_StatusFree=null;
    public static CMD_GR_ServerInfoV2=null;
    public static betCfg=null;
    public static getCmdEventName(mainCmdID, SubCmdID, serverTypeStr=null) {
        let tserverTypeStr = serverTypeStr?serverTypeStr:this.serverTypeStr;
        return tserverTypeStr + "_" + "CMD_" + mainCmdID + "_" + SubCmdID;
    };

   
    public static betResult:BetResult=null;
   public static norBetResp(CMD_S_GameEnd){
       if(!this.betResult)this.betResult=new BetResult(CMD_S_GameEnd);
       else this.betResult.addNextRound(CMD_S_GameEnd);
       
   }

   public static betResultComplete(){
        this.betResult.norData();
        console.log("betResultComplete",this.betResult);
        //this.clearClassData();
   }

   public static clearClassData(){
        this.betResult=null;
    }

    public static convertToNorId(id:number){
        let tid = id+2;
        if(id==12)tid=1;
        else if(id==13)tid=2;
        return tid;
    }
   /**
    * 转换成本客户端id 因为接的另外的服务端需要转换一下id
    * 
    * id接收到的服务的id
   */
   public static convertId(id:number,frameType:number=0,row:number=1){
        let tid = id+2;
        if(id==12)tid=1;
        else if(id==13)tid=2;
        let tarid = this.encodeItemType(tid,frameType,row);
        return tarid;
   }

   public static encodeItemType(itemType: number,frameType,space=1){
        // 确保 space 是有效值，如果 space 为 1，则设置为 0（因为 decodeItemType 中有类似的逻辑）
        if (space == 1) {
            space = 0;
        }

        // 计算原始的 _itemType 值
        let _itemType = (frameType * IconFrame.SILVERFRAME) + (space * IconGrid.SPACEBASE) + itemType;

        return _itemType;
    }

   public static initLoginData(){
        let tuserinfo:UserInfo = new UserInfo();
        if(this.tagUserInfoHead){
            tuserinfo.player_info.id=this.tagUserInfoHead.dwUserID.value;
            tuserinfo.player_info.balance = this.tagUserInfoHead.userScoreInfo.lGoldTotal.value;
            //tuserinfo.player_info.nickname = this.tagUserInfoHead
        }
        return tuserinfo;
   }

   public static initBetInfo(){
        let tbetinfo:BetInfo = new BetInfo();
        if(this.betCfg){

        }
        return tbetinfo;
   }

   public static getL10n(key: string) {
        // l10n的子包加载有时候会比resources慢
        if (window["l10n"]) {
            return window["l10n"].t(key);
        }

        return key;
    }
}