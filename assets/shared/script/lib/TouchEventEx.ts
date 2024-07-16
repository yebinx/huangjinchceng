import { EventTouch } from "cc";

export class TouchEventEx {
    static isTouchMove(event: EventTouch){
        const deltaMove = event.getUILocation();
        deltaMove.subtract(event.getUIStartLocation());
        return deltaMove.length() > 7;
    }
}


