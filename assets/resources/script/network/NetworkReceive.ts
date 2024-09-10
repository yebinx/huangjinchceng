

import { Network } from "./Network";


export class NetworkReceive 
{
    public RegisterMsg()
    {

        // Network.Instance.AddMsgListenner(MessageId.S2C_Kick,(_data)=>
        // {
        //     UIMgr.Instance.ShowLoading(false);
        //     let msg = S2CKick.decode(_data);
        //     console.log("收到的内容 S2C_Kick 服务器踢人===" + JSON.stringify(msg));
        //     UIMgr.Instance.ShowToast(msg.result.resMessage);
        //     GameConfig.ClearToken();
        //     Network.Instance.ClearWS();
        //     UIMgr.Instance.ChangeScene(SceneType.Login);
        // },this);

    }

    public UnregisterMsg()
    {
        
    }
}


