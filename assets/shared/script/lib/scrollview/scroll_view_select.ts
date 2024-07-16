import { _decorator, Button, Component, EventTouch, Node, NodeEventType, ScrollView } from 'cc';
const { ccclass, property } = _decorator;

// 横竖 scrollview 选择其中一个

enum SelectType{
    NULL = 0,
    TOUCH = 1 << 0, // 点击状态
    MAIN = 1 << 1, // 移动判定为主scrollview方向
    OTHER = 1 << 2,  // 移动判断为其他方向
}

@ccclass('ScrollViewSelct')
export class ScrollViewSelct extends Component {
    @property({type:Node})
    mainScrollView:Node; 
    
    private minScrollView:ScrollView;
    private selectFlg = SelectType.NULL;

    start() {
        this.scheduleOnce(()=>{
            this.minScrollView = this.mainScrollView.getComponent(ScrollView); // 有可能节点被其他的拓展组件给替换了，造成这里丢失
            this.mainScrollView.on(NodeEventType.TOUCH_START, this.onTouchBegan, this, true);
            this.mainScrollView.on(NodeEventType.TOUCH_MOVE, this.onTouchMoved, this, true);
            this.mainScrollView.on(NodeEventType.TOUCH_END, this.onTouchEnded, this, true);
            this.mainScrollView.on(NodeEventType.TOUCH_CANCEL, this.onTouchCancelled, this, true);
        }, 0)
    }

    private onTouchBegan(event:EventTouch){
        this.selectFlg = SelectType.TOUCH;
    }

    private onTouchMoved(event:EventTouch){
        if ((this.selectFlg & SelectType.TOUCH) != SelectType.TOUCH){ // 还没点击
            return 
        }

        if ((this.selectFlg & SelectType.OTHER) == SelectType.OTHER){
            
            return 
        }
        // console.log("onTouchMoved")

        if ((this.selectFlg & SelectType.MAIN) == SelectType.MAIN){
            event.currentTarget = this.mainScrollView;
            (this.minScrollView as any)._onTouchMoved(event);// scrollview是通过注册捕获事件的，只能手动调用
            this.mainScrollView.emit(event.type, event);
            event.propagationStopped = true;
            return 
        }

        const touch = event.touch!;
        const deltaMove = touch.getUILocation();
        deltaMove.subtract(touch.getUIStartLocation());
        if (deltaMove.length() > 7) {
            if (deltaMove.x*deltaMove.x > deltaMove.y*deltaMove.y){
                // console.log("左右移动")
                if (this.minScrollView.horizontal){
                    this.selectFlg |= SelectType.MAIN;
                }else{
                    this.selectFlg |= SelectType.OTHER;
                }

            }else{
                // console.log("上下移动")
                if (this.minScrollView.vertical){
                    this.selectFlg |= SelectType.MAIN;
                }else{
                    this.selectFlg |= SelectType.OTHER;
                }
            }
        }

        event.propagationStopped = true;
    }

    private onTouchEnded(event:EventTouch){
        if ((this.selectFlg & SelectType.MAIN) == SelectType.MAIN){
            event.propagationStopped = true;    
            event.currentTarget = this.mainScrollView;
            (this.minScrollView as any)._onTouchEnded(event);
            this.mainScrollView.emit(event.type, event);
        }

        this.selectFlg = SelectType.NULL;
        // console.log("onTouchEnded")
    }
    
    private onTouchCancelled(event:EventTouch){
        if ((this.selectFlg & SelectType.MAIN) == SelectType.MAIN){
            event.propagationStopped = true;    
            (this.minScrollView as any)._onTouchCancelled(event);

            event.currentTarget = this.mainScrollView;
            this.mainScrollView.emit(event.type, event);
        }

        this.selectFlg = SelectType.NULL;
        // console.log("onTouchCancelled")
    }
}


