import { _decorator, Component, Animation } from 'cc';
const { ccclass, property } = _decorator;

// 按顺序播放动画
export class AnimationEx  {
    static playSequence(animation:Animation, start:string, end:string, callback:any=null){
        animation.play(start)
        animation.on(Animation.EventType.FINISHED, ()=>{
            animation.play(end)
            if (callback){
                callback()
            }
        }, null);
    }
}


