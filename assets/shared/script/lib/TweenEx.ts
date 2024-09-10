import { _decorator, Label, Node, sp, Sprite, Tween, tween, TweenEasing, UIOpacity, Vec3 } from 'cc';
import { NodeEx } from './NodeEx';

export class TweenEx {
    static DelayCall(nd:Node, delayTime:number, callbakc: ()=>void):Tween<Node>    {
        return tween(nd)
        .delay(delayTime)
        .call(()=>{if (callbakc) callbakc()})
        .start()
    }

    static CallNextFrame(nd:Node,  callbakc: ()=>void):Tween<Node>    {
        return tween(nd)
        .delay(0)
        .call(()=>{if (callbakc) callbakc()})
        .start()
    }

    static ScaleTo(nd:Node, from:Vec3|number, to:Vec3|number, duration:number, callbakc?: ()=>void):Tween<Node>{
        if (typeof(from) == "number"){
            from = new Vec3(from, from)
        }

        if (typeof(to) == "number"){
            to = new Vec3(to, to)
        }

        nd.setScale(from);
        let action = tween(nd)
        .to(duration, {scale: to})

        if(callbakc){
            action.call(()=>{if (callbakc) callbakc()})
        }
        return action
    }

    static ScaleBounce(nd:Node, normalScale: Vec3, byScale:number, halfDuration: number, Intervals:number, callbakc?: ()=>void){
        let from = normalScale;
        let action = tween(nd)
        .to(halfDuration, {scale: new Vec3(from.x + byScale, from.y + byScale, from.z)})

        if (Intervals > 0){
            action.delay(Intervals)
        }

        action.to(halfDuration, {scale: from})

        if(callbakc){
            action.call(()=>{if (callbakc) callbakc()})
        }
        return action
    }

    static FadeIn(nd:Sprite | Label | sp.Skeleton
        , delayTime:number, easing: TweenEasing, callbakc?: ()=>void):Tween<Node> {
        if (!nd["color"]){
            console.error("not has color attribute")
            return null
        }

        let oldColor = nd.color.clone();
        nd["__opacty"] = 0;

        let action = tween(nd as any)
        .to(delayTime,{__opacty: 255},{
            progress: (start: number, end: number, current: number, ratio: number) => {
                let a = Math.floor(start + ((end - start) * ratio));
                oldColor.a = a;
                nd.color = oldColor;
                return null
            },
            easing: easing ? easing: null,
        })

        if (callbakc){
            action.call(()=>{callbakc()})
        }
        return action;
    }

    static FadeInOpacity(nd:Node, delayTime:number, easing: TweenEasing, from: number=0, callbakc?: ()=>void):Tween<any> {
        let uiOpacity = nd.getComponent(UIOpacity);
        if (!uiOpacity){
            console.error("not has uiOpacity Component")
            return null
        }
       
        if (from != null){
            uiOpacity.opacity = from;
        }
        
        let action = tween(uiOpacity)
        .to(delayTime,{opacity: 255},{
            // progress: (start: number, end: number, current: number, ratio: number) => {
            //     uiOpacity.opacity = Math.floor(start + ((end - start) * ratio));
            //     return null
            // },
            easing: easing ? easing: null,
        })

        if (callbakc){
            action.call(()=>{callbakc()})
        }
        return action;
    }

    static FadeInRecursion(nd:Sprite | Label | sp.Skeleton
        , delayTime:number, callbakc?: ()=>void):Tween<Node> {
        if (!nd["color"]){
            console.error("not has color attribute")
            return null
        }

        let oldColor = nd.color.clone();
        nd["__opacty"] = 0;

        // let oldColor = new math.Color(nd.color.r, nd.color.g, nd.color.b, 0);
        // nd.color = new math.Color(oldColor.r, oldColor.g, oldColor.b, 0)
        let action = tween(nd as any)
        .to(delayTime,{__opacty: 255},{progress: (start: number, end: number, current: number, ratio: number) => {
            let a = Math.floor(start + (end - start) * ratio);
            oldColor.a = a;
            nd.color = oldColor;

            // nd.color = new math.Color(oldColor.r, oldColor.g, oldColor.b, a)
            NodeEx.recursionColor(nd.node, oldColor.clone())
            return null
        }})
        .delay(delayTime)
        .call(()=>{if (callbakc) callbakc()})
        return action;
    }

    static FadeOut(nd:Sprite | Label
        , delayTime:number, easing: TweenEasing, callbakc?: ()=>void, opacty:number = 0):Tween<Node> {
        if (!nd["color"]){
            console.error("not has color attribute")
            return null
        }
        let oldColor = nd.color.clone();
        // let c = {a:oldColor.a};
        // nd["__opacty"] = oldColor.a;
        nd["__opacty"] = oldColor.a;
        let action = tween(nd as any)
        .to(delayTime, {__opacty: opacty}, {
            progress: (start: number, end: number, current: number, ratio: number)=>{
                let a = Math.floor(start + ((end - start) * ratio));
                oldColor.a = a;
                nd.color = oldColor;
                return a
            },
            easing: easing ? easing: null,
        })
        
        if (callbakc){
            action.call(()=>{callbakc()})
        }

        return action;
    }

    static FadeOutOpacity(nd:Node, delayTime:number, easing: TweenEasing, callbakc?: ()=>void):Tween<any> {
        let uiOpacity = nd.getComponent(UIOpacity);
        if (!uiOpacity){
            console.error("not has uiOpacity Component")
            return null
        }
       
        let action = tween(uiOpacity)
        .to(delayTime,{opacity: 0},{
            // progress: (start: number, end: number, current: number, ratio: number) => {
            //     uiOpacity.opacity = Math.floor(start + ((end - start) * ratio));
            //     return null
            // },
            easing: easing ? easing: null,
        })

        if (callbakc){
            action.call(()=>{callbakc()})
        }
        return action;
    }

    static Score(lb:Label, duration: number, from: number, to: number, process: (lb:Label, currentNum:number)=>void, finishCallback?:()=>void){
        let obj = {value: from}
        let action = tween(obj)
        .to(duration, {value:to},{progress: (start: number, end: number, current: number, ratio: number) => {
            let v = start + ((end - start) * ratio)
            process(lb, v);
            return v;
        }})

        if (finishCallback != null){
            action.call(()=>{
                finishCallback();
            })
        }

       return action
    }
}

