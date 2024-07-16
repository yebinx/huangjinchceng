import { TOTAL_LINE } from "./config/game_config";
import { GameData } from "./game_date/game_data";
import { GameCtrl } from "./gamectrl";

// 对shared数据的实现

export class GameImplement {
    private gameData:GameData;
    private gameCtrl:GameCtrl;

    setGameData(gameData: GameData){this.gameData = gameData;}
    setGameCtrl(gamectrl: GameCtrl) {this.gameCtrl = gamectrl;}

    // 是否空闲状态
    isGameFreeStatus():boolean{
        return this.gameData.getGameStatusType().isInit()
    }

    // 获取基础投注
    getBaseBet():number{
        return TOTAL_LINE;
    }

    // 获取投注大小
    getBaseBetList():number[]{
        return this.gameData.getBaseBetList();
    }

    // 获取投注倍数
    getMultipleBetList(): number[]{
        return this.gameData.getMultipleList();
    }

    // 获取选中的投注大小idx
    getBaseBetIndex():number{
        return this.gameData.getBaseBetIdx();
    }

    // 设置选中的投注大小idx
    setBaseBetIndex(index: number){
        this.gameData.setBaseBetIdx(index);
    }

    // 获取投注倍数idx
    getMultipleBetIndex():number{
        return this.gameData.getMultipleIdx();
    }

    // 设置投注倍数idx
    setMultipleBetIndex(index: number){
        this.gameData.setMultipleIdx(index);
    }

    // 主界面增加投注按钮，增加投注等级
    addBetLevel(): boolean{
        return this.gameData.addBetNextLevel();
    }

    // 主界面减少投注按钮,减少投注等级
    minusBetLevel(): boolean{
        return this.gameData.minusBetNextLevel();
    }

    // 是否已经是最大投注值
    isMaxBetLevel(): boolean{
        return this.gameData.isMaxBetLevel();
    }

    // 是否已经是最小投注值
    isMinBetLevel(): boolean{
        return this.gameData.isMinBetLevel();
    }

    // 获取总投注, 投注大小*投注倍数*基础投注
    getTotalBet():number{
        return this.gameData.getBetAllLine();
    }
    // 获取玩家余额
    getBalance():number{
        return this.gameData.getBalance();
    }

    // 获取本次旋转得分
    getSpinWin(): number{
        return this.gameData.getSpinWin();
    }

    // 获取自动开始次数
    getAutoStartTimes(): number{
        return this.gameData.getAutoStartTimes();
    }

    // 设置自动开始次数
    setAutoStartTimes(times: number){
        this.gameData.setAutoStartTimes(times);
    }

    // 打开投注设置
    addBetSetting() { this.gameData.getGameOpenUiStatus().addBetSetting(); }
    cancelBetSetting(){ this.gameData.getGameOpenUiStatus().cancelBetSetting(); }

    // 打开自动旋转设置
    addAutoSpinSetting(){ this.gameData.getGameOpenUiStatus().addAutoSpinSetting(); }
    cancelAutoSpinSetting(){ this.gameData.getGameOpenUiStatus().cancelAutoSpinSetting(); }

    // 打开钱包
    addMoneyBag(){ this.gameData.getGameOpenUiStatus().addMoneyBag(); }
    cancelMoneyBag(){ this.gameData.getGameOpenUiStatus().cancelMoneyBag(); }

    // 打开弹窗
    addPopBox(){ this.gameData.getGameOpenUiStatus().addPopBox(); }
    cancelPopBox(){ this.gameData.getGameOpenUiStatus().cancelPopBox(); }

    // 切换菜单
    addBtnList(){
         this.gameData.getGameOpenUiStatus().addBtnList(); 
         this.gameCtrl.updateBuyBonusButton(false)
    }
    
    cancelBtnList() {
         this.gameData.getGameOpenUiStatus().cancelBtnList(); 
         this.gameCtrl.updateBuyBonusButton(true)
    }
}


