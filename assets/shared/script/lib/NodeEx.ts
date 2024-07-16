import { _decorator, Color, EventTouch, Node, UIRenderer, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeEx')
export class NodeEx  {
    static addClick(node: Node, callback: (Function)){
        // let btn = node.addComponent(Button);
        // btn.target = node
        node.on(Node.EventType.TOUCH_START, ()=>{((node) as any)._pressed = true;}, node);

        node.on(Node.EventType.TOUCH_END, (event:EventTouch)=>{
            let _pressed = ((node) as any)._pressed;
            ((node) as any)._pressed = false;
            if (_pressed){
                let startPoint = event.touch.getStartLocation()
                let endPoint = event.touch.getLocation()
                if (Math.abs(endPoint.x - startPoint.x) + Math.abs(endPoint.y - startPoint.y) < 10){
                    if (callback){
                        callback(event)
                    }
                }
            }
        }, node);

        node.on(Node.EventType.TOUCH_CANCEL, ()=>{((node) as any)._pressed = false;}, node);
    }

    static getWorldPosition(node: Node, localPosition?:Vec3){
        let uiTransform = node.getComponent(UITransform);
        if (localPosition){
            return uiTransform.convertToWorldSpaceAR(localPosition);
        }
        return uiTransform.convertToWorldSpaceAR(Vec3.ZERO);
    }

    static getLocalPosition(target:Node, worldPosition:Vec3){
        let uiTransform = target.getComponent(UITransform);
        return uiTransform.convertToNodeSpaceAR(worldPosition)
    }

    static getSize(node:Node){
        let uiTransform = node.getComponent(UITransform);
        return uiTransform.contentSize.clone();
    }

    static setSize(node: Node, width: number, height: number){
        let uiTransform = node.getComponent(UITransform);
        if (width == null){
            uiTransform.height = height;
            return
        }

        if (height == null){
            uiTransform.width = width;
            return
        }

        uiTransform.setContentSize(width, height);
    }

    static getAnchorPoint(node: Node){
        let uiTransform = node.getComponent(UITransform);
        return uiTransform.anchorPoint.clone()
    }

    static setPosition(node: Node, x: number, y: number){
        let pos = node.position;
        if (x == null){
            node.position = new Vec3(pos.x, y, pos.z);
            return;
        }
        if (y == null){
            node.position = new Vec3(x, pos.y, pos.z);
            return;
        }

        node.position = new Vec3(x, y, pos.z);
    }

    static setOpacity(node:Node, opacity:number){
        let uiTransform = node.getComponent(UIRenderer);
        let oldColor = uiTransform.color;
        uiTransform.color = new Color(oldColor.r, oldColor.g, oldColor.b, opacity);
    }

     // 递归更新颜色
    static recursionColor(nd:Node, color:Color){
        if (nd.children.length == 0){
            return;
        }

        let uiRander:UIRenderer = null;
        nd.children.forEach((child:Node)=>{
            uiRander = child.getComponent(UIRenderer);
            if (uiRander != null){
                if (uiRander["__default_color"]){
                    uiRander.color = color;
                    this.recursionColor(child, color);
                    return 
                }

                if (!uiRander["__first_change"]){
                    let isWhite = uiRander.color.equals(Color.WHITE);
                    uiRander["__default_color"] = isWhite;
                    if (!isWhite) {
                        uiRander["__original_color"] = uiRander.color.clone();
                    }
                    uiRander["__first_change"] = true;

                    if (uiRander["__default_color"]){
                        uiRander.color = color;
                        this.recursionColor(child, color);
                        return 
                    }
                }

                let original = uiRander["__original_color"] as Color;
                let r = color.r / 255 * original.r;
                let g = color.g / 255 * original.g;
                let b = color.b / 255 * original.b;
                let a = color.a / 255 * original.a;

                uiRander.color = new Color(r, g, b, a);
            }
            this.recursionColor(child, color);
        })
    }

    static setColor(nd:Node, color:Color){
        let uiRander = nd.getComponent(UIRenderer);
        if (!uiRander){
            return 
        }
        uiRander.color = color;
    }
}


