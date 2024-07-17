import { SCORE_MULTIPLE } from "../../../goldencity/script/config/game_config";

export default class BetinfoEle{
    public betid:number=0;
    public betsize:number=0;
    public betmultiple:number=1;
    public betbase:number=20;
    constructor(id:number,size:number,multiple,base:number){
        this.betid=id;
        this.betsize=size*SCORE_MULTIPLE;
        this.betmultiple=multiple;
        this.betbase=base;
    }
}