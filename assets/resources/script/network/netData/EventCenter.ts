
import Handler from "./Handler";

/**author:yebinx email:yebinx@21cm.com*/
export default class EventCenter{
    private static _ins:EventCenter;
    private _listeners;
    constructor(){
        this._listeners = {}; 
        
    }

     // 注册事件监听器
    public on(eventName, listener,caller:any) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(new Handler(listener,caller));
    }

    public once(eventName, listener,caller:any){
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(new Handler(listener,caller,[],true));
    }

    // 移除事件监听器
    public off(eventName, listener,caller:any) {
        let tarr = this._listeners[eventName];
        if (tarr) {
            for(let i=tarr.length-1;i>=0;i--){
                if(tarr[i].call == listener && tarr[i],caller == caller){
                    tarr.splice(i, 1);
                }
            }
        }
    }

    // 触发事件
    public emit(eventName, args:Array<any>=[]) {
        const listeners = this._listeners[eventName];
        if (listeners) {
            let thand:Handler;
            for(let i=listeners.length-1;i>=0;i--){
                thand = listeners[i];
                thand.runWith(args)
                if(thand.isOnce){
                    listeners.splice(i,1);
                }
            }
        }
    }

    public static getIns():EventCenter{
        if(!this._ins)this._ins=new EventCenter();
        return this._ins;
    }
}