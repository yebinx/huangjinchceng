import { _decorator, Component, Node, Animation, animation, Layout, UITransform, Size} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingBar')
export class LoadingBar extends Component {
    @property({type:Animation})
    ndBar:Animation;

    @property({type:Layout})
    loadingBar:Layout

    @property({type:Node})
    spWhite: Node;

    private currentProgress:number = 0;
    private targetProgress:number = 0;

    protected onLoad(): void {
    }

    protected update(dt: number): void {
        if (this.currentProgress >= this.targetProgress || this.currentProgress >= 1){
            return 
        }

        this.currentProgress += dt;
        this._setProgress(this.currentProgress);
    }

    addProgress(progress: number){
        this.targetProgress += progress;
    }

    setProgress(progress: number){
        this.targetProgress = progress;
        if (this.currentProgress >= this.targetProgress){
            this.currentProgress = this.targetProgress;
            this._setProgress(this.targetProgress);
        }
    }

    // progress 0~1.0
    private _setProgress(progress: number){
        let uiTransform = this.ndBar.getComponent(UITransform)
        let width = uiTransform.width * (-1 + Math.min(1, Math.max(0, progress))) - this.getWhileSize().width;

        this.loadingBar.spacingX = width;
    }

    private getWhileSize(){
        let uiTransform = this.spWhite.getComponent(UITransform)
        return new Size(uiTransform.width, uiTransform.height);
    }
}


