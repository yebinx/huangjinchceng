import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

// 加载提示

@ccclass('SharedLoading')
export class SharedLoading extends Component {
    @property({type:Button})
    btnClose:Button;

    @property({type:Node})
    loadingTips:Node; // loading动画

    @property({type:Node})
    ndErrorTips:Node;

    @property({type:Label})
    lbError:Label; // 错误信息

    private retryCallback:Function; // 重试
    private callback:Function;
    start() {
        this.ndErrorTips.active = false;
    }

    setCloseCallback(callback:Function) {
        this.callback = callback;
    }

    setRetryCallback(callback:Function) {
        this.retryCallback = callback;
    }

    showErrorMessage(msg:string){
        this.loadingTips.active = false;
        this.btnClose.node.active = false;
        this.ndErrorTips.active = true;

        this.lbError.string = msg;
    }

    showLoading(){
        this.loadingTips.active = true;
        this.btnClose.node.active = true;
        this.ndErrorTips.active = false;
    }

    private onBtnClose(){
        this.node.destroy();
        if (this.callback){
            this.callback()
        }
    }

    private onBtnRetry(){
        if (this.retryCallback){
            this.retryCallback()
        }
    }
}


