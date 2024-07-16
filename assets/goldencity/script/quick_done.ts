import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

enum QucikDoneType {
    INIT = 0,
    ANIMATION_NENTER = 1 << 0, // 动画进入效果结束，可以等待快速完成
    ACTIVE_QUICK_DONE = 1 << 1,    // 快速完成
}

@ccclass('QuickDone')
export class QuickDone {
    private quickDoneFlg: number = QucikDoneType.INIT; // 是否快速完成

    reset(){this.quickDoneFlg = QucikDoneType.INIT;}

    addAnimationEnter(){ this.quickDoneFlg |= QucikDoneType.ANIMATION_NENTER; }
    addQuickDoneFlg(){ this.quickDoneFlg |= QucikDoneType.ACTIVE_QUICK_DONE; }

    isInit() {return this.quickDoneFlg == QucikDoneType.INIT;}
    isAnimationEnter(){return ((this.quickDoneFlg & QucikDoneType.ANIMATION_NENTER) == QucikDoneType.ANIMATION_NENTER);}
    isQuickDone(){return ((this.quickDoneFlg & QucikDoneType.ACTIVE_QUICK_DONE) == QucikDoneType.ACTIVE_QUICK_DONE);}
}


