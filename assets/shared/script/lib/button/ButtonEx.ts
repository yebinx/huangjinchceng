import { _decorator, Button, Color, Sprite,  UIRenderer } from 'cc';
import { ButtonColor } from './button_color';
const { ccclass } = _decorator;

export class ButtonEx{
    // 禁用变透明
    static InteractableOpacity(btn: Button, enable: boolean, opacityPer=0.60){
        let component = btn.target.getComponent(Sprite);
        let newColor = new Color(component.color);
        newColor.a = enable ? 255 : 255 * opacityPer
        component.color = newColor;

        btn.interactable = enable;
    }

    // 把按钮转换成颜色按钮
    static replaceColorButton(oldBtn:Button, defaultColor:boolean=true): Button{
        let node = oldBtn.node;
        let btnColor = node.addComponent(ButtonColor);
        btnColor.target = oldBtn.target;
        btnColor.interactable = oldBtn.interactable;
        btnColor.transition = Button.Transition.COLOR;
        btnColor.clickEvents = oldBtn.clickEvents;

        if (btnColor.target.getComponent(UIRenderer)){
            btnColor.oldColor = btnColor.target.getComponent(UIRenderer).color.clone();
        }
        
        if (defaultColor){
            this.replaceButtonDefaultColor(btnColor);
        }else{
            btnColor.normalColor = oldBtn.normalColor;
            btnColor.pressedColor = oldBtn.pressedColor;
            btnColor.hoverColor = oldBtn.hoverColor;
            btnColor.disabledColor = oldBtn.disabledColor;
        }

        oldBtn.destroy();
        return btnColor;
    }

    // 点击变暗
    static replaceButtonDefaultColor(button:Button){
        button.transition = Button.Transition.COLOR;
        button.normalColor = Color.WHITE.clone();
        button.pressedColor = new Color(124, 124, 124, 255);
        button.hoverColor = Color.WHITE.clone();
        button.disabledColor = new Color(124, 124, 124, 255);
    }

    // 点击缩放，点击区域和图片不要在同个节点，否则可能会发生touchcancel
    static replaceButtonDefaultScale(button:Button, scale: number){
        button.transition = Button.Transition.SCALE;
        button.zoomScale = scale;
    }

    // 点击变透明
    static replaceButtonOpacity(button:Button, opacityPer: number, disabledColor: boolean){
        let normalColor = button.target.getComponent(UIRenderer).color.clone();
        let pressedColor = new Color(normalColor.r, normalColor.g, normalColor.b, normalColor.a * opacityPer);
        button.transition = Button.Transition.COLOR;
        button.normalColor = normalColor;
        button.pressedColor = pressedColor
        button.hoverColor = normalColor.clone();
        if (disabledColor){
            button.disabledColor = pressedColor.clone();
        }else{
            button.disabledColor = normalColor.clone();
        }
    }
}
