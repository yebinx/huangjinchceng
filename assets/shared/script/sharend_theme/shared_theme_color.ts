import { _decorator, Color, Component, Node, UIRenderer } from 'cc';
import { SharedConfig } from '../config/shared_config';
const { ccclass, property } = _decorator;

// 把节点更新成主题颜色

@ccclass('SharedThemeColor')
export class SharedThemeColor extends Component {
    @property({type:UIRenderer, displayName:"修改成主题的颜色"})
    rendererList :UIRenderer[] = []

    protected onLoad(): void {
        this.rendererList.forEach((render: UIRenderer)=>{
            render.color = SharedConfig.THEME_COLOR.clone();
        })
    }

    protected start(): void {
        this.destroy();
    }
}


