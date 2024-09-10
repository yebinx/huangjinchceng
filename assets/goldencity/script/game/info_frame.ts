import { _decorator, Component, Label, Layout, math, Node, Size, sp, Sprite, SpriteFrame, Tween, tween, UITransform, Vec3, Animation, Prefab, ParticleSystem2D, instantiate } from 'cc';
import { Emitter } from '../../../shared/script/lib/Emitter';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { SharedConfig } from '../../../shared/script/config/shared_config';
const { ccclass, property } = _decorator;

// 跑马灯或者赢得分数显示
// 50倍数显示流光   1条线
// 100倍显示红色的  1条线 尾部结算

@ccclass('Infoframe')
export class Infoframe extends Component {
    @property({type:Sprite})
    spBg:Sprite

    @property({type:Sprite})
    spResultBg:Sprite

    @property({type:Sprite})
    spInfo:Sprite; // 提示信息

    @property({type:Label})
    lbScore:Label; // 分数

    @property({type:Layout})
    lyScore:Layout; // 赢分内容

    @property({type:Sprite})
    spScoreTitle:Sprite; // 赢得 共赢得

    @property({type:Node})
    ndMask:Node;

    @property({type:Node})
    ndMaskSize:Node;

    @property({type:Animation})
    aniRoot:Animation; // 动画根

    @property({type:Animation})
    ib_vfx_a_screen_root:Animation; // 上下流光

    @property({type:Animation})
    ib_vfx_d_add:Animation; // 特效光

    @property({type:Animation})
    ib_vfx_b_normal:Animation; // 特效框

    @property({type:Animation})
    oneMoreScatter:Animation; // 在来一个夺宝动画

    @property({type:Node})
    multiple:Node; // 倍数

    @property({type:Label})
    lbMultiple:Label; // 倍数

    @property({type:Node})
    ib_vfx_c_add:Node; // 底部光

    @property({type:Node})
    mb_vfx_b_screen:Node; // 特效水

    @property({type:Node})
    ndParticleMultiple:Node; // 粒子

    @property({type:Prefab}) // 倍数粒子
    particle__multiplier_holder:Prefab;

    @property({type:[SpriteFrame]})
    szNormalNoteInfo:SpriteFrame[] = []; // 跑马灯图片

    @property({type:[SpriteFrame]})
    szBonusNoteInfo:SpriteFrame[] = []; // 跑马灯图片

    @property({type:[SpriteFrame]})
    sfWinFont:SpriteFrame[] = []; // 0.赢得 1.共赢得

    private maskContentSize:Size
    private lastTipsKey:number = -1;
    private emitter:Emitter;
    private isFreeGame:boolean = false;
    private score: number = 0; //显示的得分
    private rate: number = 0; // 赔率
  
    protected onLoad(): void {
        this.ib_vfx_a_screen_root.node.active = false;
        this.ib_vfx_c_add.active = false;
        this.multiple.active = false;
        this.ib_vfx_d_add.node.active = false;
        this.ib_vfx_b_normal.node.active = false;
        this.mb_vfx_b_screen.active = false;
        this.oneMoreScatter.node.active = false;

        this.maskContentSize = this.ndMaskSize.getComponent(UITransform).contentSize;

        this.aniRoot["shoumultiple"] = this.shoumultiple.bind(this)
    }

    start() {
        this.reset(false);
    }

    setEmitter(emitter:Emitter) {
        this.emitter = emitter;
    }

    reset(freeGame:boolean) {
        this.score = 0;
        this.isFreeGame = freeGame;
        this.setBgFrame(0);
        this.hideScore();
        this.showTips();
        this.stopLight();
        this.stopFrameAni();
    }

    showScore(socre:number, rate:number, multiple: number, isTotal:boolean) {
        this.score = socre;
        this.rate = rate;

        if (!isTotal){
            this.aniRoot.play(multiple <= 1 ? "multiple_first" : "multiple_more")
        }

        this.lyScore.node.active = true;

        if (multiple > 1 && !isTotal){
            this.mb_vfx_b_screen.active = true;
            this.multiple.active = true;

            socre = socre / multiple
            this.spScoreTitle.node.active = false;
        }else{
            this.mb_vfx_b_screen.active = false;
            this.multiple.active = false;
            this.spScoreTitle.node.active = true
        }

        this.lbMultiple.string = `x${multiple}`

        this.setSocre(socre, isTotal);
        this.playLight();
        this.setBgFrameByRate(rate, isTotal);
        this.hideTips();
    }

    // 播放小奖分数
    playTotalWin(score:number, duration: number){
        this.spScoreTitle.node.active = false;
        this.lbScore.string = SharedConfig.ScoreFormat(0)
        TweenEx.Score(this.lbScore, duration, 0, score, (lb: Label, currentNum: number)=>{
            lb.string = SharedConfig.ScoreFormat(currentNum)
        }, null)
        .start()
    }

    // 在来一个夺宝动画
    playOneMoreScatter(){
        if (this.oneMoreScatter.node.active){
            return 
        }

        this.oneMoreScatter.node.active = true;
        this.oneMoreScatter.play()

        this.lyScore.node.active = false;
        this.ib_vfx_d_add.node.active = false;
        this.hideTips()
    }

    stopOneMoreScatter(){
        if (!this.oneMoreScatter.node.active){
            return 
        }
        
        this.oneMoreScatter.node.active = false;
        this.oneMoreScatter.stop()

        if (this.score > 0){
            this.lyScore.node.active = true;
            this.ib_vfx_d_add.node.active = true;
        }else{
            this.showTips();
        }
    }

    private showTips() {
        this.spInfo.node.active = true;

        let key = this.getTipsKey()
        if (this.isFreeGame){
            this.spInfo.spriteFrame = this.szBonusNoteInfo[key]
        }else{
            this.spInfo.spriteFrame = this.szNormalNoteInfo[key]
        }

        let pos = this.spInfo.node.position;
        let size = this.spInfo.node.getComponent(UITransform).contentSize;
        if (size.width <= this.maskContentSize.width){
            this.spInfo.node.setPosition(0, pos.y)
            TweenEx.DelayCall(this.spInfo.node, 5,()=>{
                this.showTips()
            })
            return 
        }

        let offsetX = (size.width - this.maskContentSize.width) / 2;
        this.spInfo.node.setPosition(offsetX, pos.y);

        tween(this.spInfo.node)
        .delay(2)
        .to(5, {position:new Vec3(-1*(80+size.width), 0, pos.z)})
        .call(()=>{
            this.showTips();
        })
        .start()
    }

    private hideTips(){
        Tween.stopAllByTarget(this.spInfo.node);
        this.spInfo.node.active = false;
    }

    private  hideScore(){
        this.lyScore.node.active = false;
    }

    private setSocre(socre:number, isTotal:boolean){
        if (!isTotal){
            this.spScoreTitle.spriteFrame = this.sfWinFont[0]
        }else{
            this.spScoreTitle.spriteFrame =  this.sfWinFont[1]
        }

        this.lbScore.string = SharedConfig.ScoreFormat(socre)
    }

    private setBgFrameByRate(rate: number, isTotal:boolean){
        if (!isTotal || rate < 100){
            return 
        }

        this.stopFrameAni();
        this.stopLight()
        this.setBgFrame(1);
    }

    private setBgFrame(idx: number){
        if (idx == 0){
            this.spBg.node.active = true
            this.spResultBg.node.active = false;
        }else{
            this.spBg.node.active = false
            this.spResultBg.node.active = true;
        }
    }

    private getTipsKey(){
        let len:number
        if (this.isFreeGame){
            len = this.szBonusNoteInfo.length
        }else{
            len = this.szNormalNoteInfo.length
        }

        if (len <= 1){
            return 0
        }

        let key = Math.ceil(Math.random()*100) % len;
        do{
            key = Math.ceil(Math.random()*100) % len;
        }
        while (this.lastTipsKey == key)

        this.lastTipsKey = key;
        return key
    }

    private playLight(){
        this.ib_vfx_d_add.node.active = true;
        this.ib_vfx_d_add.play();
    }

    private stopLight(){
        this.ib_vfx_d_add.stop();
        this.ib_vfx_d_add.node.active = false;
    }

    private shoumultiple(){
        let nd = instantiate(this.particle__multiplier_holder)
        nd.parent = this.ndParticleMultiple;

        this.spScoreTitle.node.active = true;
        this.setSocre(this.score, false);

        if (this.rate >= 50 || this.ib_vfx_b_normal.node.active) {
            if (this.ib_vfx_b_normal.node.active){
                this.ib_vfx_b_normal.play("ib_vfx_b_light");
            }else{
                this.ib_vfx_b_normal.node.active = true;
                this.ib_vfx_b_normal.play("ib_vfx_b_normal");

                this.ib_vfx_a_screen_root.node.active = true;
                this.ib_vfx_a_screen_root.play();
            }
        }
    }

    private stopFrameAni(){
        if (this.ib_vfx_b_normal.node.active){
            this.ib_vfx_b_normal.stop();
            this.ib_vfx_b_normal.node.active = false;

            this.ib_vfx_a_screen_root.node.active = false;
            this.ib_vfx_a_screen_root.stop();
        }
    }
}

