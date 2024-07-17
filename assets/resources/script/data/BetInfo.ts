import BetinfoEle from "./BetinfoEle";

export default class BetInfo{
    public betinfo:Array<BetinfoEle>=[];
    public betadjust=[];
    public defaultbetid:number=10;
    public buyfreebetid=[];
    public betmultipleTypes=[300,1000,10000,25000,50000];
    public betmultipleLv=10;
    public base:number=20;
    constructor(){
       this.setBetmultipleTypes();
        this.betadjust = [
            1,
            2,
            3,
            11,
            5,
            10,
            15,
            20,
            31,
            25,
            30,
            40,
            46,
            48,
            50
        ]
        for(let i=1;i<=22;i++){
            this.buyfreebetid.push(i);
        }
    }

    public setBetmultipleTypes(types=null){
        this.betinfo=[];
        if(types)this.betmultipleTypes=types;
        let ttypes = this.betmultipleTypes;
        let tbetid=0;
        for(let i=0;i<ttypes.length;i++){
            for(let h=1;h<=this.betmultipleLv;h++){
                tbetid++;
                let tele  = new BetinfoEle(tbetid,ttypes[i],h,this.base);
                this.betinfo.push(tele);
            }
        }
    }
}