import { _decorator, Component, instantiate, Label, Layout, Node, UIOpacity, UITransform, Vec3, Widget } from 'cc';
import Cell from '../roll/cell';
import { L10nLabel } from '../../../../extensions/localization-editor/static/assets/l10n';
import { SYMBOL_RATE } from '../config/game_config';
import { ConfigMethod } from '../config/config_method';
import { IconDefine } from '../../proto/base';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
import { Action } from '../../../shared/script/action';
const { ccclass, property } = _decorator;

// 符号信息提示层

// 格子所占用空间
const HEIGHT = [126 ,230, 338, 440]
const WIDTH = [307, 523]

const SPACE_IDX1 = 0
const SPACE_IDX2 = 1
const SPACE_IDX3 = 2
const SPACE_IDX4 = 3

@ccclass('SymbolInfo')
export class SymbolInfo extends Component {
    @property({type:UIOpacity})
    spGrayBg:UIOpacity;

    @property({type:Node})
    spBg:Node // 底框

    @property({type:[Node]})
    szNdSpace:Node[] = [];

    @property({type:Layout})
    ndContent:Layout

    @property({type:Cell})
    cellLeft:Cell // 左边图标

    @property({type:Cell})
    cellRight:Cell // 右边图标

    @property({type:[Label]})
    szLbSymbolNum:Label[] = [] // 符号个数，从小到大

    @property({type:[Label]})
    szLbSymbolRate:Label[] = [] // 符号赔率，从小到大

    @property({type:L10nLabel})
    lbSymbolInfo:L10nLabel // 符号信息

    private currCell:Cell = null;
    private closeCallback: ()=>void;
    private isDestroy: boolean = false;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(SymbolInfo)
    }

    protected onLoad(): void {
        this.reset()
    }

    protected start(): void {
        // this.test()
        // this.scheduleOnce(, 0.1)
        this.spGrayBg.opacity = 0;
        Action.grayLayerFadeInOpacity(this.spGrayBg.node)
    }

    setCloseCallback(cb: ()=>void){
        this.closeCallback = cb;
    }

    /**
     * 更新符号信息
     * @param itemType 
     * @param col 0~4
     * @returns 
     */
    setSymbol(_itemType: number, col:number){
        this.reset()
        if (col >= 4){ // 显示在左边
            this.currCell = this.cellRight;
        }else{
            this.currCell = this.cellLeft;
        }

        this.currCell.node.active = true;
        let {frameType, space, itemType} = ConfigMethod.decodeItemType(_itemType);
        this.currCell.setOffsetPoint(col == 0);
        this.currCell.setSymbol(_itemType, frameType, space, itemType, false);
        if (itemType == IconDefine.WILD || itemType == IconDefine.SCATTER){ // 百搭和夺宝
            if (col >= 4){ // 显示在左边
                this.szNdSpace[SPACE_IDX2].active = true;
                this.szNdSpace[SPACE_IDX3].active = true;
                this.szNdSpace[SPACE_IDX4].active = true;
            }else{
                this.szNdSpace[SPACE_IDX1].active = true;
            }

            NodeEx.setSize(this.spBg, WIDTH[1], HEIGHT[space-1]);
            this.lbSymbolInfo.node.active = true;
            this.lbSymbolInfo.key =  itemType == IconDefine.WILD ? "symbol_wild_info" : "ScatterDescription";
            return 
        }else{
            if (col >= 4){ // 显示在左边
                this.szNdSpace[SPACE_IDX1].active = true;
                this.szNdSpace[SPACE_IDX2].active = true;
                this.szNdSpace[SPACE_IDX3].active = true;
            }else{
                this.szNdSpace[SPACE_IDX1].active = true;
            }

            NodeEx.setSize(this.spBg, WIDTH[0], HEIGHT[space-1]);
            let symbolRateInfo = SYMBOL_RATE[itemType] as {num:number[], rate:number[]};
            for (let i=0, len=this.szLbSymbolNum.length; i<len; i++){
                this.szLbSymbolNum[i].string = `${symbolRateInfo.num[i]}`;
                this.szLbSymbolRate[i].string = `${symbolRateInfo.rate[i]}`;
            }
    
            this.szLbSymbolNum[0].node.parent.active = true;
            this.szLbSymbolRate[0].node.parent.active = true;
        }
    }

    // 调整bg的位置
    setPoint(symbolWorldPos: Vec3){
        this.ndContent.updateLayout();
        let cellSize = this.currCell.getSize();
        this.currCell.resetPoint();
        NodeEx.setSize(this.currCell.node, cellSize.width, cellSize.height);
        this.currCell.getComponent(Widget).updateAlignment();

        let showSymbolWorldPos = this.currCell.getSymbolWorldPoint(Vec3.ZERO);

        let uiTransform = this.spBg.parent.getComponent(UITransform);
        let srcPos = uiTransform.convertToNodeSpaceAR(symbolWorldPos);
        let dstPos = uiTransform.convertToNodeSpaceAR(showSymbolWorldPos);

        let offsetPos = new Vec3();
        Vec3.subtract(offsetPos, srcPos, dstPos);
        offsetPos.y += 5;// 往上偏移几个像素，会又弹起的效果
        let newPos = new Vec3();
        Vec3.add(newPos, this.spBg.position, offsetPos);
        this.spBg.position = newPos;
    }

    destroySelf(){
        if (this.isDestroy){
            return 
        }
        
        this.isDestroy = true;
        this.spBg.destroy(); // 底框提升图层被放到其他节点上了
        Action.grayLayerFadeOutOpacity(this.spGrayBg.node, null, ()=>{
            this.node.destroy(); 
        })

        if (this.closeCallback){
            this.closeCallback();
        }
    }

    // 提升图层，灰色层在框下，图标要在框上
    promoteInfoUiOrder(newParent: Node){
        this.spBg.parent = newParent
    }

    private reset(){
        this.cellLeft.node.active = false;
        this.cellRight.node.active = false;
        this.szLbSymbolNum[0].node.parent.active = false;
        this.szLbSymbolRate[0].node.parent.active = false;
        this.lbSymbolInfo.node.active = false;
        this.szNdSpace.forEach((node)=>{
            node.active = false;
        })
    }
    
    private onBtnClose(){
        this.destroySelf()
    }


    // test(){
    //     this.setSymbol(TItemtype.ITEM_TYPE_SCATTER, 4)
    // }
}


