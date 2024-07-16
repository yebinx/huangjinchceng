import { _decorator, Button, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonState')
export class ButtonState extends Button {

    protected onLoad(): void {
        this.transition = Button.Transition.COLOR;
    }

    _updateColorTransition(state: string): void{
        this.node.emit(this._getButtonState(), this);
    }

    _updateSpriteTransition(state: string): void{
        this.node.emit(this._getButtonState(), this);
    }

    _updateScaleTransition(state: string): void{
        this.node.emit(this._getButtonState(), this);
    }
}
