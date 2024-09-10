import { v4 as uuidv4 } from 'uuid';
import { l10n } from "../../../../extensions/localization-editor/static/assets/l10n";
import { Emitter } from "../../../shared/script/lib/Emitter";
import { PromiseEx } from "../../../shared/script/lib/PromiseEx";
import Http from "../../../shared/script/lib/Http";
import { EMIT_HEART_BEAT_TIME_OUT, EMIT_REQUEST_FAIL_RETRY, EMIT_RESPONE_ERROR_CODE, EMIT_SHOW_GAME_RECORD_ERROR } from "../../../shared/script/config/shared_emit_event";
import { TProtoGoldenCityBetReq, TProtoGoldenCityBetRsp, TProtoGoldenCityBetType } from "../../proto/v1.goldencity.bet";
import { BetInfo } from "../../proto/v1.goldencity.bet.info";
import { TProtoGoldenCityFreeReq, TProtoGoldenCityFreeRsp } from "../../proto/v1.goldencity.free";
import { TGoldenCityRecordReq, TGoldenCityRecordRsp } from "../../proto/v1.goldencity.record";
import { TGoldenCityRecordDetailReq, TGoldenCityRecordDetailRsp } from '../../proto/v1.goldencity.record.detail';
import { AudioSwitchType, TProtoGoldenCityMuteReq } from '../../proto/v1.goldencity.mute';
import { GameConfig } from '../../../resources/script/game_config';
// 
export class HttpRequest {
    private uuid: string = null // uuid，服务器要求幂等性
    private token: string = ""
    private receiveData: boolean = false;
    private getApi: (method: string, track?: string) => string = null; // 拼装url+method
    private emitter: Emitter;
    getReceiveDate() { return this.receiveData; }

    setEmitter(emitter: Emitter) { this.emitter = emitter; }
    setToken(token: string) { this.token = token; }
    setGetApiMethod(callback: (method: string, track?: string) => string) {
        this.getApi = callback;
    }

    clearDate() {
        this.receiveData = false;
    }

    private async request(callback: Function) {
        let loopTimes = 6;
        let track = this.getTrack();
        for (let i = 1; i <= loopTimes; i++) {
            let { responeData, retry } = await callback(track, i == loopTimes);
            if (responeData) {
                if (i > 1) {
                    this.emitter.emit(EMIT_REQUEST_FAIL_RETRY, null);// 取消提示
                }
                return responeData;
            }

            if (!retry) {
                this.emitter.emit(EMIT_REQUEST_FAIL_RETRY, null);// 取消提示
                break
            }

            this.emitter.emit(EMIT_REQUEST_FAIL_RETRY, i);
            await PromiseEx.CallDelayOnly(Math.min(5, i * 1.5));
        }

        return null;
    }

    async reqBet(betInfo: BetInfo, betTotal: number, buytype: TProtoGoldenCityBetType) {
        return await this.request(this._reqBet.bind(this, betInfo, betTotal, buytype))
    }

    // 请求投注
    private async _reqBet(betInfo: BetInfo, betTotal: number, buytype: TProtoGoldenCityBetType, track: string, checkCatch: boolean) {
        let req = {
            token: this.token,
            bet: betTotal,
            buytype: buytype,
            betsize: betInfo.betsize,
            betmultiple: betInfo.betmultiple,
            betid: betInfo.betid,
            idempotent: this.getUUID(),
        } as TProtoGoldenCityBetReq;

        let responeData: TProtoGoldenCityBetRsp = null;
        let retry = false;
        this.receiveData = false;



        if (GameConfig.getTest()) {
            let data = {
                "balance": 92293000,
                "result": [
                    {
                        "card_list": [
                            {
                                "list": [
                                    7,
                                    9,
                                    7,
                                    8
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    12,
                                    11,
                                    11,
                                    5,
                                    13
                                ],
                                "winpos": [
                                    0
                                ],
                                "droplist": [
                                    9
                                ],
                                "s2glist": null
                            },
                            {
                                "list": [
                                    1307,
                                    13,
                                    12
                                ],
                                "winpos": [
                                    2
                                ],
                                "droplist": [
                                    5
                                ],
                                "s2glist": null
                            },
                            {
                                "list": [
                                    1312,
                                    10,
                                    9
                                    
                                ],
                                "winpos": [
                                    0
                                ],
                                "droplist": [
                                   
                                ],
                                "s2glist": [{silverindex:0,goldenid:2312}]
                            },
                            {
                                "list": [
                                    210,
                                    3,
                                    1208
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    13,
                                    3,
                                    309
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    9,
                                    9,
                                    12,
                                    13,
                                    3
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            }
                        ],
                        "win": 3000,
                        "havewin": 0,
                        "removelist": [
                            {
                                "iconid": 12,
                                "winlines": 1,
                                "wincount": [
                                    1,
                                    1,
                                    1
                                ]
                            }
                        ],
                        "roundid": "D5797EDDD3",
                        "sceneodds": 1,
                        "balance": 92293000,
                        "scattercount": 0,
                        "createtime": 1703208881000
                    },
                    {
                        "card_list": [
                            {
                                "list": [
                                    7,
                                    9,
                                    7,
                                    8
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    11,
                                    11,
                                    5,
                                    13,
                                    9
                                ],
                                "winpos": [
                                    2
                                ],
                                "droplist": [
                                    9
                                ],
                                "s2glist": null
                            },
                            {
                                "list": [
                                    1307,
                                    13,
                                    7
                                ],
                                "winpos": [
                                    2
                                ],
                                "droplist": [
                                    7
                                ],
                                "s2glist": null
                            },
                            {
                                "list": [
                                    2312,
                                    10,
                                    9
                                    
                                ],
                                "winpos": [
                                    0
                                ],
                                "droplist": [
                                   
                                ],
                                "s2glist": [{silverindex:0,goldenid:301}]
                            },
                            {
                                "list": [
                                    210,
                                    3,
                                    1208
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    13,
                                    3,
                                    309
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    9,
                                    9,
                                    12,
                                    13,
                                    3
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            }
                        ],
                        "win": 3000,
                        "havewin": 0,
                        "removelist": [
                            {
                                "iconid": 5,
                                "winlines": 1,
                                "wincount": [
                                    1,
                                    1,
                                    0
                                ]
                            }
                        ],
                        "roundid": "D5797EDDD3",
                        "sceneodds": 1,
                        "balance": 92293000,
                        "scattercount": 0,
                        "createtime": 1703208881000
                    },
                    {
                        "card_list": [
                            {
                                "list": [
                                    7,
                                    9,
                                    7,
                                    8
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    11,
                                    11,
                                    5,
                                    13,
                                    9
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    1307,
                                    13,
                                    7
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    2212,
                                    4,
                                    3,
                                    4
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    210,
                                    3,
                                    1208
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    13,
                                    3,
                                    309
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    9,
                                    9,
                                    12,
                                    13,
                                    3
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            }
                        ],
                        "win": 0,
                        "havewin": 3000,
                        "removelist": [],
                        "roundid": "9E6C22C646",
                        "sceneodds": 2,
                        "balance": 92293000,
                        "scattercount": 0,
                        "createtime": 1703208881000
                    }
                ],
                "bet": 60000,
                "freetimes": 0,
                "wintotal": 3000,
                "orderid": "7-1703208881-4DB83D1F0"
            }
            responeData = data as TProtoGoldenCityBetRsp
            return { responeData: responeData, retry: retry };
        }


        await PromiseEx.HttpPost(this.getApi("bet", track), JSON.stringify(req))
            .then((xhr: XMLHttpRequest) => {
                let respone = xhr.response;
                this.clearUUID();
                // respone = this.morkBet()// 测试
                // console.log(respone)
                this.receiveData = true;
                if (!this.checkErrorCode(track, respone["error_code"])) {
                    return;
                }

                responeData = respone["data"] as TProtoGoldenCityBetRsp;
            })
            .catch((xhr: XMLHttpRequest) => {
                // console.log("bet catch" + respone);
                if (!checkCatch && this.isNeedRetry(xhr)) {
                    retry = true;
                    return;
                }
                this.checkCatch(xhr, track + `${xhr.status}`);
            })

        return { responeData: responeData, retry: retry };
    }

    private morkBet() {
        return {
            "error_code": 0,
            "data": {
                "balance": 53319500,
                "result": [
                    {
                        "card_list": [
                            {
                                "list": [
                                    9,
                                    10,
                                    7,
                                    1
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    8,
                                    8,
                                    8,
                                    12,
                                    2
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    12,
                                    7,
                                    11,
                                    4,
                                    8
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    11,
                                    1213,
                                    202
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    8,
                                    7,
                                    12,
                                    2,
                                    11
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    1210,
                                    1213,
                                    7
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            },
                            {
                                "list": [
                                    11,
                                    2,
                                    13,
                                    9,
                                    8
                                ],
                                "winpos": [],
                                "droplist": null,
                                "s2glist": null
                            }
                        ],
                        "win": 0,
                        "havewin": 0,
                        "removelist": [],
                        "roundid": "959E2D6D4E",
                        "sceneodds": 1,
                        "balance": 53319500,
                        "scattercount": 4,
                        "createtime": 1697772271000
                    }
                ],
                "bet": 30000,
                "freetimes": 10,
                "wintotal": 0,
                "orderid": "7-1697772271-5658FF504"
            }
        }
    }


    async reqFree() {
        return await this.request(this._reqFree.bind(this))
    }

    // 请求免费游戏
    async _reqFree(track: string, checkCatch: boolean) {
        let req = {
            token: this.token,
            idempotent: this.getUUID()
        } as TProtoGoldenCityFreeReq;

        let responeData: TProtoGoldenCityFreeRsp = null;
        let retry = false;
        this.receiveData = false;

        await PromiseEx.HttpPost(this.getApi("free", track), JSON.stringify(req))
            .then((xhr: XMLHttpRequest) => {
                let respone = xhr.response;
                // respone = this.morkBet()// 测试
                // console.log(respone)
                this.clearUUID();
                this.receiveData = true;
                if (!this.checkErrorCode(track, respone["error_code"])) {
                    return
                }

                responeData = respone["data"] as TProtoGoldenCityFreeRsp;
            })
            .catch((xhr: XMLHttpRequest) => {
                // console.log("free catch " + respone);
                if (!checkCatch && this.isNeedRetry(xhr)) {
                    retry = true;
                    return;
                }

                this.checkCatch(xhr, track + `${xhr.status}`);
            })

        return { responeData: responeData, retry: retry };
    }

    // 请求心跳事件
    async reqHeartBeat() {
        // let req = { token: this.token }
        // let responeData: any = null;

        // let track = this.getTrack();
        // await PromiseEx.HttpPost(this.getApi("heartbeat"), JSON.stringify(req))
        //     .then((xhr: XMLHttpRequest) => {
        //         let respone = xhr.response;
        //         if (!this.checkErrorCode(track, respone["error_code"])) {
        //             return
        //         }
        //         responeData = respone["data"];
        //     })
        //     .catch((xhr: XMLHttpRequest) => {
        //         // console.log("free catch " + respone);
        //         // this.checkCatch(xhr);
        //         this.emitter.emit(EMIT_HEART_BEAT_TIME_OUT);
        //     })

        // return responeData;
    }

    // 请求历史记录
    async reqGameRecord(startTimestamp: number, endTimestamp: number, offset: number, limit: number) {
        // let req = { token: this.token, starttime: startTimestamp, endtime: endTimestamp, limit: limit, offset: offset } as TGoldenCityRecordReq;
        // let responeData: TGoldenCityRecordRsp = null;
        // let track = this.getTrack();

        // await PromiseEx.HttpPost(this.getApi("record", track), JSON.stringify(req))
        //     .then((xhr: XMLHttpRequest) => {
        //         let respone = xhr.response;
        //         if (!this.checkErrorCode(track, respone["error_code"])) {
        //             return
        //         }
        //         responeData = respone["data"] as TGoldenCityRecordRsp;
        //     })
        //     .catch((xhr: XMLHttpRequest) => {
        //         // console.log("record.list catch " + respone);
        //         this.checkCatchRecord(xhr, track, false, "");
        //     })

        // return responeData;
        return null;
    }

    // 请求游戏记录单条详情
    async reqRecordDetail(orderid: string) {
        let req = { token: this.token, orderid: orderid } as TGoldenCityRecordDetailReq;
        let responeData: TGoldenCityRecordDetailRsp = null;
        let track = this.getTrack();

        await PromiseEx.HttpPost(this.getApi("recorddetail", track), JSON.stringify(req))
            .then((xhr: XMLHttpRequest) => {
                let respone = xhr.response;
                if (!this.checkErrorCode(track, respone["error_code"])) {
                    return
                }
                responeData = respone["data"] as TGoldenCityRecordDetailRsp;
            })
            .catch((xhr: XMLHttpRequest) => {
                // console.log("record.detail catch " + respone);
                this.checkCatchRecord(xhr, track, true, orderid);
            })

        return responeData;
    }

    // 更新音效，不许要保存
    async reqAudioMuteReq(audioSwitch: boolean) {
        // let req = { token: this.token, mute: (audioSwitch ? AudioSwitchType.ON : AudioSwitchType.OFF) } as TProtoGoldenCityMuteReq;
        // await PromiseEx.HttpPost(this.getApi("mute"), JSON.stringify(req))
    }

    // 检查错误码
    private checkErrorCode(track: string, code: number) {
        if (code == 0) {
            return true
        }

        if (code < 0) {
            console.error("客户端 错误码" + `${code}`)
        }

        if (code > 0) {
            console.error("服务器 错误码" + `${code}`)
        }

        this.emitter.emit(EMIT_RESPONE_ERROR_CODE, track + code);
    }

    private checkCatch(xhr: XMLHttpRequest, track: string) {
        this.emitter.emit(EMIT_RESPONE_ERROR_CODE, track);
    }

    // 游戏记录请求错误
    private checkCatchRecord(xhr: XMLHttpRequest, track: string, isDetail: boolean, roundNo: string) {
        let msg: string
        if (Http.isRequestNetFail(xhr)) {
            msg = l10n.t("shared_NetworkErrorMessage");
        } else if (Http.isRequestError(xhr) || Http.isRequestTimeOut(xhr)) {
            msg = l10n.t("shared_ServerErrorMessage");
        }
        else {
            msg = l10n.t("shared_unknow_error_try_again");
        }

        this.emitter.emit(EMIT_SHOW_GAME_RECORD_ERROR, msg + `(${track}${xhr.status})`, isDetail, roundNo)
    }

    // 是否重试
    private isNeedRetry(xhr: XMLHttpRequest) {
        if (Http.isRequestNetFail(xhr)) { return true; }
        if (Http.isRequestTimeOut(xhr)) { return true; }
        if (Http.isRequestError(xhr)) { return true; }
        return false;
    }

    private getUUID() {
        if (this.uuid != null) {
            return this.uuid
        }

        this.uuid = uuidv4();
        return this.uuid;
    }

    private clearUUID() {
        this.uuid = null;
    }

    private getTrack() {
        const fullUUID = uuidv4();
        const shortUUID = fullUUID.replace(/-/g, '').substring(0, 5);
        return shortUUID;
    }
}


