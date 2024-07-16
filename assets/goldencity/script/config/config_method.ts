import { IconDefine, IconFrame, IconGrid } from "../../proto/base";
import { COLUMN_LAST_IDX, MultipleBonus, MultipleNormal, SCATTER_BONUS_FREE_TIMES, SCATTER_BONUS_FREE_TIMES_EXTRA, SCATTER_BONUS_NEED, SYMBOL_RATE } from "./game_config";

// 游戏 静态方法
export class ConfigMethod{
   // 获取默认图标排列
   static getDefaultSymbol(){
        return [
            [IconDefine.REDMASK, IconDefine.WILD, IconDefine.GOLDMASK, IconDefine.TOTEM1],
            [IconDefine.TOTEM4, IconDefine.QUEEN, IconDefine.SCATTER, IconDefine.TOTEM1, IconDefine.ACE],
            [IconDefine.REDMASK + IconFrame.SILVERFRAME + IconGrid.SPACE2, IconDefine.GOLDMASK + IconFrame.GOLDFRAME + IconGrid.SPACE3],
            [IconDefine.QUEEN, IconDefine.JACK, IconDefine.TOTEM3, IconDefine.WILD, IconDefine.WILD],
            [IconDefine.TOTEM4, IconDefine.TOTEM4, IconDefine.TEN, IconDefine.KING, IconDefine.WILD],
            [IconDefine.TOTEM2 + IconFrame.GOLDFRAME + IconGrid.SPACE2, IconDefine.WILD, IconDefine.TOTEM1 + IconFrame.SILVERFRAME + IconGrid.SPACE2],
            [IconDefine.TOTEM3, IconDefine.JACK, IconDefine.SCATTER, IconDefine.TOTEM2, IconDefine.TEN],
        ]
   }

   // 获取符号赔率
    static getSymbolRate(itemType: number, count: number){
        if (itemType == IconDefine.SCATTER){
            if (count < SCATTER_BONUS_NEED){
                return 0
            }

            return SCATTER_BONUS_FREE_TIMES + SCATTER_BONUS_FREE_TIMES_EXTRA;
        }

        let len = SYMBOL_RATE[itemType].num.length;
        let rate = 0;
        for(let i=0; i<len; i++){
            if (SYMBOL_RATE[itemType].num[i] == count){
                rate = SYMBOL_RATE[itemType].rate[i]
                break
            }
        }
        return rate
    }

   // 符号配置
    static getSymbolConfig(itemType:number):{num:number[], rate:number[]}{
        return SYMBOL_RATE[itemType]
    }

   // 游戏倍数
    static getMultiple(bonus:boolean){
        if (bonus){
            return MultipleBonus;
        }

        return MultipleNormal;
    }

    // 符号解码
    static decodeItemType(_itemType: number){
        let frameType = Math.floor(_itemType / IconFrame.SILVERFRAME);
        let space = Math.floor((_itemType % IconFrame.SILVERFRAME) / IconGrid.SPACEBASE);
        if (space == 0){
            space = 1;
        }
        let itemType = _itemType % IconGrid.SPACEBASE;

        return {frameType, space, itemType}
    }

    // 计算多少中奖线
    static getLines(szItem: number[][], range: number){
        let totalLine = 1;
        for (let i=1; i<range; i++){
            if (i >= 2 && i < COLUMN_LAST_IDX){
                totalLine *= (szItem[i].length + 1);
            }else{
                totalLine *= szItem[i].length;
            }
            
        }
        return totalLine;
    }
}


