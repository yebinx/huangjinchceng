import { _decorator, Component, Label, Layout, Node, sp, Sprite, SpriteFrame, tween, Vec3, Animation, Tween, Prefab, UIOpacity, instantiate } from 'cc';
import { TweenEx } from '../../../shared/script/lib/TweenEx';
import { PromiseEx } from '../../../shared/script/lib/PromiseEx';
import { ConfigMethod } from '../config/config_method';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
import { MultipleNum } from './multiple_num';
import { MultipleBonus } from './multiple_bonus';
const { ccclass, property } = _decorator;

// 倍数提示
@ccclass('MultipleTitle')
export class MultipleTitle extends Component {
    @property({type:Node})
    ndNormal:Node;

    @property({type:Node})
    ndBonus:Node;

    @property({type:Animation})
    multipleTitle:Animation;

    @property({type:[MultipleNum]})
    szMultipleNum:MultipleNum[] = []; // 0展现的倍数，1替代的倍数

    @property({type:Node})
    ndParticleMultiple:Node; // 存放粒子

    @property({type:Prefab})
    multipleBonus:Prefab; // 多倍游戏

 
    @property({type:Prefab})
    particle__multiplier_holder:Prefab;

    private currentMultipleBonus:MultipleBonus;
    private isBonus:boolean = false;
    private currentMultiple = 0; // 当前倍数
    
    protected onLoad(): void {
        this.multipleTitle["playParticle"] = this.playParticle.bind(this)
        this.multipleTitle["animationEventResetMultiple"] = this.animationEventResetMultiple.bind(this)
        this.szMultipleNum[1].node.active = false;

        this.reset();
    }

    protected start(): void {
        // this.test();
        this.szMultipleNum[0].setNum(ConfigMethod.getMultiple(false))
        this.szMultipleNum[1].setNum(ConfigMethod.getMultiple(false))
    }

    reset(){
        // this.resetMultipleSelect();
    }

    getMultiple(){return this.currentMultiple;}

    playResetAni(multiple: number){
        this.currentMultiple = multiple;
        this.multipleTitle.play("multiple_reset")
        this.szMultipleNum[1].setNum(multiple)
    }

    setCurrentMultiple(multiple: number){ 
        this.currentMultiple = multiple;
        this.szMultipleNum[0].setNum(multiple)
    }
    
    // 切换倍数
    switchMultiple(isFreeGame: boolean){
        this.isBonus = isFreeGame;
        this.ndNormal.active = !isFreeGame;

        if (!isFreeGame){
            if (this.currentMultipleBonus){
                this.currentMultipleBonus.node.destroy();
                this.currentMultipleBonus = null;
                this.szMultipleNum[0].setNum(this.currentMultiple)
            }
            return;
        }

        this.currentMultipleBonus = MultipleBonus.New(this.multipleBonus, this.ndBonus)
        this.currentMultipleBonus.setMultiple(this.currentMultiple);
    }

    // 播放下个倍数
    setNextMultiple(multiple: number){
        if (!this.isBonus){
            this.currentMultiple = multiple;
            this.multipleTitle.play("multiple_title_change_multiple")
            this.szMultipleNum[1].setNum(multiple);
            return 
        }
       
        this.currentMultipleBonus.playMultiple(multiple);
    }

    playScaleBonus(){
        if (this.isBonus){
            return 
        }
        this.multipleTitle.play("multiple_scale")
    }

    // 动画事件回调
    private playParticle(){
        let nd = instantiate(this.particle__multiplier_holder);
        nd.parent = this.ndParticleMultiple;

        this.szMultipleNum[0].setNum( this.currentMultiple);
    }

    // 重置倍数
    private animationEventResetMultiple(){
        this.szMultipleNum[0].setNum(this.currentMultiple);
    }

    // async test(){
    //     this.isBonus = true
    //     this.currentMultiple = 6
    //     this.switchMultiple(this.isBonus)
    //     for (let i=0; i<5; i++){
    //         this.setNextMultiple();
    //         await PromiseEx.CallDelayOnly(1.0)
    //     }

    //     this.playResetBaseMultiple();
    //     await PromiseEx.CallDelayOnly(2.0)

    //     this.playOpacity()
    //     await PromiseEx.CallDelayOnly(2.0)

    //     this.test();
    //     // this.playBonusMultiple();
    // }
}

