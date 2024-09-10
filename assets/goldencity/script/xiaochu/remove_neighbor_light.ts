import { _decorator, Component, instantiate, Node, Size, Sprite, SpriteFrame, Vec3 } from 'cc';
import { NodeEx } from '../../../shared/script/lib/NodeEx';
const { ccclass, property } = _decorator;

// 周围光效
@ccclass('RemoveNeighborLight')
export class RemoveNeighborLight extends Component {
    @property({type:Sprite})
    removeNeighborLight:Sprite;

    @property({type:SpriteFrame})
    topLight:SpriteFrame;

    @property({type:SpriteFrame})
    rightLight:SpriteFrame;

    @property({type:SpriteFrame})
    rightLineLight:SpriteFrame;

    static New(prefab:any, parent:Node){
        let nd = instantiate(prefab)
        nd.parent = parent
        return nd.getComponent(RemoveNeighborLight)
    }
    
    showTop(size: Size){
        this.removeNeighborLight.spriteFrame = this.topLight;
        this.removeNeighborLight.node.scale = Vec3.ONE.clone();
        NodeEx.setSize(this.node, size.width, size.height);
    }

    showBottom(size: Size){
        this.removeNeighborLight.spriteFrame = this.topLight;
        this.removeNeighborLight.node.scale = new Vec3(1, -1, 1)
        NodeEx.setSize(this.node, size.width, size.height);
    }

    showLeft(size: Size){
        this.removeNeighborLight.spriteFrame = this.rightLight;
        this.removeNeighborLight.node.scale = new Vec3(-1, 1, 1)
        NodeEx.setSize(this.node, size.width, size.height);
    }

    showRight(size: Size){
        this.removeNeighborLight.spriteFrame = this.rightLight;
        this.removeNeighborLight.node.scale = Vec3.ONE.clone();
        NodeEx.setSize(this.node, size.width, size.height);
    }

    showLeftLine(size: Size){
        this.removeNeighborLight.spriteFrame = this.rightLineLight;
        this.removeNeighborLight.node.scale = new Vec3(-1, 1, 1)
        NodeEx.setSize(this.node, size.width, size.height);
    }

    showRightLine(size: Size){
        this.removeNeighborLight.spriteFrame = this.rightLineLight;
        this.removeNeighborLight.node.scale = Vec3.ONE.clone();
        NodeEx.setSize(this.node, size.width, size.height);
    }
}


