export interface IConfig{
    // 获取基础投注，投注设置里的基础投注
    getBaseBet()
}

export interface IAudio {
    // 打开音效
    on()
    // 关闭音效
    off()
    // 音效是否打开
    isOn():boolean;

    playOpenMenu();
    playCloseMenu();
}

// 游戏和公用模块的数据适配
export interface IGame{
    // 是否空闲状态
    isGameFreeStatus():boolean;

    // 获取基础投注
    getBaseBet():number;

    // 获取投注大小
    getBaseBetList():number[];
    // 获取投注倍数
    getMultipleBetList(): number[];
    // 获取选中的投注大小idx
    getBaseBetIndex():number;
    // 设置选中的投注大小idx
    setBaseBetIndex(index: number);
    // 获取投注倍数idx
    getMultipleBetIndex():number;
    // 设置投注倍数idx
    setMultipleBetIndex(index: number);
    // 主界面增加投注按钮，增加投注等级
    addBetLevel(): boolean;
    // 主界面减少投注按钮,减少投注等级
    minusBetLevel(): boolean;
    // 是否已经是最大投注值
    isMaxBetLevel(): boolean;
    // 是否已经是最小投注值
    isMinBetLevel(): boolean;
    // 获取总投注, 投注大小*投注倍数*基础投注
    getTotalBet():number;
    // 获取玩家余额
    getBalance():number;
    // 获取本次旋转得分
    getSpinWin(): number;

    // 获取自动开始次数
    getAutoStartTimes(): number;
    // 设置自动开始次数
    setAutoStartTimes(times: number);


    // ------------------ui打开状态接口
    // 打开投注设置
    addBetSetting();
    cancelBetSetting();

    // 打开自动旋转设置
    addAutoSpinSetting()
    cancelAutoSpinSetting();

    // 打开钱包
    addMoneyBag();
    cancelMoneyBag();

    // 打开弹窗
    addPopBox();
    cancelPopBox();

    // 切换菜单
    addBtnList();
    cancelBtnList();
}

// 开始按钮动画名
export interface IStartButtonAniName {
    start: string; // 开始动画
    hover: string; // 呼吸动画
}

export interface IBottonStartAnimation{
    registerAnimationEvent();
    playStartAnimation();
    playHoverAnimation();
    // lastColumeDone 是否是最后一轴停止
    stopAnimation(lastColumeDone: boolean);
}
