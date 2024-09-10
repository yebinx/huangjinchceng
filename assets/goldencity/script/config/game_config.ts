import { IconDefine } from "../../proto/base";

//--------------------------------------------------------------------------------------------
export const SYMBOL_RATE = { // 符号赔率
    [IconDefine.GOLDMASK]:{num:[3, 4, 5, 6], rate:[30, 40, 60, 80]},
    [IconDefine.REDMASK]:{num:[3, 4, 5, 6], rate:[20, 25, 50, 70]},
    [IconDefine.TOTEM1]:{num:[3, 4, 5, 6], rate:[10, 25, 40, 60]},
    [IconDefine.TOTEM2]:{num:[3, 4, 5, 6], rate:[8, 15, 20, 30]},
    [IconDefine.TOTEM3]:{num:[3, 4, 5, 6], rate:[6, 10, 12, 15]},
    [IconDefine.TOTEM4]:{num:[3, 4, 5, 6], rate:[6, 10, 12, 15]},
    [IconDefine.ACE]:{num:[3, 4, 5, 6], rate:[4, 6, 8, 10]},
    [IconDefine.KING]:{num:[3, 4, 5, 6], rate:[4, 6, 8, 10]},
    [IconDefine.QUEEN]:{num:[3, 4, 5, 6], rate:[1, 2, 3, 4]},
    [IconDefine.JACK]:{num:[3, 4, 5, 6], rate:[1, 2, 3, 4]},
    [IconDefine.TEN]:{num:[3, 4, 5, 6], rate:[1, 2, 3, 4]},
}

export const SCORE_MULTIPLE = 1000; // 金币放大几倍
export const COLUMN_COUNT = 7 // 几列, 0~7 ,0是横轴
export const TOTAL_LINE = 20; // 总线数
export const COLUMN_HORIZONTAL = 0; // 横轴idx
export const COLUMN_LAST_IDX = 6; // 最后一轴idx
export const SCATTER_BONUS_NEED = 4; // 几个scatter才会触发夺宝
export const SCATTER_BONUS_FREE_TIMES = 10; // 夺宝免费次数
export const SCATTER_BONUS_FREE_TIMES_EXTRA = 2; // 每多一次夺宝，多几次免费次数

// 倍数
export const MultipleNormal = 1;
export const MultipleBonus = 2;


export const BONUS_BUY_MULTIPLE = 50; // 免费游戏购买所需的倍数


export const NORMAL_START_SCROLL_INTERVAL = 0.15; // 各轴开始滚动时间间隔
export const NORMAL_STOP_SCROLL_INTERVAL = 0.15; // 各轴开始停止时间间隔
export const TURBO_MODE_SPEED_FACTOR = 1.1; // bonus游戏滚动速度倍率