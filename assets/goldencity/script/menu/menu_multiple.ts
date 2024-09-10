import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { MultipleBonus, MultipleNormal } from '../config/game_config';
import { ConfigMethod } from '../config/config_method';
const { ccclass, property } = _decorator;

@ccclass('MenuMultiple')
export class MenuMultiple extends Component {
    @property({type:[Label]})
    szLbMultipleNormal:Label[] = []

    @property({type:[Label]})
    szLbMultipleSelect:Label[] = []

    @property({type:Sprite})
    spMultipleBg:Sprite;

    @property({type:[SpriteFrame]})
    szSpMultipleBg:SpriteFrame[] = [] // 0.正常 1bonus

    private isFreeGame: boolean = false;
    private selectNode: Node = null;

    protected onLoad(): void {
        this.szLbMultipleSelect.forEach((v, k)=>{
            v.node.active = false
        })

        this.spMultipleBg.spriteFrame = this.szSpMultipleBg[0];
        this.resetNormalMultiple(MultipleNormal)
    }

    setMultiple(multiple:number, freeGame: boolean){
        if (this.selectNode){
            this.selectNode.active = false;
        }

        if (this.isFreeGame != freeGame){
            if (freeGame){
                this.spMultipleBg.spriteFrame = this.szSpMultipleBg[1];
                this.resetNormalMultiple(MultipleBonus) 
            }else{
                this.spMultipleBg.spriteFrame = this.szSpMultipleBg[0];
                this.resetNormalMultiple(MultipleNormal)
            }
            this.isFreeGame = freeGame;
        }
        
        let idx = ConfigMethod.getMultipleIdx(multiple, freeGame)
        this.selectNode = this.szLbMultipleSelect[idx].node;
        this.selectNode.active = true;
    }

    private resetNormalMultiple(szMultiple: number[] ){
        // let szMultiple = [1, 2, 3, 5]
        for (let i=0, len = szMultiple.length; i < len; i++){
            this.szLbMultipleNormal[i].string = `*${szMultiple[i]}`
            this.szLbMultipleSelect[i].string = `*${szMultiple[i]}`
        }
    }

}


