import { _decorator, Button, Component, Node } from 'cc';
import { ButtonEx } from './ButtonEx';
const { ccclass, property } = _decorator;

// 将按钮的颜色变成默认规则

@ccclass('ButtonDefaultColor')
export class ButtonDefaultColor extends Component {
    @property({type:[Button], displayName:"点击变暗"})
    defaultColorButtonList:Button[] = [];

    @property({type:[Button], displayName:"点击变暗，所有节点"})
    replaceButtonColorList:Button[] = [];

    @property({type:[Button], displayName:"点击变透明,禁用也透明"})
    touOpacityButtonList:Button[] = [];

    @property({type:[Button], displayName:"点击变透明,只有点击透明"})
    clickOpacityButtonList:Button[] = [];

    @property({type:[Button], displayName:"点击缩放"})
    touchScaleButtonList:Button[] = [];

    onLoad() {
        this.defaultColorButtonList.forEach((btn:Button)=>{
            ButtonEx.replaceButtonDefaultColor(btn);
        })

        this.replaceButtonColorList.forEach((btn:Button)=>{
            ButtonEx.replaceColorButton(btn);
        })

        this.touOpacityButtonList.forEach((btn:Button)=>{
            ButtonEx.replaceButtonOpacity(btn, 0.5, true);
        })

        this.clickOpacityButtonList.forEach((btn:Button)=>{
            ButtonEx.replaceButtonOpacity(btn, 0.5, false);
        })

        this.touchScaleButtonList.forEach((btn:Button)=>{
            ButtonEx.replaceButtonDefaultScale(btn, 0.9);
        })
    }

    protected start(): void {
        this.destroy();
    }
}


