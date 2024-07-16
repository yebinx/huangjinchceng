import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SharedLoadingTips')
export class SharedLoadingTips extends Component {
    // start() {

    // }

   
    destroySelf(){
        this.node.destroy();
    }
}


