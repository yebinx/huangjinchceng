
// 打开ui页面
enum OpenUiType{
    INIT = 0,
    BUY_BONUS = 1 << 0, // 购买免费游戏
    BTN_LIST = 1 << 1, // 菜单按钮
    MONEY_BAG = 1 << 2, // 钱包
    BET_SETTING = 1 << 3, // 投注设置
    RECORD = 1 << 4, // 记录
    AUTO_SPIN_SETTING = 1 << 5, // 自动旋转
    RATE = 1 << 6, // 赔付表规则
    RULE = 1 << 7, // 规则
    EXIT = 1 << 8, // 退出弹窗
    POP_BOX = 1 << 16, // 弹窗
}

export class GameOpenUiStatus{
   private flg: number = 0;
   private popBoxCount: number = 0; // 弹窗数量

   isOpenUi(){return this.flg != OpenUiType.INIT || this.popBoxCount > 0;}
   isOpenBtnList() {return ((this.flg & OpenUiType.BTN_LIST) == OpenUiType.BTN_LIST);}

   addBuyBonus(){ this.flg |= OpenUiType.BUY_BONUS; }
   addBtnList(){ this.flg |= OpenUiType.BTN_LIST; }
   addMoneyBag(){ this.flg |= OpenUiType.MONEY_BAG; }
   addBetSetting(){ this.flg |= OpenUiType.BET_SETTING; }
   addRecord(){ this.flg |= OpenUiType.RECORD; }
   addAutoSpinSetting(){ this.flg |= OpenUiType.AUTO_SPIN_SETTING; }
   addRate(){ this.flg |= OpenUiType.RATE; }
   addRule(){ this.flg |= OpenUiType.RULE; }
   addExit(){ this.flg |= OpenUiType.EXIT; }
   addPopBox(){ this.popBoxCount++; }

   cancelBuyBonus(){ this.flg = this.flg & (0xffffffff - OpenUiType.BUY_BONUS); }
   cancelBtnList(){ this.flg = this.flg & (0xffffffff - OpenUiType.BTN_LIST); }
   cancelMoneyBag(){ this.flg = this.flg & (0xffffffff - OpenUiType.MONEY_BAG); }
   cancelBetSetting(){ this.flg = this.flg & (0xffffffff - OpenUiType.BET_SETTING); }
   cancelRecord(){ this.flg = this.flg & (0xffffffff - OpenUiType.RECORD); }
   cancelAutoSpinSetting(){ this.flg = this.flg & (0xffffffff - OpenUiType.AUTO_SPIN_SETTING); }
   cancelRate(){ this.flg = this.flg & (0xffffffff - OpenUiType.RATE); }
   cancelRule(){ this.flg = this.flg & (0xffffffff - OpenUiType.RULE); }
   cancelExit(){ this.flg = this.flg & (0xffffffff - OpenUiType.EXIT); }
   cancelPopBox(){ this.popBoxCount--;; }
}


