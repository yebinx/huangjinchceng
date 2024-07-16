import { _decorator, Button, Component, Label, Node, Sprite, UIOpacity } from 'cc';
import { ButtonEx } from '../lib/button/ButtonEx';
import { Action } from '../action';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
const { ccclass, property } = _decorator;

// 提示弹框

@ccclass('SharedNoticeBox')
export class SharedNoticeBox extends Component {
    @property({type:UIOpacity})
    spGrayBg:UIOpacity;

    @property({type:UIOpacity})
    ndRoot:UIOpacity;

    @property({type:Label})
    lbTitle:Label // 标题

    @property({type:Label})
    lbContent:Label // 提示内容

    @property({type:Button})
    btnLeft:Button // 左边按钮

    @property({type:Button})
    btnRight:Button // 右边按钮

    @property({type:Label})
    lbLeftBtnTitle:Label // 左边按钮标题

    @property({type:Label})
    lbRightBtnTitle:Label // 右边按钮标题

    private clickLeft: Function = null;
    private clickRight: Function = null;


    protected onLoad(): void {
        // this.node.on(EventAfter.START_AFTER, this.startAfter, this);
        this.ndRoot.node.active = false;
        this.ndRoot.opacity = 0;
        this.spGrayBg.opacity = 0;
    }

    protected start(): void {
        this.btnLeft = ButtonEx.replaceColorButton(this.btnLeft);
        this.btnRight = ButtonEx.replaceColorButton(this.btnRight);

        Action.grayLayerFadeInOpacity(this.spGrayBg.node, 0.1, ()=>{
            this.ndRoot.node.active = true;
            Action.showScale(this.ndRoot.node)
            Action.grayLayerFadeInOpacity(this.ndRoot.node)
        })
    }

    private startAfter(){
    }

    setInfo(title:string, content:string, leftBtnName:string, rightBtnName:string){
        this.lbTitle.string = title;
        this.lbContent.string = content;
        this.lbLeftBtnTitle.string = leftBtnName;
        this.lbRightBtnTitle.string = rightBtnName;
    }

    setContent(content:string){
        this.lbContent.string = content;
    }

    setClickCallback(left:Function, right:Function) {
        this.clickLeft = left;
        this.clickRight = right;
    }

    // 只显示确定按钮
    showSuccess(){
        this.btnRight.node.active = false;
        this.lbLeftBtnTitle.string = l10n.t("shared_btn_success");
    }

    private onBtnLeft(){
        if (this.clickLeft){
            this.clickLeft()
        }
        this.close();
    }

    private onBtnRight(){
        if (this.clickRight){
            this.clickRight()
        }
        this.close();
    }

    private close(){
        this.ndRoot.node.active = false;
        Action.grayLayerFadeOutOpacity(this.spGrayBg.node, 0.1, ()=>{
            this.node.destroy()
        })
    }
}



