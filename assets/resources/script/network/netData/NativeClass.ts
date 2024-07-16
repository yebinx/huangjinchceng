
/************************************************************************
 * Copyright (c) 2023 App
 * Author   : eason
 * Date     : 2019-12-10
 * Use      : native function
 ************************************************************************/
// import { _decorator, view, macro, ResolutionPolicy, screen, size } from cc;

export default class NativeClass {
    //解析url参数
    public static GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substring(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;
    }
    //解析游戏id前的值
    public static GetDomainAddress() {
        let gameId = NativeClass.GetEnterGameID()
        var r = window.location.href
        var pos = r.indexOf(gameId.toString())
        let url = r.substring(0, pos)
        if (url != null) return url; return null;
    }
    public static GetApimode(): number {
        let apimode = this.GetQueryString("b");
        if (!apimode) return 0;
        if (apimode == "true") {
            return 1;
        } else {
            return 0;
        }
    }
    public static GetChannelID() {
        let channelid = this.GetQueryString("channel");
        if (!channelid) return 1;
        return channelid;
    }

    public static GetInvitationCode() {
        let InvitationCode = this.GetQueryString("InvitationCode");
        if (!InvitationCode) return "";
        return InvitationCode;
    }

    public static GetUserAccountID() {
        let userAccount = this.GetQueryString("account_id");
        if (!userAccount) return "";
        return userAccount;
    }
    public static GetOperatorId(): number {
        let operatorId = this.GetQueryString("oid");
        if (!operatorId) return 0;
        return Number(operatorId);
    }
    public static GetUserAccount(): string {
        let userAccount = this.GetQueryString("oa");
        if (!userAccount) return "";
        return userAccount;
    }
    public static GetUserPassword(): string {
        let userPassword = this.GetQueryString("op");
        if (!userPassword) return "";
        return userPassword;
    }
    public static GetGameLang(): string {
        let lang = this.GetQueryString("l");
        if (!lang) return "EN";
        lang = lang.toUpperCase()
        if (lang == "PT") { lang = "BR" }
        return lang;
    }
    public static GetAutoEnterGame(): string {
        let enterGame = this.GetQueryString("g");
        if (!enterGame) return "";
        return enterGame;
    }
    public static GetEnterGameID(): number {
        let enterGame = this.GetQueryString("g");
        if (!enterGame) return 0;
        return Number(enterGame);
    }
    public static GetGameRate(): number {
        let rate = this.GetQueryString("rate");
        if (!rate) return 1;
        return Number(rate);
    }
    public static GetSortId(): number {
        let sortId = this.GetQueryString("s");
        if (!sortId) return 0;
        return Number(sortId);
    }
    public static GetLoginType(): number {
        let type = this.GetQueryString("type");
        if (!type) return 1;
        return Number(type);
    }
    public static GetSessionId(): BigInt {
        let sessionId = this.GetQueryString("sid");
        if (!sessionId) return BigInt(0);
        return BigInt(sessionId);
    }
    public static GetIp(): number {
        let ip = this.GetQueryString("ip");
        if (!ip) return 0;
        var num = 0;
        let ipArr = ip.split(".");
        num = Number(ipArr[0]) * 256 * 256 * 256 + Number(ipArr[1]) * 256 * 256 + Number(ipArr[2]) * 256 + Number(ipArr[3]);
        num = num >>> 0;
        return num;
    }
    public static GetIpStr(): string {
        let ip = this.GetQueryString("ip");
        if (!ip) return "";
        return ip;
    }
    public static GetMac(): string {
        let mac = this.GetQueryString("hv");
        if (!mac) return "";
        return mac;
    }
    public static GetGameHostUrl(): string {
        let host_url = this.GetQueryString("u");
        if (!host_url) return "";
        if (host_url.indexOf('.') == -1) {
            host_url = window.atob(host_url)   //解码base64
        }
        return host_url;
    }
    public static GetExitCmd(): string {
        let exitCmd = this.GetQueryString("e");
        if (!exitCmd) return "ToCloseWebView";
        return exitCmd;
    }
    public static GetTimestamp(): string {
        let timestamp = this.GetQueryString("t");
        if (!timestamp) return "";
        return timestamp;
    }
    public static GetCurrency(): string {
        let currency = this.GetQueryString("ce");
        return currency;
    }
    public static ReplaceParamVal(paramName, replaceWith) {
        var oUrl = window.location.href.toString();
        if (paramName.indexOf("localhost") != -1 && oUrl.indexOf("account_name") == -1 || oUrl !== replaceWith) {
            var re = eval('/(' + paramName + '=)([^&]*)/gi');
            window.location.href = replaceWith;
        }
    }

}