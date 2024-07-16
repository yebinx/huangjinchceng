
import { game } from 'cc';
import { HTML5 } from 'cc/env';
import NoSleep from 'nosleep.js';

export class SystemEx {
    private static noSleep:NoSleep = null;
    static keepScreenOn(){
      if (!this.noSleep){
        this.noSleep = new NoSleep();
        this.noSleep.enable();
      }
    }

    static cancelScreenOn(){
      if (this.noSleep){
        this.noSleep.disable();
        this.noSleep = null;
      }
    }

    static gameEnd(){
      if (HTML5){
        if (document.referrer.length > 0){ // 后退
            window.history.back();
            return;
        }
      }

      game.end();
    }

    static restart(){
      if (HTML5){
        location.reload();
        return;
      }

      game.restart();
    }
}

window["SystemEx"] = SystemEx;