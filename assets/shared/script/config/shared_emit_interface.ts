export interface I_EMIT_SCORE_GET {
    score: number, // 更新得分
    action: boolean, // 是否播放动画
    duration?: number, // 滚动时间
}

export interface I_EMIT_SCORE_BET{
    totalBet?: string; // 总投注
    isChange?: boolean; // 数字是否变化
    isAction?: boolean; // 是否播放动画
}