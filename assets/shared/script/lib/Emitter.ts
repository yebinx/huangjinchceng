// 观察者
interface handler {
    target: object
    fun:Function
}

export class Emitter {
    private _callbacks: Map<string, handler[]> = new Map<string, handler[]>()

    addEventListener(event: string, fun: Function, target: Object) {
        // if (target == null){
        //     console.error("addEventListener")
        // }
    
        let events = this._callbacks.get(event)
        if (events) {
            events.push({target:target, fun:fun})
        } else {
            this._callbacks.set(event, [{target:target, fun:fun}]) 
        }
    }

    removeEventListener(event: string, fun: Function, target: Object) {
        if (!fun) {
            this._callbacks.delete(event);
        } else {
            let callbacks: handler[] = this._callbacks.get(event);
            if (!callbacks) {
                return
            }

            let cb: handler;
            for (let i = 0; i < callbacks.length; i++) {
                cb = callbacks[i];
                if (cb.fun === fun && cb.target === target) {
                    callbacks.splice(i, 1);
                    break;
                }
            }
        }
    }

    removeEventByTarget(target: Object){
        this._callbacks.forEach((v, k)=>{
            let cb: handler;
            for (let i = 0; i < v.length; ) {
                cb = v[i];
                if (cb.target === target) {
                    v.splice(i, 1);
                }else{
                    i++
                }
            }
        })
    }

    emit(event: string, ...args): boolean {
        let callbacks: handler[] = this._callbacks.get(event);
        if (!callbacks) {
            return false
        }

        let cb: handler;
        for (var i = 0, len = callbacks.length; i < len; ++i) {
            cb = callbacks[i];
            cb.fun.apply(cb.target, args);
        }
        return true
    }
}