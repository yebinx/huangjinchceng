import { _decorator, Component, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FreeWin')
export class FreeWin extends Component {
    @property({type:Animation})
    freeWin:Animation;

    protected onLoad(): void {
        this.freeWin.on(Animation.EventType.FINISHED, this.onLastFrame, this);
    }

    start() {
        this.freeWin.play("free_win1")
    }

    private onLastFrame(){
        this.freeWin.play("free_win2")
        // console.log("LastFrame")
    }
}


