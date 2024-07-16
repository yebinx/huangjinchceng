

import { TProtoGoldenCityBetRsp } from "../../../goldencity/proto/v1.goldencity.bet";
import { Network } from "./Network";
import DataManager from "./netData/DataManager";
import EventCenter from "./netData/EventCenter";
import NativeClass from "./netData/NativeClass";
import { KN_CMD, RoomMainCmd, RoomSubCmd, mssCmd, roomCmd } from "./netData/cmd";
import { CmdFramework } from "./netData/cmdLen";


export class NetworkSend
{
    private static _ins:NetworkSend;
    public static get Instance(){
        if(!this._ins)this._ins=new NetworkSend();
        return this._ins;
    }
    public reqToken(){
        Network.Instance.SendCmd(KN_CMD.MDM_KN_COMMAND, KN_CMD.SUB_KN_XORKEY_REQ);
    }
    public enterRoom(){
        var cmd = new roomCmd.CMD_GR_LogonByTPAccount();
        cmd.szTPAccount.value = NativeClass.GetUserAccount() == "" ? 'TKKSOLK172' : NativeClass.GetUserAccount();
        cmd.szPassWord.value = NativeClass.GetUserPassword() == "" ? 'TK125601' : NativeClass.GetUserPassword();
        cmd.iOperatoerID.value = NativeClass.GetOperatorId() == 0 ? '697996' : NativeClass.GetOperatorId();
        cmd.ulSessionID.value = NativeClass.GetSessionId();
        cmd.szMac.value = NativeClass.GetMac() == "" ? '123' : NativeClass.GetMac();
        cmd.szIps.value = NativeClass.GetIp() == 0 ? '127.0.0.1' : NativeClass.GetIp();
        Network.Instance.SendCmd(roomCmd.MDM_GR_LOGON, roomCmd.SUB_GR_LOGON_ACCOUNTS, cmd);
    }

    public sendStartSpin(betConfig) {
        console.log("sendStartSpin: ", betConfig);
        let cmddata = new mssCmd.CMD_C_GAME_START();
        cmddata.nBet.value = betConfig.mTotalAmount;
        DataManager.currBet = betConfig.mTotalAmount;
        Network.Instance.SendCmd(RoomMainCmd.MDM_GF_GAME, mssCmd.SUB_C_START, cmddata);
        DataManager.clearClassData();
    }

    public sendStartSpinPromise(betConfig){
        console.log(`sendStartSpinPromise `, betConfig)//logflg
        let tself = this;
        return new Promise((resolve, reject)=> {
            tself.sendStartSpin(betConfig);
            let tsucess = function(){
                let responeData = DataManager.betResult as TProtoGoldenCityBetRsp
                resolve(responeData)
                EventCenter.getIns().off(tScuessevent,tsucess,tself);
                EventCenter.getIns().off(tfailEvent,fail,tself);
            }
            let fail = function(){
                reject();
                EventCenter.getIns().off(tScuessevent,tsucess,tself);
                EventCenter.getIns().off(tfailEvent,fail,tself);
            }
            let tScuessevent = DataManager.getCmdEventName(roomCmd.MDM_GF_GAME,RoomSubCmd.SUB_S_GAME_END_END);
            let tfailEvent = DataManager.getCmdEventName(roomCmd.MDM_GF_GAME,RoomSubCmd.SUB_S_GAME_ERR);
            EventCenter.getIns().on(tScuessevent,tsucess,tself);
            EventCenter.getIns().on(tfailEvent,fail,tself);

        })
    }

    public sendFreeSpin(){
        let cmddata = new mssCmd.CMD_C_GAME_START();
        cmddata.nBet.value = 0;
        Network.Instance.SendCmd(RoomMainCmd.MDM_GF_GAME, mssCmd.SUB_C_START, cmddata);
    }


       /**
     * 获取游戏信息，LKPY会开始游戏
     */
    public  sendGetGameInfo () {
        let value = 0;
        var gfInfo = new roomCmd.CMD_GF_Info();
        gfInfo.bAllowLookon.value = 0;
        gfInfo.nTotalBet.value = DataManager.totalRoomInitCost;
        Network.Instance.SendCmd(roomCmd.MDM_GF_FRAME, roomCmd.SUB_GF_INFO, gfInfo);

        //this.setGameInitCost(0);
    }

    public ready(){
        Network.Instance.SendCmd(roomCmd.MDM_GF_FRAME, roomCmd.SUB_GF_USER_READY, null);
    }

    public autoSitDown(tableId=null) {
        var sitReq = new roomCmd.CMD_GR_UserSitReqNoPass();
        sitReq.wTableID.value = CmdFramework.INVALID_TABLE;
        sitReq.wChairID.value = CmdFramework.INVALID_CHAIR;

        // if (tableId == CmdFramework.INVALID_TABLE) {
            Network.Instance.SendCmd(roomCmd.MDM_GR_USER, roomCmd.SUB_GR_USER_SIT_REQ, sitReq);
        // }

    }
   
}




