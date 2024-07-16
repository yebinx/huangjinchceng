import { _decorator, Component,  view, screen, UITransform,   Vec3, Size,  Node, Sprite, game, Game, tween} from 'cc';
import { HTML5 } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('Splash')
export class Splash extends Component {
    @property({type:Node})
    limitContent:Node; // 显示缩放大小的节点

    @property({type:Sprite})
    splash:Sprite

    @property({type:Node})
    gameRoot:Node;

    @property({type:Node})
    shadow:Node;

    private splashSize:Size;
    private limitSize:Size;
    private limitOffsetY:number;
    private offsetY:number;

    start() {
        let uiTransform = this.splash.getComponent(UITransform);
        this.splashSize = uiTransform.contentSize.clone();
        
        uiTransform = this.limitContent.getComponent(UITransform);
        this.limitSize = uiTransform.contentSize.clone();

        let designResolutionSize = view.getDesignResolutionSize();
        this.limitOffsetY = (designResolutionSize.height - this.limitSize.height) / 2;
      
        view.setResizeCallback(this.updateHtmlSplash.bind(this));
        this.updateHtmlSplash();

        this.listenMouseLeaveGame();
        this.hideLoadingSvg();
    }

    private hideLoadingSvg(){
        if (HTML5){
            let removeDom = ()=>{
                let fadeOutDuration = 0.4;
                let obj = {opacity: 1};
                
                tween(obj)
                .to(fadeOutDuration, {opacity: 0.0}, {progress: (start: number, end: number, current: number, ratio: number) => {
                        let v = start + ((end - start) * ratio);
                        let domSvg = document.getElementById("initial-loader");
                        if (domSvg){
                            domSvg.style.opacity = `${v}`;
                        }

                        return v;
                    },
                    // easing: "quintIn",
                })
                .call(()=>{
                     let domSvg = document.getElementById("initial-loader");
                    if (domSvg){
                        domSvg.remove();
                    }
                })
                .start()
            }
            let _svgStartDate =  window["_svgStartDate"] as Date;
            if (!_svgStartDate){
                removeDom();
                return 
            }

            let _svgDuration = window["_svgDuration"] as number;

            let now = new Date();
            let pastTime = now.getTime() - _svgStartDate.getTime();
            if (pastTime < _svgDuration){
                this.scheduleOnce(()=>{removeDom();}, (_svgDuration - pastTime) / 1000);
                return 
            }

            removeDom();
        }
    }

    private listenMouseLeaveGame(){
        if (HTML5){
            window.addEventListener("blur", ()=>{
                // console.log("blur")
                game.emit(Game.EVENT_HIDE);
            });
            
            window.addEventListener("focus", ()=>{
                // console.log("focus")
                game.emit(Game.EVENT_SHOW);
            });
        }
    }

    updateHtmlSplash(){
        if (!HTML5){
            return 
        }

        let scale = Math.min(view.getScaleX(), view.getScaleY());
        this.updateGameRootScale(scale);
        this.updateSplashScale(scale);
    }

    getLimitOffsetY(){return this.limitOffsetY;}
    getOffsetY(){return this.offsetY;}

    private updateGameRootScale(scale: number){
        let designResolutionSize = view.getDesignResolutionSize();
       
        let windowsSize = screen.windowSize;
        let showHeight = designResolutionSize.height * scale; // 显示最高尺寸
        // let showWidth = designResolutionSize.width * scale; // 显示最宽尺寸
        let limitHeight = this.limitSize.height * scale;

        let gameRootScale = Vec3.ONE;
        if (windowsSize.height <= showHeight && windowsSize.height < limitHeight){ // 适配比例变大了，需要缩放根节点
            let newScale = 1 - (limitHeight - windowsSize.height) / limitHeight;
            gameRootScale = new Vec3(newScale, newScale, 1)
            this.gameRoot.scale = gameRootScale;
        }

        this.gameRoot.scale = gameRootScale;

        this.shadow.scale = gameRootScale.clone();

        this.emitViewResize(scale, gameRootScale.y);
    }

    // 更新背景图大小
    private updateSplashScale(scale: number){
        // -3是有白边，缩小闪屏图大小，增加放大比例
        let splashWidth = (this.splashSize.width) * scale;
        let splashHeight = (this.splashSize.height) * scale;

        // 计算宽度的缩放比例
        let widthRatio = screen.windowSize.width / splashWidth;

        // 计算高度的缩放比例
        let heightRatio = screen.windowSize.height / splashHeight;

        // 选择最大的缩放比例
        let maxRatio = Math.max(widthRatio, heightRatio);

        // 计算缩放后的宽度和高度
        let scaledWidth = splashWidth * maxRatio;
        let scaledHeight = splashHeight * maxRatio;

        // 计算水平和垂直偏移量
        let offsetY = (screen.windowSize.height) * 0.1 / scale;

        let uiTransform = this.splash.getComponent(UITransform);
        uiTransform.width = scaledWidth / scale + (3);
        uiTransform.height = scaledHeight / scale + (offsetY);

        // console.log("offsetX", offsetX, "offsetY", offsetY)

        this.splash.node.position = new Vec3(0, -offsetY / 2, 1);
    }

    // 
    private emitViewResize(scale: number, gameRootScale: number){
        let designResolutionSize = view.getDesignResolutionSize();
        let windowsSize = screen.windowSize;
        let showHeight = designResolutionSize.height * scale; // 显示最高尺寸
       
        if (windowsSize.height >= showHeight){
            this.emit(0);
            return
        }

        // let offsetY = 0;
        // let useScale = (scale + gameRootScale) - 1;
        let offsetY = (showHeight - windowsSize.height) / scale / 2;   
        // if (useScale >= 1){
        //     offsetY = (showHeight - windowsSize.height) / useScale / 2;     
        // }else{
        //     offsetY = (showHeight - windowsSize.height) / (1-useScale) / 2;     
        // }
        
        this.emit(offsetY);
    }

    private emit(offsetY: number){
        this.offsetY = offsetY;
        this.node.emit("view_resize", offsetY, this.limitOffsetY)
    }
}


