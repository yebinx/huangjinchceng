import { _decorator, Component, EventMouse, Node, NodeEventType, ScrollView, Sprite, tween, Vec3, Widget } from 'cc';
import { EventAfter } from '../lib/event_after_callback';
import { Action } from '../action';
const { ccclass, property } = _decorator;

// 游戏规则
@ccclass('SharedGameRule')
export class SharedGameRule extends Component {
    @property({type:Sprite})
    spBg:Sprite;

    @property({type:Node})
    ndRoot:Node;

    @property({type:ScrollView})
    scrollView:ScrollView;
    
    private isExitAction: boolean = false;
    private enteryCallback:Function = null;
    private exitCallback:Function = null;
    private root: Node = null; 

    protected onLoad(): void {
        this.node.on(EventAfter.START_AFTER, this.startAfter, this);
        this.scrollView.node.on(NodeEventType.MOUSE_ENTER, this.onEventMouseEnter, this);
        this.scrollView.node.on(NodeEventType.MOUSE_LEAVE, this.onEventMouseLevel, this);
        this.scrollView.verticalScrollBar.hide();
    }

    protected start(): void {
        this.ndRoot.active = false;
    }

    protected startAfter(){
        this.spBg.getComponent(Widget).enabled = false;
        this.playEnterAction();
    }

    setRoot(root:Node){this.root = root;}
    setEntryCallback(cb:Function){this.enteryCallback = cb;}
    setExitCallback(cb:Function){this.exitCallback = cb;}

    private playEnterAction(){
        if (this.enteryCallback){
            this.enteryCallback()
        }

        this.spBg.node.position = new Vec3(0, -2500, 0);
        tween(this.spBg.node)
        .to(0.4, {position: new Vec3(0, 0, 0)})
        .call(()=>{
            this.spBg.getComponent(Widget).enabled = true;
            this.ndRoot.active = true;
            Action.grayLayerFadeIn(this.ndRoot.getComponent(Sprite), 0.4)
        })
        .start()
    }

    private playExitAction(){
        if (this.isExitAction){
            return 
        }
        this.isExitAction = true;

        if (this.exitCallback){
            this.exitCallback();
        }

        tween(this.spBg.node)
        .to(0.4, {position: new Vec3(0, -3500, 0)})
        .call(()=>{
            if (this.root){
                this.root.destroy();
            }else{
                this.node.destroy();
            }
        })
        .start()
    }

    private onBtnClose(){
       this.playExitAction();
    }

    private onEventMouseEnter(event: EventMouse){
        this.scrollView.verticalScrollBar.enableAutoHide = false;
        this.scrollView.verticalScrollBar.show();
    }

    private onEventMouseLevel(event: EventMouse){
        this.scrollView.verticalScrollBar.enableAutoHide = true;
    }
}


