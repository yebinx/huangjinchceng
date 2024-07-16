import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum EventAfter {
    ON_LOAD_AFTER = "on_load_after",
    START_AFTER = "start_after",
}

@ccclass('EventAfterCallback')
export class EventAfterCallback extends Component{
    @property({type:Node})
    target:Node

    protected onLoad(): void {
        this.target.emit(EventAfter.ON_LOAD_AFTER)
    }

    start() {
        this.target.emit(EventAfter.START_AFTER)
        this.node.destroy(); // 这个脚本只是为了触发事件调用顺序，使用新的node节点挂载
    }
}


