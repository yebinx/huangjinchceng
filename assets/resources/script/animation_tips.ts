import { _decorator, Component, Label, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationTips')
export class AnimationTips extends Component {
    @property({type:Animation})
    animationTips:Animation;

    @property({type:Label})
    lbInfo:Label;

    private szDate:string[] = [];
    private index: number = 0;

    protected onLoad(): void {
        this.animationTips.on(Animation.EventType.FINISHED, this.onEventFinished, this);
    }

    play(){
        let strData = window["l10n"].t("shared_AnimationTips") as string;
        this.szDate = strData.split("|") ;
        this.index = Math.ceil(Math.random() * 100) % this.szDate.length;
        this.playTips();
    }

    private playTips(){
        this.index++;
        this.lbInfo.string = this.szDate[this.index % this.szDate.length];
        this.animationTips.play();
    }

    private onEventFinished(){
       this.scheduleOnce(()=>{
        this.playTips()
       }, 0)
    }
}


