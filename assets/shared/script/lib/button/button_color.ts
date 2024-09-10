import { _decorator, Button, Color,  UIRenderer } from 'cc';
import { NodeEx } from '../NodeEx';
const { ccclass } = _decorator;

// 点击按钮包含子节点都变色
@ccclass('ButtonColor')
export class ButtonColor extends Button {
    oldColor:Color = new Color(0, 0, 0, 0);

    public onEnable () {
        super.onEnable();
        
        let color = this.target.getComponent(UIRenderer).color;
        if (this.oldColor.equals(color)){
            return;
        }
        this.oldColor = color.clone();
        NodeEx.recursionColor(this.node, color);
    }

    public get interactable () {
        return this._interactable;
    }

    public set interactable (value: boolean) {
        // super.interactable(value);
        // ----引擎代码start 不能override的只能拷贝引擎逻辑
        if (this._interactable === value) {
            return;
        }

        this._interactable = value;
        this._updateState();

        if (!this._interactable) {
            this._resetState();
        }
        // ----引擎代码 end

        let color = this.target.getComponent(UIRenderer).color;
        if (this.oldColor.equals(color)){
            return;
        }
        this.oldColor = color.clone();
        NodeEx.recursionColor(this.node, color);
    }

    // 变化颜色有过度
    public update (dt: number) {
        const target = this.target;
        if ((this as any)._transitionFinished || !target) {
            return;
        }
        // console.log("oldColor" + oldColor.toString())
        super.update(dt);
        let color = target.getComponent(UIRenderer).color;
        // console.log("color" + color.toString())
        if (this.oldColor.equals(color)){
            return;
        }
        this.oldColor = color.clone();
        NodeEx.recursionColor(this.node, color);
        // console.log("变色")
    }
}
