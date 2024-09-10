import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

export class SpineEx {
   static play(spine:sp.Skeleton, startAni:string, lastAni:string, isLoop: boolean){
        spine.loop = false;
        spine.animation = startAni;

        spine.setCompleteListener((trackEntry: sp.spine.TrackEntry)=>{
            if (!lastAni){
                return;
            }
    
            spine.loop = isLoop;
            spine.animation = lastAni;
        })

        spine.setInterruptListener((trackEntry: sp.spine.TrackEntry)=>{
            if (trackEntry.animation.name != startAni){
                return 
            }
            lastAni = null;
        })
    }

    static playCallback(spine:sp.Skeleton, ani:string, complete: (spine:sp.Skeleton)=>void){
        spine.animation = ani;
        spine.setCompleteListener((trackEntry: sp.spine.TrackEntry)=>{
            if (trackEntry.animation.name != ani){
                return;
            }
            complete(spine)
        })
    }
}


