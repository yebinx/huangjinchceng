import { Label, TweenEasing, misc, tween } from "cc";

export class MoneyUtil {
    static  Format(num:number) {
        let str = num.toFixed(2).toString();
        let parts = str.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }    

    static lerp = function (a, b, r) {
        return a + (b - a) * r;
    };

    static RunScoreAction(lb:Label, duration: number, from: number, to: number, easing:TweenEasing, callback?: (lb:Label)=>void){
        let obj = {value: from}
        let t = tween(obj)
        .to(duration, {value:to},{
            progress: (start: number, end: number, current: number, ratio: number) => {
                // 根据进度比例应用缓动函数，计算中间值
                let progress = 1 - Math.cos(ratio * Math.PI * 0.5);
                let intermediateValue = MoneyUtil.lerp(start, end, progress);
                lb.string = this.Format(intermediateValue);
                return intermediateValue;
            },
            onComplete:(target)=>{
                lb.string = this.Format(to);
            },
            easing: easing,
        })
        
        if (callback != null){
            t.call(()=>{
                callback(lb);
            })
        }
        
        return t
    }
}

