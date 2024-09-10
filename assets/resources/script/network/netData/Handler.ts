export default class Handler{
    private mCall:Function;
    private mCaller:any;
    private mParams:Array<any>=[];
    private mIsOnce:boolean=false;
    constructor(func:Function,caller:any,args:Array<any>=[],isOnce:boolean=false){
        this.mCall=func;
        this.mCaller=caller;
        this.mParams=args;
        this.mIsOnce=isOnce;
    }

    public run(){
        this.mCall.apply(this.mCaller,this.mParams)
    }

    public runWith(args:Array<any>){
        let targs = args.concat(this.mParams);
        this.mCall.apply(this.mCaller, targs);
    }

    public get isOnce(){
        return this.mIsOnce;
    }
}