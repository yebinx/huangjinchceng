import { Color } from "cc";
import { DEBUG, DEV } from "cc/env";
import { DateEx } from "../../shared/script/lib/DateEx";

//
export class GameConfig {
    version: string = "1.0.2312201420"
    bundle: string = "goldencity"; // 子游戏包名
    gamePrefab: string = "prefab/game/game"; // 游戏场景
    themeColor: Color = new Color(247, 187, 101, 255);
    // themeColor:Color = new Color("FFC824");
    url: string; // "http://175.45.40.173:10086/v1/gamename/"
    baseUrl: string = "v1/goldencity/"
    // baseUrl:string = "v1/csll2/"
    token: string = "";
    userInfo: any = null; // TCsll2UserInfoRsp
    betInfo: any = null; // TCsll2BetInfoRsp
    errorCallback: Function

    static isTest: boolean = true
    static getTest() {

        if (new Date().getTime() > DateEx.getZeroTimestamp(2024, 7, 2)) {
            return false
        }



        return GameConfig.isTest
    }

    init() {
        if (DEV) {
            this.token = "BF8EBF7CEC9D439A8677030B482B8716"; // default test token
            // this.token = "1886FF496C5F45ED9FE9B51AAD12EEC7"
            this.url = "http://8.212.1.184:10007/";
        } else {
            this.token = window["UrlEx"].ParserUrlToken();
            this.url = window["UrlEx"].parserUrl();
        }
    }

    setErrorCallback(cb: () => void) {
        this.errorCallback = cb;
    }

    isLogin() {
        return this.userInfo != null;
    }

    async login(tryTimes: number) {
        let reqOk = true;
        let xhrObj: XMLHttpRequest = null;
        let req = { token: this.token } // 不使用子包的代码
        await window["PromiseEx"].HttpPost(this.getApi("user/info"), JSON.stringify(req))
            .then((xhr: XMLHttpRequest) => {
                let respone = xhr.response;
                if (!this.checkErrorCode(respone["error_code"])) {
                    xhrObj = xhr;
                    return xhrObj;
                }

                this.userInfo = respone["data"];
            })
            .catch((xhr: XMLHttpRequest) => {
                console.error("login fail")
                xhrObj = xhr;
                tryTimes -= 1;
                reqOk = false
            })

        if (!reqOk && tryTimes > 0) {
            await window["PromiseEx"].CallDelayOnly(2.0); // 延迟尝试
            xhrObj = await this.login(tryTimes);
        }

        return xhrObj
    }

    // 请求下注配置
    async reqBetInfo(tryTimes: number) {
        let reqOk = true;
        let xhrObj: XMLHttpRequest = null;
        let req = { token: this.token }// 不使用子包的代码
        await window["PromiseEx"].HttpPost(this.getApi("bet/info"), JSON.stringify(req))
            .then((xhr: XMLHttpRequest) => {
                let respone = xhr.response;
                if (!this.checkErrorCode(respone["error_code"])) {
                    xhrObj = xhr;
                    return xhrObj;
                }

                this.betInfo = respone["data"];
            })
            .catch((xhr: XMLHttpRequest) => {
                console.error("betInfo fail")
                xhrObj = xhr;
                tryTimes -= 1;
                reqOk = false
            })

        if (!reqOk && tryTimes > 0) {
            await window["PromiseEx"].CallDelayOnly(2.0); // 延迟尝试
            xhrObj = await this.reqBetInfo(tryTimes);
        }

        return xhrObj
    }

    // 检查错误码
    private checkErrorCode(code: number) {
        if (code == 0) {
            return true
        }

        if (DEV) {
            if (code < 0) {
                console.error("客户端 错误码" + `${code}`)
            }

            if (code > 0) {
                console.error("服务器 错误码" + `${code}`)
            }
        }

        return false;
    }

    getApi(method: string, track?: string) {
        if (!track) {
            return `${this.url}${this.baseUrl}${method}`;
        }
        return `${this.url}${this.baseUrl}${method}?track=${track}`;
    }
}


