import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

// 即将出现第三个或以上的scatter的特效

@ccclass('ColScatterEffect')
export class ColScatterEffect extends Component {
    @property({type:Node})
    skAnimation: Node

    private szRollPosition: Vec3[] = [];

    protected start(): void {
    }

    setRollPosition(szPosition: Vec3[]) {
        this.szRollPosition = szPosition;
    }

    play(rollIdx: number) {
        this.skAnimation.active = true;
        this.skAnimation.setPosition(new Vec3(this.szRollPosition[rollIdx].x, 0));
    }

    stop() {
        this.skAnimation.active = false;
    }
}

