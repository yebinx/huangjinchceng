import { Sprite, Vec3, tween, Node, UIOpacity } from "cc";
import { TweenEx } from "./lib/TweenEx";

export class Action  {
    static grayLayerFadeIn(grayBg:Sprite, duration ?: number, callback?:()=>void){
        TweenEx.FadeIn(grayBg, duration ? duration: 0.13, "quadInOut", callback).start();
    }

    static grayLayerFadeInOpacity(grayBg:Node, duration ?: number, callback?:()=>void){
        TweenEx.FadeInOpacity(grayBg, duration ? duration: 0.13, "quadInOut", null, callback)
        .start()
    }
    // static grayLayerFadeInRecursion(grayBg:Sprite, callback?:()=>void){
    //     TweenEx.FadeInRecursion(grayBg, 0.13, callback)
    // }

    static grayLayerFadeOut(grayBg:Sprite, duration ?: number,  callback?:()=>void){
        TweenEx.FadeOut(grayBg,  duration ? duration: 0.13, "quadInOut", callback).start();
    }

    static grayLayerFadeOutOpacity(grayBg:Node, duration ?: number,  callback?:()=>void){
        TweenEx.FadeOutOpacity(grayBg,  duration ? duration: 0.13, "quadInOut", callback).start();
    }

    static showScale(grayBg:Node,  duration ?: number,){
        if (!duration){
            duration = 0.13;
        }
        
        TweenEx.ScaleBounce(grayBg, Vec3.ONE.clone(), 0.2, duration/2, 0)
        .start()
    }  
}