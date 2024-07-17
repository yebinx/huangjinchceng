import { _decorator, Component, Node } from 'cc';


import { CSPacket, CSPacketHead } from './netData/BaseCommand';
import { KN_CMD, KN_COMMAND, loginCMD, mssCmd, roomCmd, RoomSubCmd } from './netData/cmd';
import { MD5 } from './netData/Md5';
import EventCenter from './netData/EventCenter';
import DataManager from './netData/DataManager';
import { CmdLen } from './netData/cmdLen';
import { NetworkSend } from './NetworkSend';

const { ccclass, property } = _decorator;



export class Network 
{
    private static _ins:Network;
    private mWebSocket: WebSocket = null;
    private mConnectTimer: number;
    private mPingRevTimer: number;
    private mPingSendTimer: number;
    private mPingSpace: number = 5000;

    private mForceClose: boolean = false;
    private DEF_KEY = "iVXOalP0C3wTw25$jqWDolz!ymnYlPNthk3u&G0p5uffhaxKVqp!2%ZlC2C%XJGK";
    public WEBSOCKET_ADDR = "wss://game2.wu6jv3.com/games/20600/1";
    public static get Instance(){
        if(!this._ins)this._ins=new Network();
        return this._ins;
    }
    constructor() 
    {
       
      
    }

    public CreateWS() {
        if (this.mWebSocket != null) {
            console.log('上一根ws还没有清理，不能重新连接');
            return;
        }
        console.log('连接ws====' + this.WEBSOCKET_ADDR);
        this.mForceClose = false;
        this.mWebSocket = new WebSocket(this.WEBSOCKET_ADDR);
        this.mWebSocket.onopen = this.OnOpen.bind(this);
        this.mWebSocket.onmessage = this.OnMessage.bind(this);
        this.mWebSocket.onerror = this.OnError.bind(this);
        this.mWebSocket.onclose = this.OnClose.bind(this);
        this.mWebSocket.binaryType = "arraybuffer";
        this.mConnectTimer = setTimeout(this.OnConnectTimeOut.bind(this), 5000);
    }

    public ClearWS(_forceClose: boolean = true) {
        this.mForceClose = _forceClose;
        clearTimeout(this.mConnectTimer);
        this.StopPing();
        console.log("ClearWS _forceClose== " + _forceClose );
        this.ResetWS();
        // if (this.mWebSocket != null && this.mWebSocket.readyState === WebSocket.OPEN) 
        // {
        //     this.mWebSocket.close();
        // }
        // else
        // {
        //     this.ResetWS();
        // }
    }

    private OnOpen(event) {
      
        clearTimeout(this.mConnectTimer);
     
        this.SendPing();
        EventCenter.getIns().emit("onConnect");
        NetworkSend.Instance.reqToken();
    }

    private OnError(event) {
        console.log('Socket OnError = ');
        clearTimeout(this.mConnectTimer);
       
    }

    private OnClose(event) {
        console.log('Socket OnClose  =  ');
        this.ResetWS();
    }
    
    private ResetWS()
    {
        this.StopPing();
        clearTimeout(this.mConnectTimer);
        if (this.mWebSocket != null) 
        {
            this.mWebSocket.onopen = null;
            this.mWebSocket.onmessage = null;
            this.mWebSocket.onerror = null;
            this.mWebSocket.onclose = null;
            this.mWebSocket = null;
        }

      

        if (this.mForceClose == false) 
        {
          
            //UIMgr.Instance.ShowToast(Localization.GetString("00113"));
            setTimeout(this.CreateWS.bind(this), 1000);
        }
    }

    static HeaderLength = 12;
    public SendCmd(MainCmdID: number, SubCmdID,Body=null) 
    {
        console.warn("SendCmd",MainCmdID,SubCmdID);
        let pack = new CSPacket(MainCmdID, SubCmdID, Body);
        pack.setSize();
        let buf = pack.toData();
        if (this.mWebSocket && this.mWebSocket.readyState === WebSocket.OPEN) {
            this.mWebSocket.send(buf.buffer);
        } else {
            console.log("ws is disconnect.  need to reconnect..." + " Send:" + MainCmdID + "_" + SubCmdID);
           
        }
    }
    
    private OnMessage(event) 
    {
        let head = new CSPacketHead();
        head.parseHead(event.data);
       
        let eventName = DataManager.getCmdEventName(head.wMainCmdID.value, head.wSubCmdID.value, DataManager.serverTypeStr);
        if (head.wMainCmdID.value == KN_CMD.MDM_KN_COMMAND) {
            if (head.wSubCmdID.value == KN_CMD.SUB_KN_DETECT_SOCKET) {
                this.SendCmd(KN_CMD.MDM_KN_COMMAND, KN_CMD.SUB_KN_DETECT_SOCKET);
            } else if (head.wSubCmdID.value == KN_CMD.SUB_KN_CLIENT_DETECT) {
            }
            return;
        } else if (head.wMainCmdID.value == KN_CMD.MDM_SOCKET_COMMAND) {
            if (head.wSubCmdID.value == KN_CMD.SUB_SOCKET_TOKEN_RES) {
                console.log(" this.ws.onmessage",head.wMainCmdID.value,head.wSubCmdID.value,event.data)
                var token = new KN_COMMAND.CMD_TokenRes();
                token.parse(event.data);
                console.log("token:" + token.Token.value);
                DataManager.gametoken = token.Token.value;
                var str = token.Token.value + this.DEF_KEY + token.Token.value + this.DEF_KEY + token.Token.value;
                var strmd5 = MD5.hex_md5(str);
                var MD5Cmd = new KN_COMMAND.CMD_MD5();
                MD5Cmd.MD5.value = strmd5;
                this.SendCmd(KN_CMD.MDM_SOCKET_COMMAND, KN_CMD.SUB_SOCKET_VERIFY_REQ, MD5Cmd);
                NetworkSend.Instance.enterRoom();
            }
            return;
        }else{
            console.log(" this.ws.onmessage",head.wMainCmdID.value,head.wSubCmdID.value,event.data)
            if(head.wMainCmdID.value == roomCmd.MDM_GR_LOGON && head.wSubCmdID.value == roomCmd.SUB_GR_LOGON_SUCCESS){
                let tdata = new roomCmd.CMD_GR_LogonByTPAccountResp();
                tdata.parse(event.data);
                DataManager.userId = tdata.userId.value;
                console.log("enterRoom userid",DataManager.userId);
            }
            else if(head.wMainCmdID.value == roomCmd.MDM_GR_INFO && head.wSubCmdID.value == roomCmd.SUB_GR_SERVER_INFO){
                let troominfo = new roomCmd.CMD_GR_ServerInfoV2();
                troominfo.parse(event.data);
                console.log("room",troominfo);
                DataManager.totalRoomInitCost = troominfo.tagCaiBetLevel.nBet.value
            }
            else if(head.wMainCmdID.value == roomCmd.MDM_GR_INFO && head.wSubCmdID.value == roomCmd.SUB_GR_CONFIG_FINISH){
                console.log("配置完成");
                //NetworkSend.Instance.autoSitDown();
            }
            else if (head.wMainCmdID.value == roomCmd.MDM_GR_LOGON && head.wSubCmdID.value == roomCmd.SUB_GR_LOGON_FINISH) {
                NetworkSend.Instance.autoSitDown();
            }
            else if(head.wMainCmdID.value == roomCmd.MDM_GR_USER && head.wSubCmdID.value == roomCmd.SUB_GR_USER_COME){
                let tuserinfo = new roomCmd.tagUserInfoHead();
                tuserinfo.parse(event.data);
                console.log("userinfo",tuserinfo);
                DataManager.tagUserInfoHead = tuserinfo;
            }else if(head.wMainCmdID.value == 10 && head.wSubCmdID.value == 101){
                
            }else if(head.wMainCmdID.value == roomCmd.MDM_GR_USER && head.wSubCmdID.value == roomCmd.SUB_GR_TABLE_STATUS){
                let tdata = new roomCmd.CMD_GR_TableStatus();
                tdata.parse(event.data);
                console.log("桌子状态信息",tdata);
                NetworkSend.Instance.ready();
                NetworkSend.Instance.sendGetGameInfo();
            }else if(head.wMainCmdID.value == roomCmd.MDM_GF_GAME && head.wSubCmdID.value == RoomSubCmd.SUB_S_GAME_END){
                let gameEnd = new mssCmd.CMD_S_GameEnd();
                gameEnd.parse(event.data);
                console.log("收到游戏结束消息: ", gameEnd);
                DataManager.norBetResp(gameEnd);
            }
            else if(head.wMainCmdID.value == roomCmd.MDM_GF_GAME && head.wSubCmdID.value == RoomSubCmd.SUB_S_GAME_END_END){
                DataManager.betResultComplete();
            }
            else if(head.wMainCmdID.value == roomCmd.MDM_GF_GAME && head.wSubCmdID.value == RoomSubCmd.SUB_S_BASE_HIGHT){
                // let tcmd = new mssCmd.Cmd_S_Base_Hight();
                // tcmd.parse(event.data);
                // console.log("下注返回错误",tcmd);
            }
            else if(head.wMainCmdID.value == roomCmd.MDM_GF_GAME && head.wSubCmdID.value == RoomSubCmd.SUB_S_GAME_ERR){
                let terr = new roomCmd.CMD_S_HandleError();
                terr.parse(event.data);
                console.log("下注返回错误",terr);
            }else if(head.wMainCmdID.value == roomCmd.MDM_GF_GAME && head.wSubCmdID.value == roomCmd.SUB_GR_TABLE_INFO){
               console.log("1111");
            }else if(head.wMainCmdID.value == roomCmd.MDM_GF_FRAME && head.wSubCmdID.value == roomCmd.SUB_GF_OPTION){
                let cmdData = new roomCmd.CMD_GF_Option();
                cmdData.parse(event.data);
                console.log("游戏当前状态",cmdData);
            }
            else if(head.wMainCmdID.value == roomCmd.MDM_GF_FRAME && head.wSubCmdID.value == roomCmd.SUB_GF_SCENE){
                var statusFree = new mssCmd.CMD_S_StatusFree();
                statusFree.parse(event.data);
                DataManager.CMD_S_StatusFree = statusFree;
                console.log("场景信息",statusFree);
            }
            else if(head.wMainCmdID.value == roomCmd.MDM_GF_FRAME && head.wSubCmdID.value == roomCmd.SUB_GF_BUY_FREE_INFO){
                var cmdData = new roomCmd.CMD_GF_BuyFreeInfo();
                cmdData.parse(event.data);
                console.log("游戏登录或者断线重连下发购买免费次数",cmdData);
            }
            else if(head.wMainCmdID.value == roomCmd.MDM_GF_FRAME && head.wSubCmdID.value == roomCmd.SUB_GF_SINGLEBET_INFO){
                var cmdData = new roomCmd.CMD_GF_SingleBetInfo();
                cmdData.parse(event.data);
                let filteredData = cmdData.sSingleBetInfo.filter(item => item.value !== 0).map(item => item.value / CmdLen.COIN_RATE);
                if (cmdData.sSingleBetInfo[0].value == -1) {
                    let heardLength = 2;  // 头部： [0]=-1 标识新bet配置   [1]= 当前携带有效数据的长度
                    let length = cmdData.sSingleBetInfo[1].value;
                    let arr = cmdData.sSingleBetInfo.filter((item, index) => index >= heardLength && index < length + heardLength)
                    filteredData = arr.map(item => item.value / CmdLen.COIN_RATE);
                }
               
                DataManager.betCfg = filteredData;
                console.log("新增的线配置",cmdData,filteredData);
            }
            else if(head.wMainCmdID.value == loginCMD.MDM_PP_LOGON && head.wSubCmdID.value == loginCMD.SUB_PP_LOGON_PSPT_LOGON_RES){
                let tlogindata = new loginCMD.CMD_PSPT_LoginOK();
                tlogindata.parse(event.data);
                console.log("登录成功",tlogindata);
            }else if(head.wMainCmdID.value == loginCMD.MDM_PP_LOGON && head.wSubCmdID.value == loginCMD.SUB_PP_LOGON_ERROR){
                var loginError = new loginCMD.CMD_PSPT_LoginError();
                loginError.parse(event.data);
                console.log("登录fail",loginError);
             }
           
        }
      
        EventCenter.getIns().emit(eventName, [head.wMainCmdID.value, head.wSubCmdID.value, event.data, event.data.byteLength - 8]);
    }

   

    private OnConnectTimeOut() {
        console.log("OnConnectTimeOut");
        if (this.mWebSocket.readyState === WebSocket.OPEN) 
        {
        } 
        else 
        {
            this.ClearWS(false);
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////
    /////                               心跳
    ////////////////////////////////////////////////////////////////////////////////////
    public SendPing() {
        // this.StopPing();
        // clearTimeout(this.mPingSendTimer);
        // this.mPingRevTimer = setTimeout(this.OnPingTimeOut.bind(this), this.mPingSpace);
        // let msg = new C2SHeartbeatPing();
        // this.SendMsg(MessageId.C2S_HeartbeatPing , C2SHeartbeatPing.encode(msg).finish());
        //console.log('发送 心跳');
    }

    private RecvPing() {
        //console.log('收到 心跳');
        // clearTimeout(this.mPingRevTimer);
        // this.mPingSendTimer = setTimeout(this.SendPing.bind(this), this.mPingSpace);
    }

    private StopPing() {
        clearTimeout(this.mPingRevTimer);
        clearTimeout(this.mPingSendTimer);
    }

    private OnPingTimeOut() {
        console.log('心跳超时');
        this.ClearWS(false);
    }


}


