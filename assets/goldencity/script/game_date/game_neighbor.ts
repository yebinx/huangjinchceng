export class GmaeNeighbor  {
    private left:boolean = false;
    private right:boolean = false;
    private top:boolean = false;
    private bottom:boolean = false;
    private self: boolean = false;

    addSelf() {this.self = true;}
    addLeft(){ this.left = true; }
    addRight(){ this.right = true; }
    addTop(){ this.top = true; }
    addBottom(){ this.bottom = true; }

    isLeft(){ return (!this.self && this.left); }
    isRight(){ return (!this.self && this.right); }
    isTop(){ return (!this.self && this.top); }
    isBottom(){ return (!this.self && this.bottom); }

    // dump(){
    //     let info = ""
    //     info = info + (this.self ? " 1 " : " 0 ");
    //     info = info + (this.top ? " 1 " : " 0 ");
    //     info = info + (this.bottom ? " 1 " : " 0 ");
    //     info = info + (this.left ? " 1 " : " 0 ");
    //     info = info + (this.right ? " 1 " : " 0 ");

    //     console.log(info)
    // }
}


