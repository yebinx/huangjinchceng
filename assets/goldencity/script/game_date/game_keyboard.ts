enum SpaceKeyBoardType{
    INIT = 0,
    TOUCH = 1 << 0, // 点击
    BLUR = 1 << 1, // 失去焦点
}

export class GameKeyBoard {
    private spaceKeyBoardStatus:number = SpaceKeyBoardType.INIT;

    isOnlyTouch() { return this.spaceKeyBoardStatus == SpaceKeyBoardType.TOUCH;}

    isTouch() { return (this.spaceKeyBoardStatus & SpaceKeyBoardType.TOUCH) == SpaceKeyBoardType.TOUCH; }
    isBlur() { return (this.spaceKeyBoardStatus & SpaceKeyBoardType.BLUR) == SpaceKeyBoardType.BLUR; }

    addTouch(){ this.spaceKeyBoardStatus |= SpaceKeyBoardType.TOUCH; }
    addBlur() { this.spaceKeyBoardStatus |= SpaceKeyBoardType.BLUR; }

    cancelTouch() {
         this.spaceKeyBoardStatus = this.spaceKeyBoardStatus & (0xffffffff - SpaceKeyBoardType.TOUCH);
    }

    cancelBlur() {
        this.spaceKeyBoardStatus = this.spaceKeyBoardStatus & (0xffffffff - SpaceKeyBoardType.BLUR);
    }
}


