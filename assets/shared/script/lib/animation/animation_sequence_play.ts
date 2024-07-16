import { _decorator, Component, Animation, CCBoolean } from 'cc';
const { ccclass, property } = _decorator;

// 按顺序播放动画
@ccclass('AnimationSequencePlay')
export class AnimationSequencePlay extends Component {
    @property({type:Animation})
    animation:Animation;

    @property({type:CCBoolean})
    autoDestroy:boolean; // 播放完毕是否自动删除

    private clipIdx: number = 0;

    protected onLoad(): void {
        this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    start() {
        let name = this.getClipsName(this.clipIdx++);
        if (name == null){
            return;
        }
        
        this.animation.play(name);
    }

    private onFinished(){
        let name = this.getClipsName(this.clipIdx++);
        if (name == null){
            return;
        }
        
        this.animation.play(name);
    }

    private getClipsName(idx: number): string{
        let clips = this.animation.clips;
        if (idx < clips.length){
            return clips[idx].name;
        }
        return null;
    }
}


